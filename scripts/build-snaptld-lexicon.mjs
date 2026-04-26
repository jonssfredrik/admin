import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const rawDir = join(root, "src", "modules", "snaptld", "data", "lexicon", "raw");
const outFile = join(root, "src", "modules", "snaptld", "data", "lexicon", "generated", "swedish-lexicon.json");

const normalize = (value) =>
  value
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^a-zåäöéü-]/g, "")
    .trim();

const isWord = (value) => /^[a-zåäöéü-]{2,32}$/i.test(value) && !value.includes("--");
const readLines = (file) => readFileSync(join(rawDir, file), "utf8").split(/\r?\n/);

function buildWords() {
  const words = new Set();
  for (const line of readLines("swe_wordlist.csv")) {
    const word = normalize(line);
    if (isWord(word)) words.add(word);
  }
  return [...words].sort();
}

function buildStopwords() {
  return [...new Set(readLines("stoppord.csv").map(normalize).filter(isWord))].sort();
}

function buildLemmas(wordSet) {
  const lemmaByWord = {};
  for (const line of readLines("lemmatization.csv").slice(1)) {
    const [lemmaRaw, wordRaw] = line.split(",");
    const lemma = normalize(lemmaRaw ?? "");
    const word = normalize(wordRaw ?? "");
    if (!isWord(lemma) || !isWord(word) || !wordSet.has(lemma)) continue;
    if (!lemmaByWord[word]) lemmaByWord[word] = lemma;
  }
  return lemmaByWord;
}

function senseToWord(value) {
  return normalize((value.split("..")[0] ?? "").replace(/_/g, "-"));
}

function buildSynonyms(wordSet) {
  const xml = readFileSync(join(rawDir, "swesaurus.xml"), "utf8");
  const synonyms = new Map();
  const sensePattern = /<Sense id="([^"]+)">([\s\S]*?)<\/Sense>/g;
  let senseMatch;

  while ((senseMatch = sensePattern.exec(xml))) {
    const source = senseToWord(senseMatch[1]);
    if (!isWord(source) || !wordSet.has(source)) continue;

    const body = senseMatch[2];
    const relationPattern = /<SenseRelation targets="([^"]+)">([\s\S]*?)<\/SenseRelation>/g;
    let relationMatch;
    while ((relationMatch = relationPattern.exec(body))) {
      const target = senseToWord(relationMatch[1]);
      const relation = relationMatch[2];
      const label = relation.match(/att="label" val="([^"]+)"/)?.[1];
      const degree = Number(relation.match(/att="degree" val="([^"]+)"/)?.[1] ?? "0");
      if (label !== "syn" || degree < 80 || !isWord(target) || !wordSet.has(target) || target === source) continue;
      if (!synonyms.has(source)) synonyms.set(source, new Set());
      synonyms.get(source).add(target);
    }
  }

  return Object.fromEntries(
    [...synonyms.entries()]
      .map(([word, values]) => [word, [...values].slice(0, 12).sort()])
      .filter(([, values]) => values.length > 0)
      .sort(([a], [b]) => a.localeCompare(b, "sv")),
  );
}

const marketSeeds = {
  ekonomi: ["bank", "budget", "ekonomi", "faktura", "finans", "kredit", "lan", "lån", "pengar", "skatt"],
  forsakring: ["försäkring", "forsakring", "pension", "premie", "skydd", "trygghet"],
  juridik: ["avtal", "juridik", "jurist", "lag", "rätt", "skuld", "tvist"],
  bygg: ["bygg", "el", "golv", "hem", "hus", "målare", "renovering", "snickare", "tak", "vvs"],
  halsa: ["apotek", "diet", "frisk", "hälsa", "klinik", "läkare", "träning", "vård"],
  bil: ["bil", "dack", "däck", "fordon", "garage", "leasing", "motor", "verkstad"],
  boende: ["bostad", "hem", "hyra", "lägenhet", "mäklare", "villa"],
  utbildning: ["kurs", "lära", "skola", "studera", "utbildning"],
  resor: ["flyg", "hotell", "resa", "resor", "semester", "turism"],
  handel: ["butik", "ehandel", "handel", "köp", "pris", "rea", "shop"],
};

const words = buildWords();
const wordSet = new Set(words);
const payload = {
  version: 1,
  generatedAt: new Date().toISOString(),
  words,
  stopwords: buildStopwords(),
  lemmaByWord: buildLemmas(wordSet),
  synonymsByLemma: buildSynonyms(wordSet),
  marketSeeds,
};

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, `${JSON.stringify(payload)}\n`);
console.log(`Wrote ${outFile}`);
console.log(`words=${payload.words.length} stopwords=${payload.stopwords.length} lemmas=${Object.keys(payload.lemmaByWord).length} synonyms=${Object.keys(payload.synonymsByLemma).length}`);
