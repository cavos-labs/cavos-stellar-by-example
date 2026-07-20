import { describe, expect, it } from "vitest";
import type { CavosSessionState } from "./session";
import { deriveSessionState } from "./session";

// ---------------------------------------------------------------------------
// deriveSessionState — real unit tests for the state-derivation logic
// ---------------------------------------------------------------------------

describe("deriveSessionState", () => {
  it("returns disconnected when nothing is happening", () => {
    const result = deriveSessionState({
      authError: null,
      isAuthenticated: false,
      address: null,
      email: undefined,
      isLoading: false,
    });

    expect(result).toEqual<CavosSessionState>({ status: "disconnected" });
  });

  it("returns connecting when isLoading is true", () => {
    const result = deriveSessionState({
      authError: null,
      isAuthenticated: false,
      address: null,
      email: undefined,
      isLoading: true,
    });

    expect(result).toEqual<CavosSessionState>({ status: "connecting" });
  });

  it("returns connected when authenticated with an address", () => {
    const result = deriveSessionState({
      authError: null,
      isAuthenticated: true,
      address: "GABCDEF123456789",
      email: undefined,
      isLoading: false,
    });

    expect(result).toEqual<CavosSessionState>({
      status: "connected",
      address: "GABCDEF123456789",
    });
    expect(result).toHaveProperty("status", "connected");
    if (result.status === "connected") {
      expect(result.address).toMatch(/^G/);
    }
  });

  it("returns connected with email when user email is present", () => {
    const result = deriveSessionState({
      authError: null,
      isAuthenticated: true,
      address: "G…test",
      email: "jamie@studio.xyz",
      isLoading: false,
    });

    expect(result).toEqual<CavosSessionState>({
      status: "connected",
      address: "G…test",
      email: "jamie@studio.xyz",
    });
  });

  it("returns connected without email when user email is null", () => {
    const result = deriveSessionState({
      authError: null,
      isAuthenticated: true,
      address: "G…test",
      email: null,
      isLoading: false,
    });

    expect(result).toEqual<CavosSessionState>({
      status: "connected",
      address: "G…test",
    });
    // email should be omitted (undefined), not null
    if (result.status === "connected") {
      expect(result.email).toBeUndefined();
    }
  });

  it("returns error when authError is present", () => {
    const result = deriveSessionState({
      authError: "User cancelled login",
      isAuthenticated: false,
      address: null,
      email: undefined,
      isLoading: false,
    });

    expect(result).toEqual<CavosSessionState>({
      status: "error",
      error: "User cancelled login",
    });
  });

  it("prioritises error over all other states", () => {
    // Even when the user looks fully authenticated, an authError wins.
    const result = deriveSessionState({
      authError: "Session expired",
      isAuthenticated: true,
      address: "G…alive",
      email: "user@test.com",
      isLoading: false,
    });

    expect(result).toEqual<CavosSessionState>({
      status: "error",
      error: "Session expired",
    });
  });

  it("prioritises error over loading", () => {
    const result = deriveSessionState({
      authError: "Timeout",
      isAuthenticated: false,
      address: null,
      email: undefined,
      isLoading: true,
    });

    expect(result).toEqual<CavosSessionState>({
      status: "error",
      error: "Timeout",
    });
  });

  it("returns connected when authenticated even if isLoading is true", () => {
    // Edge case: SDK may still report loading while the user is considered
    // authenticated (e.g. token refresh in background). Connected wins.
    const result = deriveSessionState({
      authError: null,
      isAuthenticated: true,
      address: "G…ready",
      email: undefined,
      isLoading: true,
    });

    expect(result).toEqual<CavosSessionState>({
      status: "connected",
      address: "G…ready",
    });
  });

  it("returns connecting when not authenticated but loading", () => {
    const result = deriveSessionState({
      authError: null,
      isAuthenticated: false,
      address: null,
      email: undefined,
      isLoading: true,
    });

    expect(result).toEqual<CavosSessionState>({ status: "connecting" });
  });

  it("returns disconnected when not authenticated, not loading, no address", () => {
    const result = deriveSessionState({
      authError: null,
      isAuthenticated: false,
      address: null,
      email: undefined,
      isLoading: false,
    });

    expect(result).toEqual<CavosSessionState>({ status: "disconnected" });
  });

  it("preserves the exact error message string", () => {
    const messages = [
      "Failed to connect",
      "User rejected request",
      "Network error: connection refused",
    ];

    for (const msg of messages) {
      const result = deriveSessionState({
        authError: msg,
        isAuthenticated: false,
        address: null,
        email: undefined,
        isLoading: false,
      });

      expect(result).toEqual<CavosSessionState>({
        status: "error",
        error: msg,
      });
    }
  });

  it("handles empty string address when authenticated (not connected)", () => {
    // isAuthenticated && address — an empty string is falsy, so this
    // should fall through to the next branch.
    const result = deriveSessionState({
      authError: null,
      isAuthenticated: true,
      address: "",
      email: undefined,
      isLoading: false,
    });

    expect(result).toEqual<CavosSessionState>({ status: "disconnected" });
  });
});

// ---------------------------------------------------------------------------
// Type-level checks — CavosSessionState discriminated union
// ---------------------------------------------------------------------------

describe("CavosSessionState", () => {
  it("disconnected state has no address or error", () => {
    const state: CavosSessionState = { status: "disconnected" };

    expect(state.status).toBe("disconnected");
    expect("address" in state).toBe(false);
    expect("error" in state).toBe(false);
  });

  it("connecting state has no address or error", () => {
    const state: CavosSessionState = { status: "connecting" };

    expect(state.status).toBe("connecting");
    expect("address" in state).toBe(false);
    expect("error" in state).toBe(false);
  });

  it("connected state carries a Stellar G… address", () => {
    const state: CavosSessionState = {
      status: "connected",
      address: "GABCDEF123456789",
    };

    expect(state.status).toBe("connected");
    expect(state.address).toMatch(/^G/);
  });

  it("connected state optionally includes an email", () => {
    const withEmail: CavosSessionState = {
      status: "connected",
      address: "G…test",
      email: "user@test.com",
    };
    const withoutEmail: CavosSessionState = {
      status: "connected",
      address: "G…test",
    };

    expect(withEmail.email).toBe("user@test.com");
    expect(withoutEmail.email).toBeUndefined();
  });

  it("error state carries a non-empty string message", () => {
    const state: CavosSessionState = {
      status: "error",
      error: "Failed to connect",
    };

    expect(state.status).toBe("error");
    expect(state.error).toBeTruthy();
    expect(typeof state.error).toBe("string");
  });

  it("discriminated union narrows correctly via filter", () => {
    const states: CavosSessionState[] = [
      { status: "disconnected" },
      { status: "connecting" },
      { status: "connected", address: "G…addr" },
      { status: "error", error: "err" },
    ];

    const connected = states.filter(
      (s): s is { status: "connected"; address: string } =>
        s.status === "connected"
    );

    expect(connected).toHaveLength(1);
    expect(connected[0].address).toBe("G…addr");
  });

  it("all four states are mutually exclusive by status discriminator", () => {
    const disconnected: CavosSessionState = { status: "disconnected" };
    const connecting: CavosSessionState = { status: "connecting" };
    const connected: CavosSessionState = {
      status: "connected",
      address: "G…",
    };
    const error: CavosSessionState = { status: "error", error: "x" };

    const all = [disconnected, connecting, connected, error];
    expect(all).toHaveLength(4);
  });
});
