import { readFileSync } from "node:fs";
import { join } from "node:path";

interface SwedishLexiconIndex {
  version: number;
  generatedAt: string;
  words: string[];
  stopwords: string[];
  lemmaByWord: Record<string, string>;
  synonymsByLemma: Record<string, string[]>;
  marketSeeds: Record<string, string[]>;
}

export interface SwedishDomainProfile {
  loaded: boolean;
  label: string;
  tokens: string[];
  segments: string[];
  exactTokenHits: string[];
  strongSegments: string[];
  weakSegments: string[];
  lemmas: string[];
  dictionaryHits: string[];
  stopwords: string[];
  synonymHits: string[];
  marketCategories: string[];
  riskWords: string[];
  commercialTerms: string[];
  personNameRisk: boolean;
  trademarkRisk: boolean;
  coverage: number;
  qualityCoverage: number;
  segmentationScore: number;
  commercialIntent: number;
  genericWordIntent: number;
  stopwordRatio: number;
  pronounceability: number;
  lengthScore: number;
  hasHyphen: boolean;
  hasDigits: boolean;
}

let cachedIndex: {
  raw: SwedishLexiconIndex;
  words: Set<string>;
  stopwords: Set<string>;
  marketTerms: Map<string, Set<string>>;
} | null = null;

const riskTerms = new Set([
  "casino",
  "kredit",
  "lån",
  "lan",
  "porr",
  "sex",
  "skuld",
  "snabblan",
  "snabblån",
  "spel",
  "vapen",
]);

const shortAllowedTerms = new Set([
  "ai",
  "ar",
  "bo",
  "el",
  "ip",
  "it",
  "mc",
  "pr",
  "tv",
  "ui",
  "ux",
  "vr",
]);

const commercialTerms = new Set([
  "bank",
  "byte",
  "bil",
  "boka",
  "bok",
  "bygg",
  "data",
  "diet",
  "foto",
  "hem",
  "hobby",
  "hyr",
  "index",
  "labs",
  "mat",
  "motor",
  "planta",
  "plant",
  "pool",
  "skol",
  "sound",
  "val",
]);

const personNameFragments = new Set([
  "andreas",
  "andrea",
  "andreasen",
  "norman",
  "alessandro",
  "alvaro",
  "leandro",
  "buehler",
]);

const knownBrandRiskTerms = new Set([
  "anaplan",
  "artipelag",
  "addax",
  "buehler",
]);

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFC")
    .replace(/å/g, "å")
    .replace(/ä/g, "ä")
    .replace(/ö/g, "ö")
    .replace(/[^a-zåäöéü0-9-]/g, "")
    .trim();
}

function labelFromDomain(domain: string) {
  return normalize(domain.split(".")[0] ?? domain);
}

function loadIndex() {
  if (cachedIndex) return cachedIndex;
  const file = join(process.cwd(), "src", "modules", "snaptld", "data", "lexicon", "generated", "swedish-lexicon.json");
  const raw = JSON.parse(readFileSync(file, "utf8")) as SwedishLexiconIndex;
  const words = new Set(raw.words);
  const stopwords = new Set(raw.stopwords);
  const marketTerms = new Map<string, Set<string>>();

  Object.entries(raw.marketSeeds).forEach(([category, seeds]) => {
    const terms = new Set<string>();
    seeds.map(normalize).filter(Boolean).forEach((seed) => {
      const lemma = raw.lemmaByWord[seed] ?? seed;
      terms.add(seed);
      terms.add(lemma);
      raw.synonymsByLemma[lemma]?.forEach((synonym) => terms.add(synonym));
    });
    marketTerms.set(category, terms);
  });

  cachedIndex = { raw, words, stopwords, marketTerms };
  return cachedIndex;
}

function safeIndex() {
  try {
    return loadIndex();
  } catch {
    return null;
  }
}

function splitTokens(label: string) {
  return label.split(/[-0-9]+/).filter(Boolean);
}

function segmentToken(token: string, words: Set<string>) {
  if (words.has(token)) return [token];
  if (token.length > 32) return [token];

  const dp: Array<{ parts: string[]; score: number } | null> = Array(token.length + 1).fill(null);
  dp[0] = { parts: [], score: 0 };
  for (let i = 0; i < token.length; i += 1) {
    if (!dp[i]) continue;
    for (let j = Math.min(token.length, i + 18); j >= i + 2; j -= 1) {
      const part = token.slice(i, j);
      if (!words.has(part)) continue;
      const len = part.length;
      const partScore = len >= 5 ? len * len : len >= 3 ? len * 4 : shortAllowedTerms.has(part) ? 3 : -8;
      const next = { parts: [...dp[i]!.parts, part], score: dp[i]!.score + partScore - 2 };
      if (!dp[j] || next.score > dp[j]!.score) dp[j] = next;
    }
  }

  if (!dp[token.length] || dp[token.length]!.parts.length === 0) return [token];
  const parts = dp[token.length]!.parts;
  const weakCount = parts.filter((part) => part.length <= 2 && !shortAllowedTerms.has(part)).length;
  if (weakCount > 0 && parts.length > 2) return [token];
  return parts;
}

