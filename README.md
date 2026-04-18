# Admin

Intern adminpanel byggd med Next.js 15, React 19, TypeScript och Tailwind CSS.

Projektet innehaller ett generellt admingranssnitt med dashboard, analytics, users och settings, men den storsta och mest utbyggda modulen ar `JetWP`: ett kontrollplan for hanterad WordPress-drift med sajter, jobb, alerts, inventory, onboarding, workflows och flera driftverktyg.

## Teknik

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Lucide React

## Kom igang

### Krav

- Node.js 18+ rekommenderas
- npm

### Installera beroenden

```bash
npm install
```

### Starta utvecklingsserver

```bash
npm run dev
```

Appen kor da normalt pa:

```text
http://localhost:3000
```

### Bygg for produktion

```bash
npm run build
```

### Starta produktionsbuild lokalt

```bash
npm run start
```

### Typkontroll

```bash
npm run typecheck
```

## Scripts

I `package.json` finns foljande scripts:

- `npm run dev` startar Next.js i utvecklingslage
- `npm run build` bygger appen for produktion
- `npm run start` startar den byggda appen
- `npm run typecheck` kor TypeScript utan emit

## Projektstruktur

```text
src/
  app/
    (admin)/           Adminytor och JetWP-modulen
    login/             Inloggning
    register/          Registrering
    forgot-password/   Glomt losenord
  components/
    charts/            Diagram och visualiseringar
    command/           Command palette
    layout/            Sidebar, topbar, page header
    theme/             Tema och dark/light-mode
    toast/             Toast-system
    ui/                Ateranvandbara UI-komponenter
  lib/
    utils.ts
```

## JetWP

`JetWP` ar projektets mest omfattande delsystem och ligger under:

```text
src/app/(admin)/jetwp
```

Modulen fungerar som ett UI for ett WordPress-kontrollplan och innehaller bland annat:

- oversikt for hela flottan av WordPress-sajter
- lista over sajter och detaljsidor per sajt
- jobbko och jobbdetaljer
- alerts och aktivitet
- serverhalsa och inventarie
- onboarding av nya sajter/agenter
- workflows
- security, notifications, integrations, reports, agents, backups, staging, access och bulk update

Viktig detalj: i nulaget ar detta framfor allt en frontend/mockad adminpanel. Mycket av datat ligger i lokala TypeScript-filer, till exempel:

- `src/app/(admin)/jetwp/data.ts`
- `src/app/(admin)/jetwp/fleet.ts`
- `src/app/(admin)/jetwp/extended-data.ts`
- `src/app/(admin)/jetwp/workflow/templates.ts`

Det betyder att projektet ar val lampat for UI-utveckling, prototyping och fortsatt produktdesign, men inte annu ar kopplat till en riktig backend eller databas.

## Viktiga filer

- `src/app/(admin)/layout.tsx`
  Adminlayout med sidebar, topbar och command palette

- `src/components/layout/Sidebar.tsx`
  Navigationen for hela adminpanelen

- `src/app/(admin)/jetwp/page.tsx`
  JetWP-oversikten

- `src/app/(admin)/jetwp/[id]/page.tsx`
  Detaljvy for en enskild sajt

- `src/app/(admin)/jetwp/alerts/page.tsx`
  Alerts-flodet, inklusive losningskommentarer via modal

## Arbetsmodell i projektet

Projektet anvander i huvudsak:

- lokala stateful klientkomponenter
- mockad data i TypeScript-filer
- ateranvandbara UI-komponenter i `src/components/ui`

Det finns i nulaget ingen tydlig server-side API-layer, ingen ORM och ingen databasanslutning i repot.

## Felsokning

### Port 3000 ar upptagen

Om `localhost:3000` redan anvands kan du stanga processen och starta om:

```powershell
$conn = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($conn) {
  $processIds = $conn | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($processId in $processIds) {
    Stop-Process -Id $processId -Force
  }
}
```

### Konstig dev-cache eller trasig route i utvecklingslage

Rensa `.next` och starta om dev-servern:

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

## Vidareutveckling

Naturliga nasta steg for projektet:

- koppla JetWP till riktig backend/API
- lagga till persistens for sajter, jobb, alerts och kommentarer
- infors server actions eller API-routes for mutationer
- koppla auth och behorighet till riktiga anvandare
- lagga till tester for kritiska floden

## Status

Projektet bygger och typkontrollerar lokalt med:

```bash
npm run typecheck
npm run build
```
