"use client";

import { CavosProvider } from "@cavos/kit/react";

const appId = process.env.NEXT_PUBLIC_CAVOS_APP_ID;
const appSalt = process.env.NEXT_PUBLIC_CAVOS_APP_SALT;

export function Providers({ children }: { children: React.ReactNode }) {
  if (!appId || !appSalt) {
    return (
      <p className="p-6 text-sm">
        Set <code>NEXT_PUBLIC_CAVOS_APP_ID</code> and <code>NEXT_PUBLIC_CAVOS_APP_SALT</code> in{" "}
        <code>.env.local</code>, then restart the dev server. See <code>.env.example</code>.
      </p>
    );
  }

  return (
    <CavosProvider
      config={{
        appId,
        chains: ["stellar"],
        defaultChain: "stellar",
        network: "testnet",
        appSalt,
        socialRecovery: true,
        deviceApproval: "enclave",
      }}
      modal={{ appName: "Stellar Wallet Starter", providers: ["google", "apple", "email"] }}
    >
      {children}
    </CavosProvider>
  );
}
