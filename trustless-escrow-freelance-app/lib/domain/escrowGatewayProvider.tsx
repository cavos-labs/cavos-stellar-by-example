"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { DemoEscrowGateway } from "./demoEscrowGateway";
import type { EscrowGateway } from "./escrowGateway";

const EscrowGatewayContext = createContext<EscrowGateway | null>(null);

/**
 * Provides the app's single EscrowGateway instance, scoped to the app
 * shell (not the public landing page, which stays static).
 *
 * This is the seam: swapping the demo simulator for a real Cavos +
 * Trustless Work gateway later is a one-line change here — every
 * component reaches the gateway through `useEscrowGateway()`, never by
 * constructing an implementation directly. See
 * docs/ESCROW_GATEWAY_SEAM.md.
 */
export function EscrowGatewayProvider({ children }: { children: ReactNode }) {
  const [gateway] = useState<EscrowGateway>(() => new DemoEscrowGateway());
  return (
    <EscrowGatewayContext.Provider value={gateway}>{children}</EscrowGatewayContext.Provider>
  );
}

export function useEscrowGateway(): EscrowGateway {
  const gateway = useContext(EscrowGatewayContext);
  if (!gateway) {
    throw new Error("useEscrowGateway must be used within an EscrowGatewayProvider.");
  }
  return gateway;
}
