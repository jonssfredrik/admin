# Admin Hub

Intern frontend-only adminpanel byggd med Next.js 15, React 19, TypeScript och Tailwind CSS.

Projektet är nu strukturerat som en modulär plattform där admin-panelen är produkten, och enskilda system lever som moduler ovanpå ett gemensamt shell. `JetWP` är en av dessa moduler och fungerar som kontrollpanel för ett Managed WordPress-projekt.

## Översikt

Admin Hub är tänkt som en personlig och verksamhetsmässig hub för flera typer av arbetsytor och verktyg, till exempel:

- JetWP för Managed WordPress-drift
- domänhantering och portföljöversikt
- manuell fakturering
- användar- och inställningsytor
- framtida moduler som kalender, todo, abonnemang, nyhetsflöden och konverterare

Fokus i repot är just nu frontend, informationsarkitektur och modulär produktstruktur. Data är fortfarande mockad i TypeScript-filer och det finns ingen backend, databas eller auth-kedja kopplad ännu.

## Teknik

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Lucide React

## Kom igång

### Krav

- Node.js 18+ rekommenderas
- npm

### Installera

```bash
npm install
```

### Starta utvecklingsserver

```bash
npm run dev
```

Appen kör normalt på:

```text
http://localhost:3000
```

### Bygg för produktion

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

- `npm run dev` startar Next.js i utvecklingsläge
- `npm run build` bygger appen för produktion
- `npm run start` startar den byggda appen
- `npm run typecheck` kör TypeScript utan emit

## Arkitektur

Projektet är uppdelat i tre huvudsakliga lager:

1. `app`
   App Router och tunna route-wrappers.
2. `modules`
   Faktisk featurekod per modul.
3. `components`
   Delat shell och återanvändbara UI-primitives.

Det innebär att `src/app/(admin)` i första hand innehåller routing och layout, medan sidor och modul-logik ligger under `src/modules/...`.

## Projektstruktur

```text
src/
  app/
    (admin)/                 Routinglager för admin-panelen
    login/                   Inloggning
    register/                Registrering
    forgot-password/         Glömt lösenord

  config/
    navigation.ts            Central navigation och command palette-data

  components/
    charts/                  Diagram och visualiseringar
    command/                 Command palette
    layout/                  Sidebar, topbar, page header
    theme/                   Tema och dark/light mode
    toast/                   Toast-system
    ui/                      Återanvändbara UI-komponenter

  modules/
    hub/                     Global startsida och hubbrelaterade vyer
    jetwp/                   Managed WordPress-modul
    domains/                 Domänmodul
    billing/                 Faktureringsmodul
    workspace/
      users/                 Användarmodul
      settings/              Inställningsmodul
    registry.ts              Modulregister
    types.ts                 Gemensamma modul- och nav-typer
```

## Nuvarande moduler

### Hub

Global startsida för hela admin-panelen. Visar modulöversikt, områden och tvärmodulär aktivitet.

Viktig fil:

- `src/modules/hub/pages/HubHomePage.tsx`

### JetWP

Den mest omfattande modulen i projektet just nu. JetWP fungerar som kontrollpanel för Managed WordPress och innehåller bland annat:

- översikt för hela flottan
- sajtlistor och detaljvyer
- jobb och jobbdetaljer
- alerts, aktivitet och serverhälsa
- inventory, notifications, integrations och reports
- backups, staging, onboarding, workflows, agents, access och bulk update

JetWP är nu strukturerad som en riktig modul under:

```text
src/modules/jetwp
```

Route-filer under `src/app/(admin)/jetwp/...` är i huvudsak bara wrappers som pekar vidare till modulfilerna.

Viktiga filer:

- `src/modules/jetwp/page.tsx`
- `src/modules/jetwp/[id]/page.tsx`
- `src/modules/jetwp/data/core.ts`
- `src/modules/jetwp/fleet/core.ts`
- `src/modules/jetwp/extended-data/core.ts`
- `src/modules/jetwp/workflow/templates-core.ts`

### Domains

Valideringsmodul för domänhantering, portfölj och operativ status.

Viktiga filer:

- `src/modules/domains/index.ts`
- `src/modules/domains/pages/DomainsPage.tsx`

### Billing

Valideringsmodul för manuell fakturering och överblick över fakturaflöden.

Viktiga filer:

- `src/modules/billing/index.ts`
- `src/modules/billing/pages/BillingPage.tsx`

### Workspace

Gemensamma interna arbetsytor för användare och inställningar.

Viktiga filer:

- `src/modules/workspace/users/pages/UsersPage.tsx`
- `src/modules/workspace/settings/pages/SettingsPage.tsx`

## Navigation och shell

Admin-panelen använder ett gemensamt plattformsshell:

- `src/app/(admin)/layout.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/Topbar.tsx`
- `src/components/command/CommandPalette.tsx`

Navigation, modulhighlight och command palette-data definieras centralt i:

- `src/config/navigation.ts`
- `src/modules/registry.ts`

Det gör att nya moduler kan läggas till i plattformen utan att sidebar och command palette behöver hårdkodas separat.

## Data och arbetsmodell

Projektet använder just nu:

- klienttunga React-komponenter
- mockad data i TypeScript-filer
- gemensamma UI-primitives i `src/components/ui`
- frontend-only-flöden utan riktig persistens

Det finns i nuläget:

- ingen databas
- ingen backend/API-layer
- ingen ORM
- ingen riktig auth-kedja
- inga tester i repot

## Status

Kodbasen är nyligen plattformiserad och uppstädad:

- admin-shell och navigation är moduldrivna
- JetWP är flyttad till `src/modules/jetwp`
- hub, domains, billing, users och settings följer modulmönstret
- textkodning och UI-text är sanerad i `src`

Verifierat lokalt med:

```bash
npm run typecheck
npm run build
```

## Nästa steg

Naturliga nästa steg för projektet är:

- bygga fler riktiga moduler för admin-hubben
- koppla utvalda moduler till riktig backend/API
- införa persistens för exempelvis JetWP, domains och billing
- lägga till auth och behörighetsmodell
- lägga till tester för kritiska flöden

## Felsökning

### Port 3000 är upptagen

```powershell
$conn = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($conn) {
  $processIds = $conn | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($processId in $processIds) {
    Stop-Process -Id $processId -Force
  }
}
```

### Konstig dev-cache eller trasig route i utvecklingsläge

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```
