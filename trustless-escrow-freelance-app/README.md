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
deterministic demo data plus browser-local simulated projects.** Cavos session
wiring with [@cavos/kit](https://www.npmjs.com/package/@cavos/kit)
(`chain: "stellar"`) is live — users can connect a real Stellar self-custodial
wallet on testnet. There is no Trustless Work API integration yet. The new-project
flow now creates real local demo escrows through the `EscrowGateway` simulator,
persisted in browser localStorage and surviving refresh. Five built-in fixture
scenarios remain as before, clearly distinguished from user-created projects.

The intended end state (open for contributions):

- Complete Cavos social login + smart-account onboarding ✅
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
| `/projects/new` | New-project flow: create a local demo escrow (validated, persisted in browser storage) |
| `/projects/mobile-onboarding-flow` | **Draft** scenario |
| `/projects/api-integration-audit` | **Awaiting funding** scenario |
| `/projects/brand-identity-kit` | **Funded · work submitted** scenario |
| `/projects/landing-page-redesign` | **Partially released** scenario (the one on the landing page) |
| `/projects/podcast-cover-art` | **Cancelled** edge-case scenario |
| `/projects/anything-else` | Deliberate "Project not found" state (no crash on unknown IDs) |

An unknown dashboard filter (e.g. `/dashboard?status=nope`) renders a
deliberate unsupported-filter state. Milestone action buttons on the project
detail view are derived from the state machine in `lib/domain/transitions.ts`
and are wired to the `DemoEscrowGateway` simulator for fund / submit / approve /
release actions.

### Local end-to-end demo flow

The new-project form creates a real local demo escrow through the
`EscrowGateway` simulator and persists it in browser localStorage.

1. Open `/dashboard` — five built-in demo scenarios are visible under "Demo scenarios".
2. Click **"New project"** → fill title, client, freelancer handle, and at least one milestone with a positive whole-USDC amount.
3. Submit — a success banner shows the generated **project ID** and **simulator reference** (e.g. `sim-tx-000004`).
4. After a brief pause, the app navigates to `/projects/[id]` — the project renders with its milestones and the full `ProjectWorkspace` (fund / submit / approve / release actions).
5. Navigate to `/dashboard` — the new project appears under **"Your simulated projects"**, clearly labeled as "Simulated" vs the fixture scenarios' labels.
6. **Refresh the browser** — the project remains visible on both dashboard and detail pages.
7. Click **"Clear demo data"** on the dashboard — only browser-created projects are removed. The five fixture scenarios remain untouched.
8. Direct URL access to a created project (e.g. `/projects/demo-a1b2c3d4`) resolves correctly from localStorage.

### Simulation boundary

- The `DemoEscrowGateway` is a deterministic in-memory simulator with a monotonic transaction reference counter (`sim-tx-000001`, `sim-tx-000002`, …).
- Projects created through the form are persisted in browser localStorage keyed `cavos-demo-projects`. Fixture projects never enter localStorage.
- No Trustless Work API, Soroban contract, Stellar transaction, USDC transfer, or server-side database is involved.
- A future `TrustlessWorkGateway` implementing the same `EscrowGateway` interface can replace the simulator without changing the UI or routes (see `docs/ESCROW_GATEWAY_SEAM.md`).

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
  confirms your App ID (masked), target network, and the live Cavos session
  are ready to connect (see [Status](#status)). The project-detail wallet card
  shows a "Sign in with Cavos" button backed by `@cavos/kit` on Stellar
  testnet, swapping mock data for real wallet state after connect.
- The Cavos session is derived through `lib/cavos/session.ts` (a 4-state
  discriminated union: disconnected → connecting → connected → error) and
  used in `components/app/EscrowContractCard.tsx` and
  `components/app/AppHeader.tsx`.
- The setup banner is the app's single in-app source of truth for which mode
  you're in; it's rendered by `components/CavosSetupBanner.tsx` from
  `lib/cavos/config.ts`, so there's no silent failure or raw SDK error if
  `NEXT_PUBLIC_CAVOS_APP_ID` is missing or blank.

## Manual test flow (Stellar connect with @cavos/kit)

This flow verifies the Cavos session works end-to-end on Stellar testnet.

### Prerequisites

1. A Cavos App ID from [cavos.xyz/register](https://cavos.xyz/register).
2. `.env.local` set up:

   ```bash
   cp .env.example .env.local
   # Edit .env.local and set:
   NEXT_PUBLIC_CAVOS_APP_ID=your-app-id-here
   ```

3. `npm run dev` running on [http://localhost:3000](http://localhost:3000).

### Test steps

**Step 1 — Demo mode (no App ID)**

Clear `NEXT_PUBLIC_CAVOS_APP_ID` from `.env.local` (or leave it blank) and
restart the dev server. Confirm:
- The CavosSetupBanner at the top of the page says **"Demo mode — no Cavos
  App ID configured."**
- The wallet card on the project detail has a **dashed border** and a
  **DEMO** badge.
- The status badge in the app header says **"Mock data".**

**Step 2 — Configured mode**

Set `NEXT_PUBLIC_CAVOS_APP_ID` to your real App ID in `.env.local` and
restart. Confirm:
- The banner says **"Cavos App ID configured"** with your masked App ID.
- The wallet card switches to a **"Sign in with Cavos"** button (solid
  border, Google icon).
- The app header shows **"Disconnected"** (not "Mock data").

**Step 3 — Connect on Stellar testnet**

Click **"Sign in with Cavos"** on the project detail page. The
`CavosAuthModal` should slide up. Sign in with Google. Confirm:
- The modal closes after a successful auth.
- The wallet card now shows your real **Stellar `G…` address** and email.
- The app header badge shows the **`G…` address** with a green dot.
- The wallet card tags say **"self-custodial", "gas abstracted", "Stellar".**

**Step 4 — Disconnect**

Disconnect from within the Cavos modal (user menu). Confirm:
- The wallet card returns to the **"Sign in with Cavos"** prompt.
- The status badge returns to **"Disconnected".**

**Step 5 — Error / retry**

If the connection fails (e.g. network issue), confirm that a meaningful
error message is shown and the sign-in button remains clickable to retry.

**Step 6 — Network config**

By default the app points at Stellar **testnet**. Change
`NEXT_PUBLIC_CAVOS_NETWORK=mainnet` in `.env.local` and restart. The
banner and wallet card should reflect the new network. Switch back to
testnet before finishing.

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
    NewProjectForm.tsx    Create local demo escrows (validated, gateway-backed, persisted)
    DashboardContent.tsx  Merged fixture + simulated project listing with safe reset
    ProjectDetailClient.tsx Client-resolution bridge for fixture and simulated projects
lib/
  links.ts          Shared external links
  cavos/
    config.ts         Cavos App ID / network config resolver (unit tested)
    session.ts        useCavosSession() — 4-state session hook (unit tested)
    provider.tsx      <CavosProvider> wrapper
    index.ts          Barrel re-exports
  localDemoStore.ts Browser-local persistence for user-created demo projects (versioned, SSR-safe)
  new-project/
    validation.ts   Pure validation + form→gateway mapping functions (unit tested)
  gateway.ts        Async data gateway over the fixtures (swap point for real APIs)
  domain/
    types.ts          Project, Milestone, Party, EscrowStatus, actions
    transitions.ts    Milestone state machine (unit tested)
    escrow.ts         Totals, funding checks, USDC formatting, status labels
  fixtures/
    projects.ts       Deterministic demo scenarios
```
