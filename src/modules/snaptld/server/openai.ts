import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Signal, Tone } from "@/modules/snaptld/types";
import type { SwedishDomainProfile } from "./swedish-lexicon";
import { iisLifecycleDates, iisPhaseInfo, isIisSource } from "@/modules/snaptld/lib/iis-lifecycle";

const LOG_DIR = join(process.cwd(), "logs", "snaptld", "openai");

async function writeRequestLog(
  label: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  rawResponse: unknown,
): Promise<void> {
  try {
    await mkdir(LOG_DIR, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const safeName = label.replace(/[^a-z0-9._-]/gi, "_").slice(0, 60);
    const filename = join(LOG_DIR, `${ts}_${safeName}.txt`);

    const responseStr =
      rawResponse === null
        ? "INGET SVAR (fel eller timeout)"
        : typeof rawResponse === "string"
          ? rawResponse
          : JSON.stringify(rawResponse, null, 2);

    const content = [
      `=== SnapTLD / OpenAI Request Log ===`,
      `Tidpunkt : ${new Date().toISOString()}`,
      `Fil      : ${filename.split(/[\\/]/).pop()}`,
      `Modell   : ${model}`,
      ``,
      `=== SYSTEMPROMPT ===`,
      systemPrompt,
      ``,
      `=== PROMPT ===`,
      userPrompt,
      ``,
      `=== SVAR (rå JSON) ===`,
      responseStr,
    ].join("\n");

    await writeFile(filename, content, "utf8");
  } catch (err) {
    console.error("[SnapTLD/OpenAI] Kunde inte skriva loggfil:", err);
  }
}

const VALID_TONES = new Set<Tone>(["success", "warning", "danger", "neutral"]);

const SYSTEM_PROMPT =
  "Du är en erfaren domänmäklare och namnstrateg med specialisering på svenska marknaden. Du utvärderar utgångna domäner inför återregistrering eller vidareförsäljning — dina poäng och signaler används direkt som beslutsunderlag. Var konkret och kalibrerande. Returnera enbart giltig JSON.";

const SCORING_GUIDE = `Poängguide — var kalibrerande, inte generös:
· brand (0–30): 25–30 = omedelbart igenkännbar, fungerar på flera marknader; 15–24 = fungerande men nischad; 0–14 = svårminnt eller problematisk
· market (0–40): 32–40 = uppenbar köparkategori, tydlig kommersiell avsikt; 20–31 = plausibel nisch; 0–19 = diffus, oklar målgrupp
· risk (0–50): 45–50 = rent, inga kända konflikter; 30–44 = mindre bekymmer att granska; 0–29 = tydliga varumärkes- eller juridiska risker
· salability (0–40): 32–40 = flera sannolika köpare, €1 000+; 20–31 = möjlig försäljning med rätt köpare; 0–19 = svårplacerad`;

const SIGNAL_FORMAT = `Signalformat:
· label: kort substantivfras ("Uttal", "Nischträff", "Varumärkeskonflikt", "Köparpool")
· value: en specifik, observerbar iakttagelse för just denna domän — inte en generisk regel
· tone: success (positivt fynd) | warning (liten oro) | danger (tydlig risk) | neutral (fakta utan värdering)`;

interface AiCategoryScore {
  score: number;
  verdict: string;
  signals: Signal[];
}

export interface AiDomainAnalysis {
  brand: AiCategoryScore;
  market: AiCategoryScore;
  risk: AiCategoryScore;
  salability: AiCategoryScore;
  summary: string;
}

export interface AiAnalysisContext {
  tld: string;
  expiresAt: string;
  source: string;
  localBrandScore: number;
  localMarketScore: number;
  localRiskScore: number;
  localSalabilityScore: number;
  registeredAt?: string;   // ISO date from WHOIS/RDAP, e.g. "2009-03-14"
  domainAgeYears?: number; // decimal years since registration
}

export interface AiBatchItem {
  domain: string;
  profile: SwedishDomainProfile;
  ctx: AiAnalysisContext;
}

// ── Parsing helpers ──────────────────────────────────────────────────────────

function clampInt(value: unknown, min: number, max: number): number {
  const n = typeof value === "number" ? value : Number(value);
  return Math.max(min, Math.min(max, Number.isFinite(n) ? Math.round(n) : 0));
}

function parseSignals(raw: unknown): Signal[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, 4)
    .map((item): Signal | null => {
      if (!item || typeof item !== "object") return null;
      const r = item as Record<string, unknown>;
      const label = String(r.label ?? "").trim();
      const value = String(r.value ?? "").trim();
      if (!label || !value) return null;
      const tone: Tone = VALID_TONES.has(r.tone as Tone) ? (r.tone as Tone) : "neutral";
      return { label, value, tone };
    })
    .filter((s): s is Signal => s !== null);
}

