import { describe, expect, it } from "vitest";
import { DEFAULT_CAVOS_NETWORK, maskAppId, resolveCavosConfig } from "./cavos";

describe("resolveCavosConfig", () => {
  it("falls back to demo mode when no App ID is set", () => {
    const config = resolveCavosConfig({});

    expect(config.mode).toBe("demo");
    expect(config.appId).toBeUndefined();
    expect(config.network).toBe(DEFAULT_CAVOS_NETWORK);
  });

  it("treats a blank or whitespace-only App ID as unset", () => {
    expect(resolveCavosConfig({ appId: "" }).mode).toBe("demo");
    expect(resolveCavosConfig({ appId: "   " }).mode).toBe("demo");
  });

  it("switches to configured mode once an App ID is present", () => {
    const config = resolveCavosConfig({ appId: "app_live_abc123" });

    expect(config.mode).toBe("configured");
    expect(config.appId).toBe("app_live_abc123");
  });

  it("trims surrounding whitespace from the App ID", () => {
    const config = resolveCavosConfig({ appId: "  app_live_abc123  " });

    expect(config.appId).toBe("app_live_abc123");
  });

  it("defaults the network to testnet when unset", () => {
    expect(resolveCavosConfig({ appId: "x" }).network).toBe("testnet");
  });

  it("respects an explicit network override", () => {
    const config = resolveCavosConfig({ appId: "x", network: "mainnet" });

    expect(config.network).toBe("mainnet");
  });

  it("reads from process.env when no argument is given", () => {
    const previous = process.env.NEXT_PUBLIC_CAVOS_APP_ID;
    process.env.NEXT_PUBLIC_CAVOS_APP_ID = "app_live_from_env";

    try {
      expect(resolveCavosConfig().appId).toBe("app_live_from_env");
    } finally {
      if (previous === undefined) delete process.env.NEXT_PUBLIC_CAVOS_APP_ID;
      else process.env.NEXT_PUBLIC_CAVOS_APP_ID = previous;
    }
  });
});

describe("maskAppId", () => {
  it("returns short values unchanged", () => {
    expect(maskAppId("abc123")).toBe("abc123");
  });

  it("masks the middle of longer values, keeping both ends", () => {
    expect(maskAppId("app_live_abc123xyz")).toBe("app_…3xyz");
  });
});
