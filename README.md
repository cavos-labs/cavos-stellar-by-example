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