function parseCategory(raw: unknown, max: number): AiCategoryScore | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  return {
    score: clampInt(r.score, 0, max),
    verdict: String(r.verdict ?? "").trim(),
    signals: parseSignals(r.signals),
  };
}

function parseDomainResult(raw: unknown): AiDomainAnalysis | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const brand = parseCategory(r.brand, 30);
  const market = parseCategory(r.market, 40);
  const risk = parseCategory(r.risk, 50);
  const salability = parseCategory(r.salability, 40);
  if (!brand || !market || !risk || !salability) return null;
  return { brand, market, risk, salability, summary: String(r.summary ?? "").trim() };
}

// ── Prompt helpers ───────────────────────────────────────────────────────────

function formatExpiry(expiresAt: string, source = ""): string {
  if (isIisSource(source)) {
    const { phase, daysUntilRelease, dates } = iisPhaseInfo(expiresAt);
    const d = Math.abs(daysUntilRelease);
    const lifecycle = `förföll ${dates.expiresAt} → deaktiverades ${dates.deactivatedAt} → avregistreras ${dates.deregisteredAt} → frisläpps ${dates.releasedAt}`;
    const status =
      phase === "released" ? "redan frisläppt" :
      phase === "deregistered" ? `frisläpps om ${d} dagar` :
      phase === "deactivated" ? `deaktiverad, frisläpps om ${d} dagar` :
      phase === "expired" ? `utgången, deaktiveras snart` :
      `löper ut ${dates.expiresAt}`;
    return `${status} · ${lifecycle}`;
  }
  const date = new Date(expiresAt);
  if (isNaN(date.getTime())) return expiresAt;
  const days = Math.round((date.getTime() - Date.now()) / 86_400_000);
  if (days < 0) return `utgick för ${Math.abs(days)} dagar sedan`;
  if (days === 0) return "utgår idag";
  return `utgår om ${days} dagar (${date.toISOString().slice(0, 10)})`;
}

const SINGLE_DOMAIN_OUTPUT_TEMPLATE = `{
  "brand":      { "score": 22, "verdict": "En mening om vad som gör domänen minnesvärd eller inte.", "signals": [{"label":"Uttal","value":"...","tone":"success"},{"label":"Unicitet","value":"...","tone":"warning"}] },
  "market":     { "score": 31, "verdict": "En mening: vem köper detta och varför?", "signals": [...] },
  "risk":       { "score": 44, "verdict": "En mening: primär risk eller frånvaro av risk.", "signals": [...] },
  "salability": { "score": 28, "verdict": "En mening: realistiskt återförsäljningsscenario eller varför det är svårt.", "signals": [...] },
  "summary":    "2 meningar: konkret rekommendation (registrera nu / bevaka / skippa) med motivering."
}`;

