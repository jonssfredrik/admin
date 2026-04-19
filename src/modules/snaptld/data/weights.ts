export const defaultWeightsYaml = `# SnapTLD scoring weights
# Summan av vikterna normaliseras automatiskt till 100.
# Ändra värdena nedan för att justera hur totalpoängen beräknas.

weights:
  structure: 12     # längd, tecken, stavning
  lexical: 12       # svenska ord, vokaler, begriplighet
  brand: 16         # varumärkespotential
  market: 14        # målgrupp och kommersiell intent
  risk: 10          # TM-krockar, juridik
  salability: 14    # flip-barhet
  seo: 12           # Moz DA/PA, backlinks
  history: 10       # Wayback Machine

thresholds:
  excellent: 82
  good: 65
  mediocre: 45

ai:
  model: gpt-5.4
  enabledCategories: [brand, market, risk, salability]
  temperature: 0.3

sources:
  - id: iis-se
    enabled: true
  - id: iis-nu
    enabled: true
  - id: expired-global
    enabled: false
`;
