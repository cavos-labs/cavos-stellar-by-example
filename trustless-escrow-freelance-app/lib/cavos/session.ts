"use client";

import { useCavos } from "@cavos/kit/react";
import { resolveCavosConfig } from "./config";

/**
 * Four-state session model for the Cavos wallet connection.
 *
 * - `disconnected`: No wallet is connected. The user can trigger login.
 * - `connecting`: Login / wallet deployment is in flight.
 * - `connected`: Wallet is ready with a Stellar `G…` address.
 * - `error`: Login or connection failed with a message.
 */
export type CavosSessionState =
  | { status: "disconnected" }
  | { status: "connecting" }
  | { status: "connected"; address: string; email?: string | null }
  | { status: "error"; error: string };

export interface UseCavosSessionReturn {
  session: CavosSessionState;
  login: (provider: "google" | "apple") => void;
  logout: () => void;
  /** Open the Cavos auth modal (e.g. from a "Sign in" button). */
  openModal: () => void;
  /** Close the Cavos auth modal programmatically. */
  closeModal: () => void;
}

/**
 * Thin wrapper around `@cavos/kit`'s `useCavos()` that maps the raw
 * authentication surface into the four-state `CavosSessionState`.
 *
 * In demo mode (no App ID configured) the hook still returns valid
 * states — it will always be `disconnected` — so consumer components
 * don't need to branch on config mode unless they want to render
 * demo data.
 */
export function useCavosSession(): UseCavosSessionReturn {
  const config = resolveCavosConfig();
  const {
    isAuthenticated,
    address,
    user,
    isLoading,
    authError,
    login,
    logout,
    openModal,
    closeModal,
    clearAuthError,
  } = useCavos();

  let session: CavosSessionState;

  if (authError) {
    session = { status: "error", error: authError };
  } else if (isAuthenticated && address) {
    session = { status: "connected", address, email: user?.email };
  } else if (isLoading) {
    session = { status: "connecting" };
  } else {
    session = { status: "disconnected" };
  }

  return {
    session,
    login: (provider) => {
      // In demo mode, login is a no-op — the modal won't open without an App ID.
      if (config.mode === "demo") return;
      clearAuthError();
      login(provider);
    },
    logout,
    openModal,
    closeModal,
  };
}