function buildSinglePrompt(domain: string, profile: SwedishDomainProfile, ctx: AiAnalysisContext): string {
  const { label, segments, dictionaryHits, synonymHits, marketCategories, riskWords, pronounceability, lengthScore, coverage, hasHyphen, hasDigits } = profile;
  const coveragePct = Math.round(coverage * 100);
  const flags = [hasHyphen && "bindestreck", hasDigits && "siffror"].filter(Boolean).join(", ") || "inga";

  const ageNote =
    ctx.registeredAt && ctx.domainAgeYears !== undefined
      ? ` · Registrerad: ${ctx.registeredAt} (${ctx.domainAgeYears >= 1 ? `${Math.floor(ctx.domainAgeYears)} år` : `${Math.floor(ctx.domainAgeYears * 12)} mån`} gammal)`
      : "";

  return `Domän: "${domain}" (${ctx.tld}, ${formatExpiry(ctx.expiresAt, ctx.source)}${ageNote})

=== Lexikal analys ===
Label: "${label}" · Längd: ${label.length} tecken · Specialtecken: ${flags}
Ordsegment: ${segments.length > 0 ? segments.join(" · ") : label}
Svenska ordträffar (${coveragePct}% täckning): ${dictionaryHits.length > 0 ? dictionaryHits.join(", ") : "inga"}
Synonymer/relaterade: ${synonymHits.length > 0 ? synonymHits.slice(0, 5).join(", ") : "inga"}
Marknadskategorier: ${marketCategories.length > 0 ? marketCategories.join(", ") : "inga"}
Riskord: ${riskWords.length > 0 ? riskWords.join(", ") : "inga"}
Uttalbarhet: ${pronounceability}/100 · Längdpoäng: ${lengthScore}/100

=== Lokala poäng (lexikonbaserade, exkl. AI-del) ===
Varumärke: ${ctx.localBrandScore}/70 · Marknad: ${ctx.localMarketScore}/60 · Risk: ${ctx.localRiskScore}/50 · Säljbarhet: ${ctx.localSalabilityScore}/60

=== Uppgift ===
Sätt poäng för AI-delen av varje dimension och ge 2–3 konkreta, domänspecifika signaler.
Signalerna ska gälla just "${label}" — inte generiska påståenden som "korta domäner är bra".

Returnera exakt detta JSON:
${SINGLE_DOMAIN_OUTPUT_TEMPLATE}

${SCORING_GUIDE}

${SIGNAL_FORMAT}`;
}

function buildDomainBlock({ domain, profile, ctx }: AiBatchItem): string {
  const { label, segments, dictionaryHits, synonymHits, marketCategories, riskWords, pronounceability, lengthScore } = profile;
  const hits = dictionaryHits.length > 0 ? dictionaryHits.join(", ") : "-";
  const market = marketCategories.length > 0 ? marketCategories.join(", ") : "-";
  const risk = riskWords.length > 0 ? riskWords.join(", ") : "-";
  const syns = synonymHits.length > 0 ? synonymHits.slice(0, 4).join(", ") : "-";
  const segs = segments.length > 0 ? segments.join(" · ") : label;
  const ageNote =
    ctx.registeredAt && ctx.domainAgeYears !== undefined
      ? ` · Reg: ${ctx.registeredAt} (${ctx.domainAgeYears >= 1 ? `${Math.floor(ctx.domainAgeYears)}år` : `${Math.floor(ctx.domainAgeYears * 12)}mån`})`
      : "";
  return [
    `[${domain}] (${formatExpiry(ctx.expiresAt, ctx.source)}${ageNote})`,
    `Label "${label}" · Segment: ${segs} | Träffar: ${hits} | Marknad: ${market} | Risk: ${risk} | Synonymer: ${syns}`,
    `Uttal ${pronounceability}/100 · Längd ${lengthScore}/100 | Lokal: Brand ${ctx.localBrandScore}/70 · Market ${ctx.localMarketScore}/60 · Risk ${ctx.localRiskScore}/50 · Salability ${ctx.localSalabilityScore}/60`,
  ].join("\n");
}

