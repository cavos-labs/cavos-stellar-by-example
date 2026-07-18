# Trustless Escrow Freelance App

An open-source **mock-up** in [Cavos Stellar by Example](../README.md) of an
important use case: a freelance marketplace on [Stellar](https://stellar.org/)
where:

- onboarding is a **full [Cavos](https://cavos.xyz/) integration** (social login
  → self-custodial smart account), and
- payments are a **full [Trustless Work](https://www.trustlesswork.com/)
  integration** (milestone escrows, funded up front, released on approval).

Builders can clone this app, study the flow on web and mobile, and use it as
the starting point for their own product.

## Status

**This is a mock-up — a landing page plus a navigable app shell running on
deterministic demo data.** There is no live auth, no Cavos SDK wiring, and no
Trustless Work API calls yet. The dashboard, project detail view, and
new-project flow render typed fixture data so the use case is clear to
contributors and visitors, and so UI, test, and integration work can advance in
parallel.

The intended end state (open for contributions):

- Complete Cavos social login + smart-account onboarding
- Complete Trustless Work escrow create / fund / approve / release flows
- Settlement on Stellar stablecoins
- Contract creation and related freelance marketplace surfaces

See [CONTRIBUTING.md](../CONTRIBUTING.md) and the
[issues](https://github.com/cavos-labs/cavos-stellar-by-example/issues) to pick
something up.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Geist](https://vercel.com/font) typeface

The design mirrors the Cavos look and feel: electric-indigo (`#402AFF`) on
white, tight tracking, hairline framing, and crisp technical radii.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). With no further setup the
app runs in **demo mode**: mock data only, and a banner near the top of the
page tells you so. That's expected on a fresh clone.

## Routes and demo scenarios

The landing page links into a small app shell ("Open demo" in the header).
All app-shell data comes from deterministic fixtures in
`lib/fixtures/projects.ts` — no randomness, no dates — served through the
gateway in `lib/gateway.ts` (which a later Cavos + Trustless Work integration
replaces without touching the UI).

| Route | What it shows |
| --- | --- |
| `/` | Landing page (unchanged visual language) |
| `/dashboard` | Project list with status filters, loading skeleton, and empty state (e.g. `/dashboard?status=released`) |
| `/projects/new` | New-project flow: draft a contract and preview it live (simulated, nothing persisted) |
| `/projects/mobile-onboarding-flow` | **Draft** scenario |
| `/projects/api-integration-audit` | **Awaiting funding** scenario |
| `/projects/brand-identity-kit` | **Funded · work submitted** scenario |
| `/projects/landing-page-redesign` | **Partially released** scenario (the one on the landing page) |
| `/projects/podcast-cover-art` | **Cancelled** edge-case scenario |
| `/projects/anything-else` | Deliberate "Project not found" state (no crash on unknown IDs) |

An unknown dashboard filter (e.g. `/dashboard?status=nope`) renders a
deliberate unsupported-filter state. Milestone action buttons on the project
detail view are derived from the state machine in `lib/domain/transitions.ts`
and are disabled until the escrow-action simulation lands.

## Get a Cavos App ID

You don't need a Cavos App ID to browse this mock-up, but every later Cavos
task in this app depends on you having one. Get it now so you're not blocked
later:

1. Register at [cavos.xyz/register](https://cavos.xyz/register).
2. Create an application in the Cavos dashboard.
3. Copy that application's App ID.
4. From this directory, create `.env.local` from `.env.example` and set
   `NEXT_PUBLIC_CAVOS_APP_ID`:

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local`:

   ```bash
   NEXT_PUBLIC_CAVOS_APP_ID=your-app-id-here
   ```

5. Restart `npm run dev`. The banner switches from "Demo mode" to "Cavos App
   ID configured" once `NEXT_PUBLIC_CAVOS_APP_ID` is set to a non-empty value.

**Never commit a seed phrase, private key, API secret, or your `.env.local`
file.** `.env.local` is git-ignored (see `.gitignore`). Only `.env.example`,
which contains placeholders and no real values, belongs in version control.

### Network and demo vs. configured mode

- This example targets **Stellar testnet** by default
  (`NEXT_PUBLIC_CAVOS_NETWORK=testnet` in `.env.example`). Only point it at
  `mainnet` once you understand the real-fund implications — this repo is for
  learning and reference, not production use.
- **Demo mode** (default, no `.env.local` or an empty
  `NEXT_PUBLIC_CAVOS_APP_ID`): the app renders entirely with mock data,
  including the milestone ledger and wallet card in the product preview. No
  network calls, no Cavos account required.
- **Configured mode** (`NEXT_PUBLIC_CAVOS_APP_ID` set): the setup banner
  confirms your App ID (masked) and target network are recognized. The
  product preview still renders mock data — this app has no live Cavos SDK
  wiring yet (see [Status](#status)) — but configured mode is the state later
  Cavos integration work builds on.
- The setup banner is the app's single in-app source of truth for which mode
  you're in; it's rendered by `components/CavosSetupBanner.tsx` from
  `lib/cavos.ts`, so there's no silent failure or raw SDK error if
  `NEXT_PUBLIC_CAVOS_APP_ID` is missing or blank.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the unit test suite (Vitest) |

## Project structure

```
app/
  layout.tsx        Root layout, fonts, metadata
  page.tsx          Composes the landing sections
  globals.css       Tailwind + Cavos-mirrored design tokens
  (shell)/          App shell routes (shared AppHeader layout)
    dashboard/        Project list + filters (loading.tsx skeleton)
    projects/new/     New-project flow (simulated, live preview)
    projects/[id]/    Project detail (loading.tsx, not-found.tsx)
components/
  Header.tsx           Sticky nav + demo-app + GitHub links
  Hero.tsx             Brand-first hero (mock-up badge + use-case copy)
  CavosSetupBanner.tsx In-app demo/configured setup state for the App ID
  ProductMock.tsx      Landing preview of one demo scenario (fixture-driven)
  HowItWorks.tsx       Three-step flow (Cavos → Trustless → Stellar)
  StackStrip.tsx       Links to the underlying tools
  ContributeCta.tsx    Call for contributors
  Footer.tsx           Footer links
  Reveal.tsx           Scroll-reveal wrapper (respects reduced motion)
  Wordmark.tsx         Escrow mark + product label
  app/
    AppHeader.tsx         App-shell nav (client, active-link aware)
    EscrowContractCard.tsx Shared contract + milestones + wallet surface
    ProjectCard.tsx       Dashboard project tile
    StatusBadge.tsx       Escrow status chip
    EmptyState.tsx        Deliberate empty / error surface
    NewProjectForm.tsx    Draft builder with live preview (client)
lib/
  links.ts          Shared external links
  cavos.ts          Cavos App ID / network config resolver (unit tested)
  gateway.ts        Async data gateway over the fixtures (swap point for real APIs)
  domain/
    types.ts          Project, Milestone, Party, EscrowStatus, actions
    transitions.ts    Milestone state machine (unit tested)
    escrow.ts         Totals, funding checks, USDC formatting, status labels
  fixtures/
    projects.ts       Deterministic demo scenarios
```