function scorePronounceability(label: string) {
  const plain = label.replace(/[^a-zåäö]/g, "");
  if (!plain) return 20;
  const vowels = (plain.match(/[aeiouyåäö]/g) ?? []).length;
  const ratio = vowels / plain.length;
  const consonantClusters = plain.match(/[^aeiouyåäö]{4,}/g)?.length ?? 0;
  return Math.max(20, Math.min(95, Math.round(100 - Math.abs(0.42 - ratio) * 120 - consonantClusters * 18)));
}

function scoreLength(label: string) {
  const len = label.replace(/-/g, "").length;
  if (len <= 2) return 35;
  if (len <= 8) return 95;
  if (len <= 14) return 85;
  if (len <= 20) return 68;
  return 45;
}

function segmentStrength(segment: string) {
  if (commercialTerms.has(segment)) return 1;
  if (segment.length >= 5) return 1;
  if (segment.length >= 3) return 0.65;
  if (shortAllowedTerms.has(segment)) return 0.45;
  return 0.1;
}

function includesFragment(label: string, fragments: Set<string>) {
  return [...fragments].some((fragment) => label.includes(fragment));
}

export function analyzeSwedishDomain(domain: string): SwedishDomainProfile {
  const label = labelFromDomain(domain);
  const fallback: SwedishDomainProfile = {
    loaded: false,
    label,
    tokens: splitTokens(label),
    segments: splitTokens(label),
    exactTokenHits: [],
    strongSegments: [],
    weakSegments: [],
    lemmas: splitTokens(label),
    dictionaryHits: [],
    stopwords: [],
    synonymHits: [],
    marketCategories: [],
    riskWords: [],
    commercialTerms: [],
    personNameRisk: includesFragment(label, personNameFragments),
    trademarkRisk: includesFragment(label, knownBrandRiskTerms),
    coverage: 0,
    qualityCoverage: 0,
    segmentationScore: 0,
    commercialIntent: 0,
    genericWordIntent: 0,
    stopwordRatio: 0,
    pronounceability: scorePronounceability(label),
    lengthScore: scoreLength(label),
    hasHyphen: label.includes("-"),
    hasDigits: /\d/.test(label),
  };

  const index = safeIndex();
  if (!index) return fallback;

  const tokens = splitTokens(label);
  const exactTokenHits = tokens.filter((token) => index.words.has(token));
  const segments = tokens.flatMap((token) => segmentToken(token, index.words));
  const lemmas = segments.map((segment) => index.raw.lemmaByWord[segment] ?? segment);
  const dictionaryHits = segments.filter((segment) => index.words.has(segment));
  const strongSegments = dictionaryHits.filter((segment) => segmentStrength(segment) >= 0.65);
  const weakSegments = dictionaryHits.filter((segment) => segmentStrength(segment) < 0.65);
  const stopwords = lemmas.filter((lemma) => index.stopwords.has(lemma));
  const synonymHits = [...new Set(lemmas.flatMap((lemma) => index.raw.synonymsByLemma[lemma] ?? []))].slice(0, 8);
  const marketCategories = [...index.marketTerms.entries()]
    .filter(([, terms]) => lemmas.some((lemma) => terms.has(lemma)) || synonymHits.some((synonym) => terms.has(synonym)))
    .map(([category]) => category);
  const riskWords = lemmas.filter((lemma) => riskTerms.has(lemma));
  const matchedCommercialTerms = [...new Set(
    [...segments, ...lemmas].filter((term) => commercialTerms.has(term)),
  )];
  const genericWordIntent = tokens.length === 1
    && segments.length === 1
    && dictionaryHits.length === 1
    && segmentStrength(segments[0] ?? "") >= 1
    ? 0.7
    : 0;
  const weightedCoverage = segments.length > 0
    ? segments.reduce((sum, segment) => sum + (index.words.has(segment) ? segmentStrength(segment) : 0), 0) / segments.length
    : 0;
  const splitPenalty = Math.max(0, segments.length - tokens.length - 1) * 0.12;
  const segmentationScore = Math.max(0, Math.min(1, weightedCoverage - splitPenalty));
  const commercialIntent = Math.max(
    matchedCommercialTerms.length > 0 ? Math.min(1, matchedCommercialTerms.length / 2) : 0,
    marketCategories.length > 0 && strongSegments.length >= 1 ? 0.55 : 0,
    genericWordIntent,
  );

  return {
    loaded: true,
    label,
    tokens,
    segments,
    exactTokenHits,
    strongSegments,
    weakSegments,
    lemmas,
    dictionaryHits,
    stopwords,
    synonymHits,
    marketCategories,
    riskWords,
    commercialTerms: matchedCommercialTerms,
    personNameRisk: includesFragment(label, personNameFragments),
    trademarkRisk: includesFragment(label, knownBrandRiskTerms),
    coverage: segments.length > 0 ? dictionaryHits.length / segments.length : 0,
    qualityCoverage: weightedCoverage,
    segmentationScore,
    commercialIntent,
    genericWordIntent,
    stopwordRatio: segments.length > 0 ? stopwords.length / segments.length : 0,
    pronounceability: scorePronounceability(label),
    lengthScore: scoreLength(label),
    hasHyphen: label.includes("-"),
    hasDigits: /\d/.test(label),
  };
}
