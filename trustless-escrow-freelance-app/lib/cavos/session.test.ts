import { describe, expect, it } from "vitest";
import type { CavosSessionState } from "./session";

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
    // Type-level check: only 'status' discriminates each variant.
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
