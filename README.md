# Cavos Stellar by Example

Open-source example apps that show how to build real products with
[Cavos](https://cavos.xyz/) embedded wallets on [Stellar](https://stellar.org/).

Each app in this repo is a self-contained reference implementation of a single
use case: invisible onboarding with Cavos social login, gas-abstracted smart
accounts, and payments settled on Stellar. Clone one, run it, and use it as the
starting point for your own product.

## Apps

| App | What it shows | Status |
| --- | --- | --- |
| [`trustless-escrow-freelance-app`](./trustless-escrow-freelance-app) | **Trustless Escrow Freelance App** — open-source mock-up of a freelance marketplace with a full Cavos onboarding path and a full [Trustless Work](https://www.trustlesswork.com/) milestone-escrow path on Stellar. Reference use case for builders. | Mock-up (landing + static UI) |

More apps will land here over time. Want to add one? See
[CONTRIBUTING.md](./CONTRIBUTING.md).

## Quick start

Each app is independent. Pick one, install its dependencies, and run it:

```bash
git clone https://github.com/cavos-labs/cavos-stellar-by-example.git
cd cavos-stellar-by-example/trustless-escrow-freelance-app
npm install
npm run dev
```

Then open the URL printed in your terminal (usually `http://localhost:3000`).

By default the app runs in **demo mode** with mock data — no account needed.
To configure it with your own Cavos App ID, see [Get a Cavos App
ID](#get-a-cavos-app-id) below.

## Get a Cavos App ID

Every Cavos-backed example in this repo needs a Cavos App ID to run against
your own app instead of mock data. Get one before writing product code:

1. Register at [cavos.xyz/register](https://cavos.xyz/register).
2. Create an application in the Cavos dashboard.
3. Copy that application's App ID.
4. In the app directory (e.g. `trustless-escrow-freelance-app`), create
   `.env.local` from `.env.example` and set `NEXT_PUBLIC_CAVOS_APP_ID` to the
   App ID you copied.

Each app's own README documents which network it targets and how demo mode
differs from an App-ID-configured run — check there for app-specific detail.

**Never commit a seed phrase, private key, API secret, or your `.env.local`
file.** `.env.local` is git-ignored; only `.env.example` (placeholders only)
belongs in the repo.

## The stack

- **[Cavos](https://cavos.xyz/)** — embedded, self-custodial smart accounts from
  a Google or Apple login. No seed phrases, no extensions, gas abstracted.
  [Docs](https://docs.cavos.xyz) · [GitHub](https://github.com/cavos-labs)
- **[Trustless Work](https://www.trustlesswork.com/)** — non-custodial,
  milestone-based escrow infrastructure for stablecoin payments.
- **[Stellar](https://stellar.org/)** — fast, low-cost settlement layer for the
  stablecoin payments behind each demo.

## Contributing

We welcome contributions. Read [CONTRIBUTING.md](./CONTRIBUTING.md) for how to
pick up an issue, how we work, and what "done" looks like before you open a pull
request.

## License

MIT
