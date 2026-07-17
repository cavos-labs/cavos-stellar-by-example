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

**This is a mock-up — landing page + static product UI only.** There is no live
auth, no Cavos SDK wiring, and no Trustless Work API calls yet. The contract
preview, milestone ledger, and wallet card are presentational so the use case
is clear to contributors and visitors.

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
components/
  Header.tsx           Sticky nav + GitHub link
  Hero.tsx             Brand-first hero (mock-up badge + use-case copy)
  CavosSetupBanner.tsx In-app demo/configured setup state for the App ID
  ProductMock.tsx      Static contract + escrow + wallet preview
  HowItWorks.tsx       Three-step flow (Cavos → Trustless → Stellar)
  StackStrip.tsx       Links to the underlying tools
  ContributeCta.tsx    Call for contributors
  Footer.tsx           Footer links
  Reveal.tsx           Scroll-reveal wrapper (respects reduced motion)
  Wordmark.tsx         Escrow mark + product label
lib/
  links.ts          Shared external links
  cavos.ts          Cavos App ID / network config resolver (unit tested)
```
