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
  lemmas: string[];
  dictionaryHits: string[];
  stopwords: string[];
  synonymHits: string[];
  marketCategories: string[];
  riskWords: string[];
  coverage: number;
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

  const dp: Array<string[] | null> = Array(token.length + 1).fill(null);
  dp[0] = [];
  for (let i = 0; i < token.length; i += 1) {
    if (!dp[i]) continue;
    for (let j = Math.min(token.length, i + 18); j >= i + 2; j -= 1) {
      const part = token.slice(i, j);
      if (!words.has(part)) continue;
      const next = [...dp[i]!, part];
      if (!dp[j] || next.join("").length > dp[j]!.join("").length) dp[j] = next;
    }
  }

  return dp[token.length] && dp[token.length]!.length > 0 ? dp[token.length]! : [token];
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

export function analyzeSwedishDomain(domain: string): SwedishDomainProfile {
  const label = labelFromDomain(domain);
  const fallback: SwedishDomainProfile = {
    loaded: false,
    label,
    tokens: splitTokens(label),
    segments: splitTokens(label),
    lemmas: splitTokens(label),
    dictionaryHits: [],
    stopwords: [],
    synonymHits: [],
    marketCategories: [],
    riskWords: [],
    coverage: 0,
    stopwordRatio: 0,
    pronounceability: scorePronounceability(label),
    lengthScore: scoreLength(label),
    hasHyphen: label.includes("-"),
    hasDigits: /\d/.test(label),
  };

  const index = safeIndex();
  if (!index) return fallback;

  const tokens = splitTokens(label);
  const segments = tokens.flatMap((token) => segmentToken(token, index.words));
  const lemmas = segments.map((segment) => index.raw.lemmaByWord[segment] ?? segment);
  const dictionaryHits = segments.filter((segment) => index.words.has(segment));
  const stopwords = lemmas.filter((lemma) => index.stopwords.has(lemma));
  const synonymHits = [...new Set(lemmas.flatMap((lemma) => index.raw.synonymsByLemma[lemma] ?? []))].slice(0, 8);
  const marketCategories = [...index.marketTerms.entries()]
    .filter(([, terms]) => lemmas.some((lemma) => terms.has(lemma)) || synonymHits.some((synonym) => terms.has(synonym)))
    .map(([category]) => category);
  const riskWords = lemmas.filter((lemma) => riskTerms.has(lemma));

  return {
    loaded: true,
    label,
    tokens,
    segments,
    lemmas,
    dictionaryHits,
    stopwords,
    synonymHits,
    marketCategories,
    riskWords,
    coverage: segments.length > 0 ? dictionaryHits.length / segments.length : 0,
    stopwordRatio: segments.length > 0 ? stopwords.length / segments.length : 0,
    pronounceability: scorePronounceability(label),
    lengthScore: scoreLength(label),
    hasHyphen: label.includes("-"),
    hasDigits: /\d/.test(label),
  };
}