function buildBatchPrompt(items: AiBatchItem[]): string {
  const domainBlocks = items.map(buildDomainBlock).join("\n\n");
  const exampleKey = items[0]?.domain ?? "example.se";
  const outputTemplate = `{
  "${exampleKey}": {
    "brand":      {"score": 22, "verdict": "...", "signals": [{"label":"...","value":"...","tone":"success|warning|danger|neutral"}]},
    "market":     {"score": 31, "verdict": "...", "signals": [...]},
    "risk":       {"score": 44, "verdict": "...", "signals": [...]},
    "salability": {"score": 28, "verdict": "...", "signals": [...]},
    "summary":    "2 meningar: rekommendation (registrera nu / bevaka / skippa) med motivering."
  },
  ...
}`;

  return `Analysera ${items.length} utgångna domäner. Returnera ett JSON-objekt med fullständigt domännamn som nyckel.

${domainBlocks}

Returnera exakt detta format (en nyckel per domän ovan):
${outputTemplate}

${SCORING_GUIDE}

${SIGNAL_FORMAT}
Signalerna ska vara specifika för respektive domän — inte generiska regler.`;
}

// ── API calls ────────────────────────────────────────────────────────────────

function errorMessage(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

async function callOpenAi(
  label: string,
  prompt: string,
  apiKey: string,
  model: string,
  maxTokens: number,
): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.35,
        max_tokens: maxTokens,
      }),
      signal: AbortSignal.timeout(90_000),
    });
  } catch (error) {
    const msg = errorMessage(error);
    console.error("[SnapTLD/OpenAI] Fetch failed:", msg);
    await writeRequestLog(label, model, SYSTEM_PROMPT, prompt, `FEL (nätverket): ${msg}`);
    return null;
  }

  if (!response.ok) {
    const body = await response.text().catch(() => response.statusText);
    console.error(`[SnapTLD/OpenAI] API error ${response.status}:`, body);
    await writeRequestLog(label, model, SYSTEM_PROMPT, prompt, `HTTP ${response.status}: ${body}`);
    return null;
  }

  let rawContent: string | null = null;
  try {
    const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    rawContent = payload.choices?.[0]?.message?.content ?? null;
    await writeRequestLog(label, model, SYSTEM_PROMPT, prompt, rawContent ?? "FEL: tomt svar från API (choices saknas eller content är null)");
    if (!rawContent) return null;
    return JSON.parse(rawContent) as unknown;
  } catch (error) {
    const msg = errorMessage(error);
    console.error("[SnapTLD/OpenAI] Response parse failed:", msg);
    await writeRequestLog(label, model, SYSTEM_PROMPT, prompt, `FEL (JSON-parsning): ${msg}${rawContent ? `\n\nRå text:\n${rawContent}` : ""}`);
    return null;
  }
}

// Single domain — used for rerunAnalysis
export async function runOpenAiAnalysis(
  domain: string,
  profile: SwedishDomainProfile,
  apiKey: string,
  ctx: AiAnalysisContext,
  model = "gpt-4o-mini",
): Promise<AiDomainAnalysis | null> {
  const raw = await callOpenAi(domain, buildSinglePrompt(domain, profile, ctx), apiKey, model, 900);
  return raw ? parseDomainResult(raw) : null;
}

// Batch (up to 10 domains) — used for analyzeQueue and importDomains
export async function runOpenAiAnalysisBatch(
  items: AiBatchItem[],
  apiKey: string,
  model = "gpt-4o-mini",
): Promise<Map<string, AiDomainAnalysis>> {
  const results = new Map<string, AiDomainAnalysis>();
  if (items.length === 0) return results;

  const maxTokens = Math.min(5000, items.length * 500 + 300);
  const label = `batch-${items.length}_${items.map((i) => i.domain).join("_").slice(0, 50)}`;
  const raw = await callOpenAi(label, buildBatchPrompt(items), apiKey, model, maxTokens);
  if (!raw || typeof raw !== "object") return results;

  for (const item of items) {
    const domainData = (raw as Record<string, unknown>)[item.domain];
    const parsed = parseDomainResult(domainData);
    if (parsed) results.set(item.domain, parsed);
  }

  return results;
}
