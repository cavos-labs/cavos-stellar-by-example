# Stellar Wallet Starter

A minimal Next.js app that gives users an embedded Stellar wallet with
[`@cavos/kit`](https://www.npmjs.com/package/@cavos/kit). Users sign in with
Google, Apple or an email code and get a classic Stellar `G...` account on
**testnet**, with no seed phrase and no browser extension. Web only: React Native
support in the kit is a work in progress.

## What it shows

- Sign-in through the Cavos modal (`openModal`), with loading and error states from `useCavos()`
- The user's `G...` address and wallet status (`undeployed`, `ready`, `needs-device-approval`)
- Sponsored account creation with `wallet.create()`
- XLM and testnet USDC balances (`balance()`, `tokenBalance()`)
- A sponsored USDC trustline (`addTrustline()`)
- Testnet XLM from Friendbot, and an XLM payment form (`execute()`)
- The ten most recent payments, read from Horizon testnet
- Sign out

## Prerequisites

- Node 20 or later
- A Cavos App ID. See [Get a Cavos App ID](../README.md#get-a-cavos-app-id) in the repo README.
- Your local origin in the app's **Callback URLs** in the Cavos dashboard (for example
  `http://localhost:3000`). Without it, sign-in fails with `redirect_uri is not registered`.

## Setup

```bash
cd stellar-wallet-starter
npm install
cp .env.example .env.local
```

Fill in `.env.local`, then run:

```bash
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CAVOS_APP_ID` | The App ID from the Cavos dashboard. It is public. |
| `NEXT_PUBLIC_CAVOS_APP_SALT` | A string that names your app. It is part of how each user's account is derived. Choose it once and never change it after users have signed in: changing it moves every user to a new, empty wallet. |

Nothing in this app is secret.

## What is sponsored

The Cavos relayer pays for:

- creating the account, which starts with 0 XLM
- the reserve of each trustline
- transaction fees

The relayer does not pay the XLM you send. A new account holds 0 XLM, so the first
"Send XLM" fails with `op_underfunded` until the account has XLM. On testnet, "Get 100 testnet
XLM" funds it: Friendbot only funds addresses that do not exist yet, so the app funds a
throwaway account with Friendbot and pays from it (`lib/faucet.ts`). The trustline and account
creation do not need XLM.

## How the code maps to the kit

| Step | Call |
| --- | --- |
| Provider | `<CavosProvider config={{ appId, chains: ["stellar"], defaultChain: "stellar", network: "testnet", appSalt }}>` in `components/Providers.tsx` |
| Sign in / out, errors | `openModal`, `logout`, `authError`, `isLoading` from `useCavos()` |
| Stellar wallet | `wallet.chain === "stellar"` narrows `wallet` to `CavosStellar` |
| Create account | `wallet.create()` |
| Balances | `wallet.balance()` (stroops), `wallet.tokenBalance({ code, issuer })` |
| Trustline | `wallet.addTrustline({ code, issuer })` |
| Send XLM | `wallet.execute(stroops, destination)` |

The USDC asset is Circle's testnet USDC (issuer in `lib/stellar.ts`). Mainnet uses a different
issuer.

## Links

- Docs: https://docs.cavos.xyz (Stellar: https://docs.cavos.xyz/docs/stellar)
- Package: https://www.npmjs.com/package/@cavos/kit
