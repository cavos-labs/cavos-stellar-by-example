import { Wallet } from "@/components/Wallet";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">Stellar Wallet Starter</h1>
      <p className="text-sm text-neutral-600">
        Sign in with Google, Apple or an email code and get a Stellar testnet account.
      </p>
      <Wallet />
    </main>
  );
}
