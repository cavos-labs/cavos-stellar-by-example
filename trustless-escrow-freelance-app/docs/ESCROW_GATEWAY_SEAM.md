# The `EscrowGateway` seam

`lib/domain/escrowGateway.ts` defines `EscrowGateway` — the boundary between the UI and whatever
actually moves funds. Today that's `DemoEscrowGateway` (`lib/domain/demoEscrowGateway.ts`), a
deterministic in-memory simulator seeded from the Wave 0 fixtures. Later it will be a
`TrustlessWorkGateway` that calls real Trustless Work escrow contracts on Stellar through a Cavos
smart account. This document explains how that swap happens without touching a single React
component.

## 1. Why the interface exists

No component, page, or hook ever imports `DemoEscrowGateway` directly. They all go through:

```ts
const gateway = useEscrowGateway(); // lib/domain/escrowGatewayProvider.tsx
await gateway.fundMilestone(projectId, milestoneId);
```

`EscrowGateway` has six methods (`getEscrow`, `createEscrow`, `fundMilestone`,
`submitMilestone`, `approveMilestone`, `releaseMilestone`), each returning an `EscrowResult<T>` —
a discriminated union (`{ success: true, data, txRef }` or `{ success: false, error }`) instead of
throwing. That return shape is deliberate: an on-chain call can fail for reasons that have
nothing to do with a bug (insufficient funds, an unapproved milestone, a stale transition), and
the UI needs to handle that as ordinary data, the same way it will have to once real transactions
are involved.

Because components only know about this interface, `DemoEscrowGateway` can be deleted entirely
and replaced without any component, page, or test that consumes `useEscrowGateway()` changing.

## 2. How the swap happens

The only place a concrete `EscrowGateway` implementation is constructed is
`lib/domain/escrowGatewayProvider.tsx`:

```ts
const [gateway] = useState<EscrowGateway>(() => new DemoEscrowGateway());
```

To ship a real integration:

1. Implement `TrustlessWorkGateway implements EscrowGateway` (likely in
   `lib/domain/trustlessWorkGateway.ts`), wrapping the Trustless Work SDK / Soroban contract calls
   and the Cavos smart-account session for signing.
2. Change the one line above to `new TrustlessWorkGateway(...)`.
3. Nothing else moves. `ProjectWorkspace`, `EscrowContractCard`, the milestone action buttons, and
   every test that mocks `EscrowGateway` keep working unmodified.

If a future flow needs the gateway outside a client component (e.g. a Server Action that funds a
milestone from a form submit without a round trip through client state), construct the same
concrete implementation there directly — the interface still means the Server Action and the
client components can't drift, since both are typed against `EscrowGateway`, not against
`DemoEscrowGateway`'s or `TrustlessWorkGateway`'s concrete shape.

## 3. From `txRef` to a block explorer link

`DemoEscrowGateway` returns a fake, monotonic `txRef` (`sim-tx-000001`, `sim-tx-000002`, …) on
every successful call — deterministic on purpose, so a given sequence of actions always produces
the same output in tests and demos. It is **not** a Stellar transaction hash.

`TrustlessWorkGateway` will return the real transaction hash from the Soroban invocation instead
(the value `sendTransaction`/`rpc` returns after the Trustless Work contract call confirms). Once
that's in place, any UI that already renders `result.txRef` — the status banner in
`ProjectWorkspace` today — can link it to an explorer with no shape change:

```ts
const explorerUrl = (txRef: string) =>
  `https://stellar.expert/explorer/testnet/tx/${txRef}`;
```

The only thing that needs to change at that point is swapping the demo string format for a real
64-character Stellar tx hash and pointing the link at testnet vs. mainnet based on
`resolveCavosConfig().network` — the `txRef: string` field on `EscrowResult` never changes shape.
