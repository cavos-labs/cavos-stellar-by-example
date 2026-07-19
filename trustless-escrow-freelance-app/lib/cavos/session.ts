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
 * Raw inputs that the state-derivation logic consumes.
 *
 * These mirror the relevant fields from `@cavos/kit`'s `useCavos()` return
 * value so the pure function can be unit-tested without a React renderer.
 */
export interface DeriveSessionInput {
  authError: string | null;
  isAuthenticated: boolean;
  address: string | null;
  email: string | null | undefined;
  isLoading: boolean;
}

/**
 * Pure state-derivation function.
 *
 * Maps raw SDK inputs to one of the four `CavosSessionState` variants.
 * Priority order (checked in sequence):
 * 1. `authError` → `"error"`
 * 2. `isAuthenticated && address` → `"connected"`
 * 3. `isLoading` → `"connecting"`
 * 4. otherwise → `"disconnected"`
 *
 * Extracted so the derivation logic can be unit-tested without a React
 * renderer or mocking the Cavos SDK.
 */
export function deriveSessionState(input: DeriveSessionInput): CavosSessionState {
  const { authError, isAuthenticated, address, email, isLoading } = input;

  if (authError) {
    return { status: "error", error: authError };
  }
  if (isAuthenticated && address) {
    return { status: "connected", address, email: email ?? undefined };
  }
  if (isLoading) {
    return { status: "connecting" };
  }
  return { status: "disconnected" };
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

  const session = deriveSessionState({
    authError,
    isAuthenticated,
    address,
    email: user?.email,
    isLoading,
  });

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
