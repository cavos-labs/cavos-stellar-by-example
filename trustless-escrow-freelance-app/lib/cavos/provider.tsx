"use client";

import { CavosProvider as KitCavosProvider } from "@cavos/kit/react";
import type { ReactNode } from "react";
import { resolveCavosConfig } from "./config";

/**
 * Application-level Cavos provider, pre-configured for Stellar testnet.
 *
 * - Mounts the `@cavos/kit` React provider.
 * - Reads `NEXT_PUBLIC_CAVOS_APP_ID` and `NEXT_PUBLIC_CAVOS_NETWORK` from
 *   the environment via `resolveCavosConfig`.
 * - In **demo** mode (no App ID) the provider is still mounted so that
 *   `useCavos()` / `useCavosSession()` hooks work — they simply return
 *   a disconnected session. The auth modal won't activate without an App ID.
 * - In **configured** mode the provider connects to the Cavos hosted
 *   auth and relayer infrastructure on Stellar.
 */
export function CavosProvider({ children }: { children: ReactNode }) {
  const config = resolveCavosConfig();

  return (
    <KitCavosProvider
      config={{
        chain: "stellar",
        network: config.network as "testnet" | "mainnet",
        appSalt: "trustless-escrow-freelance",
        ...(config.mode === "configured" ? { appId: config.appId } : {}),
      }}
      modal={{
        appName: "Trustless Escrow Freelance App",
        theme: "light",
        primaryColor: "#402AFF",
      }}
    >
      {children}
    </KitCavosProvider>
  );
}
