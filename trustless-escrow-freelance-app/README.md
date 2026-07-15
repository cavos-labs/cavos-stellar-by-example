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

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
app/
  layout.tsx        Root layout, fonts, metadata
  page.tsx          Composes the landing sections
  globals.css       Tailwind + Cavos-mirrored design tokens
components/
  Header.tsx        Sticky nav + GitHub link
  Hero.tsx          Brand-first hero (mock-up badge + use-case copy)
  ProductMock.tsx   Static contract + escrow + wallet preview
  HowItWorks.tsx    Three-step flow (Cavos → Trustless → Stellar)
  StackStrip.tsx    Links to the underlying tools
  ContributeCta.tsx Call for contributors
  Footer.tsx        Footer links
  Reveal.tsx        Scroll-reveal wrapper (respects reduced motion)
  Wordmark.tsx      Escrow mark + product label
lib/
  links.ts          Shared external links
```
