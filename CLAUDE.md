# CLAUDE.md

Instruktioner till Claude när du arbetar i detta repo. UI-texter är på svenska — följ samma språk i nya strängar.

## Vad projektet är

Personlig admin-hub (Next.js 15 App Router, React 19, TypeScript, Tailwind 3). **Frontend-only** — ingen backend, ingen riktig persistens. All data mockas i TS-filer. Modulerna är självständiga undersystem (JetWP, SnapTLD, Billing, File Converter, …) som registreras i en gemensam registry och renderas i admin-skalet.

## Scripts

- `npm run dev` — dev-server (localhost:3000)
- `npm run typecheck` — `tsc --noEmit`, kör alltid innan du säger att en uppgift är klar
- `npm run build` — kör efter större ändringar eller nya routes för att fånga konflikter
- `npm run lint` — `next lint`

Rensa `.next` och `tsconfig.tsbuildinfo` om TS klagar på borttagna routes.

## Katalogstruktur

```
src/
├── app/(admin)/…           Route-wrappers som re-exportar default från modules/<x>/pages/
├── components/
│   ├── ui/                  Card, Button, Dialog, ConfirmDialog, Input+Label, Table(+Th/Td/Badge), RowMenu, Skeleton, StatCard
│   ├── charts/              AreaChart, BarChart, DonutChart, RevenueCard
│   ├── layout/              PageHeader m.fl.
│   ├── toast/               ToastProvider + useToast
│   ├── command/             Command palette
│   └── theme/               Dark/light
├── config/                  navigation.ts
├── lib/utils.ts
└── modules/
    ├── registry.ts          adminModules-arrayen (ordning = nav-ordning inom area)
    ├── types.ts             AdminModuleDefinition m.fl.
    ├── jetwp/ snaptld/ billing/ file-converter/ hub/ workspace/
```

Varje modul följer mönstret:
```
modules/<mod>/
├── index.ts                 AdminModuleDefinition (id, title, area, href, icon, children, metrics)
├── pages/<Page>.tsx         Top-level sidor ("use client")
├── components/              Modulspecifik UI
├── data/                    Typer + mock-arrayer (barrel i data/index.ts om det finns flera filer)
├── lib/                     Hooks (localStorage, beräkningar)
└── [sub]/<Sub>Page.tsx      Detaljvyer, tabb-moduler
```

Routes är tunna re-exports: `src/app/(admin)/<mod>/<sub>/page.tsx` gör bara `export { FooPage as default } from "@/modules/<mod>/pages/FooPage";`.

## Lägga till en modul eller route

1. Skapa `modules/<mod>/index.ts` med en `AdminModuleDefinition` (se `modules/types.ts`). `area` är en av `"operations" | "business"`.
2. Lägg till modulen i `src/modules/registry.ts` — navigationen hämtas dynamiskt, inga `config/navigation.ts`-ändringar behövs.
3. Skapa `src/app/(admin)/<mod>/page.tsx` (+ ev. subroutes) som re-exportar.
4. För detaljvyer med params: React 19 `use(params)` mönstret — se `modules/snaptld/domain-detail/DomainDetailPage.tsx`.

## Kodmönster som MÅSTE följas

**Tailwind-tokens, inte hex.** Använd `bg-surface`, `bg-bg`, `text-fg`, `text-muted`, `border`. Tone-färger via `emerald` (success), `amber` (warning), `red` (danger), `fg/muted` för neutral. Använd `dark:`-prefix där en färg inte är semantiskt identisk i mörkt läge. Rena hexar får förekomma i chart-data och liknande props, inte i komponentklasser.

**`clsx` för villkorliga klasser.** Inga template-strängar med `${active ? … : …}`.

**`lucide-react` för ikoner.** Standardstorlekar: 11–14 i tabeller/badges, 14–16 i knappar/kort, 18–20 för hero-ikoner.

**UI-primitives först.** Använd `src/components/ui/*` och `src/components/charts/*` innan du bygger egna varianter. `Button` har varianter `primary | secondary | ghost` och saknar size-prop — anpassa höjd via `className="h-8 px-3 text-xs"` vid behov.

**Toasts för actions.** `useToast()` med `.success / .info / .error`, titel + valfri detaljrad. Alla mutationer (import, spara, schemalägg, ta bort) ska bekräftas via toast.

**Dialoger.** `Dialog` tar `title`, `description`, `size` (`sm|md|lg|xl`), `footer` (knappar). `ConfirmDialog` för destruktiva actions.

## LocalStorage-hooks (när persistens behövs)

Följ exakt samma mönster som `modules/snaptld/lib/watchlist.ts`:

- Delat modul-scoped `listeners = new Set<() => void>()`
- `read()` / `write()` helpers som notifierar listeners
- `useList(key)` returnerar `{ hydrated, values, has, count, toggle, add/addMany, remove, clear }`
- `hydrated`-flaggan avgör SSR-hydration — första render är alltid tom array/null, värden populeras i `useEffect`
- `StorageEvent`-lyssnare för cross-tab sync
- Använd `hydrated && …` i UI-checks för att undvika hydration mismatches

Exempel: `snaptld/lib/{watchlist,reviewed,notes,lastVisit}.ts`.

## Data-konventioner

Mock-data lever i `modules/<mod>/data/*.ts`. Typer och arrayer i samma fil när det är litet; annars dela upp och exportera via `data/index.ts`. Använd `slug` (url-safe) + visningsnamn. ISO-datum för tidsfält.

## Vad du INTE ska göra

- Skapa inte README/MD-filer om användaren inte bett om det.
- Skriv inte kommentarer för *vad* koden gör — bara om *varför* är icke-uppenbart.
- Lägg inte till backwards-compat-shims, feature-flaggor eller abstraktioner som inte behövs nu.
- Introducera inte nya beroenden utan att fråga. Stacken är medvetet smal (next, react, clsx, lucide-react, tailwind — det är allt).
- Fyll inte på med felhantering för fall som inte kan inträffa i frontend-mock-kod.
- Bygg inte egna ui-primitives när `src/components/ui/` redan har en som räcker.
- Amenda inte commits; gör nya. Ändra inte git-config.

## Arbetsflöde

1. Vid större tasks — använd `TaskCreate` per milstolpe, markera `in_progress` när du börjar och `completed` direkt när klart.
2. Pausa vid varje milstolpe, kör `npm run typecheck`, rapportera kort vad som gjordes, vänta på användarens klarsignal innan nästa milstolpe.
3. Använd `Edit` framför `Write` för befintliga filer. Läs filen först.
4. Parallellisera oberoende tool-anrop (flera reads, grep+glob samtidigt).

## Miljö

Windows 11, bash via Git Bash. Använd Unix-syntax (`/dev/null`, forward slashes). Arbetskatalog: `C:\Users\Fredrik\Desktop\admin`.
