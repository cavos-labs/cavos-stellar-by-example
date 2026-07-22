// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import type { ReactNode } from "react";
import { EscrowGatewayProvider, useEscrowGateway, useEscrowGatewayWithDemo } from "./escrowGatewayProvider";
import type { Project } from "./types";

const store: Record<string, string> = {};

vi.mock("../localDemoStore", async () => {
  const actual = await vi.importActual("../localDemoStore");
  return {
    ...actual as object,
    loadAllDemoProjects: vi.fn(() => {
      try {
        const raw = store["cavos-demo-projects"];
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (parsed?.version === 1 && Array.isArray(parsed.projects)) return parsed.projects;
        return [];
      } catch { return []; }
    }),
    saveDemoProject: vi.fn((project: Project) => {
      try {
        const existing = JSON.parse(store["cavos-demo-projects"] ?? '{"version":1,"projects":[]}');
        const idx = existing.projects.findIndex((p: Project) => p.id === project.id);
        if (idx >= 0) existing.projects[idx] = project;
        else existing.projects.push(project);
        store["cavos-demo-projects"] = JSON.stringify(existing);
        return { ok: true } as const;
      } catch { return { ok: false, error: "storage error" } as const; }
    }),
    clearDemoProjects: vi.fn(() => { delete store["cavos-demo-projects"]; }),
  };
});

function wrapper({ children }: { children: ReactNode }) {
  return <EscrowGatewayProvider>{children}</EscrowGatewayProvider>;
}

describe("EscrowGatewayProvider", () => {
  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
  });

  it("provides a gateway via useEscrowGateway", () => {
    const { result } = renderHook(() => useEscrowGateway(), { wrapper });
    expect(result.current).toBeDefined();
    expect(typeof result.current.getEscrow).toBe("function");
  });

  it("seeds fixture projects into the gateway", async () => {
    const { result } = renderHook(() => useEscrowGateway(), { wrapper });
    const escrow = await result.current.getEscrow("mobile-onboarding-flow");
    expect(escrow.success).toBe(true);
  });

  it("provides demoProjects and createDemoEscrow", () => {
    const { result } = renderHook(() => useEscrowGatewayWithDemo(), { wrapper });
    expect(Array.isArray(result.current.demoProjects)).toBe(true);
    expect(typeof result.current.createDemoEscrow).toBe("function");
  });

  it("createDemoEscrow adds the project to demoProjects", async () => {
    const { result } = renderHook(() => useEscrowGatewayWithDemo(), { wrapper });

    const input: Omit<Project, "escrowStatus"> = {
      id: "demo-00000001",
      title: "New project",
      summary: "",
      client: { id: "c1", role: "client", name: "Client" },
      freelancer: { id: "f1", role: "freelancer", name: "Freelancer" },
      asset: "USDC",
      milestones: [],
    };

    const createResult = await act(async () => result.current.createDemoEscrow(input));
    expect(createResult.success).toBe(true);
    expect(createResult.txRef).toMatch(/^sim-tx-\d{6}$/);

    expect(result.current.demoProjects).toHaveLength(1);
    expect(result.current.demoProjects[0].id).toBe("demo-00000001");
  });

  it("createDemoEscrow returns gateway errors unchanged", async () => {
    const { result } = renderHook(() => useEscrowGatewayWithDemo(), { wrapper });

    const input: Omit<Project, "escrowStatus"> = {
      id: "mobile-onboarding-flow",
      title: "Duplicate",
      summary: "",
      client: { id: "c1", role: "client", name: "Client" },
      freelancer: { id: "f1", role: "freelancer", name: "Freelancer" },
      asset: "USDC",
      milestones: [],
    };

    const createResult = await act(async () => result.current.createDemoEscrow(input));
    expect(createResult.success).toBe(false);
    expect(createResult.error.code).toBe("ALREADY_EXISTS");
  });

  it("resetDemoProjects clears all demo projects", async () => {
    const { result } = renderHook(() => useEscrowGatewayWithDemo(), { wrapper });

    const input: Omit<Project, "escrowStatus"> = {
      id: "demo-00000001",
      title: "Temp",
      summary: "",
      client: { id: "c1", role: "client", name: "Client" },
      freelancer: { id: "f1", role: "freelancer", name: "Freelancer" },
      asset: "USDC",
      milestones: [],
    };

    await act(async () => result.current.createDemoEscrow(input));
    expect(result.current.demoProjects).toHaveLength(1);

    await act(async () => result.current.resetDemoProjects());
    expect(result.current.demoProjects).toHaveLength(0);
  });

  it("resetDemoProjects keeps fixture projects accessible", async () => {
    const { result } = renderHook(() => useEscrowGatewayWithDemo(), { wrapper });

    await act(async () => result.current.resetDemoProjects());

    const escrow = await result.current.gateway.getEscrow("mobile-onboarding-flow");
    expect(escrow.success).toBe(true);
  });

  it("exposes lastPersistError when persistence fails", async () => {
    const { saveDemoProject } = await import("../localDemoStore");
    (saveDemoProject as Mock).mockReturnValueOnce({ ok: false, error: "Storage quota exceeded" });

    const { result } = renderHook(() => useEscrowGatewayWithDemo(), { wrapper });

    const input: Omit<Project, "escrowStatus"> = {
      id: "demo-00000001",
      title: "Fail persist",
      summary: "",
      client: { id: "c1", role: "client", name: "Client" },
      freelancer: { id: "f1", role: "freelancer", name: "Freelancer" },
      asset: "USDC",
      milestones: [],
    };

    await act(async () => result.current.createDemoEscrow(input));
    expect(result.current.lastPersistError).toBe("Storage quota exceeded");

    (saveDemoProject as Mock).mockRestore();
  });
});
