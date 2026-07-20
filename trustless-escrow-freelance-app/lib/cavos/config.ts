/**
 * Resolves how this example should behave given the environment it was
 * started with: "demo" mock data, or "configured" with a contributor's own
 * Cavos App ID. Kept framework-free so it can be unit tested without a DOM.
 */

export type CavosMode = "demo" | "configured";

export const DEFAULT_CAVOS_NETWORK = "testnet";

export interface CavosEnv {
  appId?: string;
  network?: string;
}

export interface CavosConfig {
  /** Trimmed App ID, or undefined when not set / blank. */
  appId: string | undefined;
  /** Stellar network this example targets. Defaults when unset. */
  network: string;
  mode: CavosMode;
}

function currentEnv(): CavosEnv {
  return {
    appId: process.env.NEXT_PUBLIC_CAVOS_APP_ID,
    network: process.env.NEXT_PUBLIC_CAVOS_NETWORK,
  };
}

export function resolveCavosConfig(env: CavosEnv = currentEnv()): CavosConfig {
  const appId = env.appId?.trim() || undefined;
  const network = env.network?.trim() || DEFAULT_CAVOS_NETWORK;

  return {
    appId,
    network,
    mode: appId ? "configured" : "demo",
  };
}

/** Masks an App ID for display: keeps enough to recognize, hides the rest. */
export function maskAppId(appId: string): string {
  if (appId.length <= 8) return appId;
  return `${appId.slice(0, 4)}…${appId.slice(-4)}`;
}
