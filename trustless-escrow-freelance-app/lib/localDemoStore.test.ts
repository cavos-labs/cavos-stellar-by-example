import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Project } from "./domain/types";
import {
  clearDemoProjects,
  generateProjectId,
  loadAllDemoProjects,
  loadDemoProject,
  saveDemoProject,
} from "./localDemoStore";

function makeProject(id: string): Project {
  return {
    id,
    title: "Test",
    summary: "",
    client: { id: "c1", role: "client", name: "Client" },
    freelancer: { id: "f1", role: "freelancer", name: "Freelancer" },
    escrowStatus: "awaiting_funding",
    asset: "USDC",
    milestones: [],
  };
}

const store: Record<string, string> = {};

beforeEach(() => {
  Object.keys(store).forEach((k) => delete store[k]);
  vi.stubGlobal("window", {});
  vi.stubGlobal("localStorage", {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
  });
});

describe("loadAllDemoProjects", () => {
  it("returns an empty array when storage is empty", () => {
    expect(loadAllDemoProjects()).toEqual([]);
  });

  it("returns an empty array when the stored version is unknown", () => {
    localStorage.setItem("cavos-demo-projects", JSON.stringify({ version: 99, projects: [makeProject("p-1")] }));
    expect(loadAllDemoProjects()).toEqual([]);
  });

  it("returns an empty array when stored data is malformed JSON", () => {
    localStorage.setItem("cavos-demo-projects", "not-json");
    expect(loadAllDemoProjects()).toEqual([]);
  });

  it("returns an empty array when stored data is not an object", () => {
    localStorage.setItem("cavos-demo-projects", '"string"');
    expect(loadAllDemoProjects()).toEqual([]);
  });

  it("returns saved projects", () => {
    const p1 = makeProject("p-1");
    const p2 = makeProject("p-2");
    saveDemoProject(p1);
    saveDemoProject(p2);
    expect(loadAllDemoProjects()).toHaveLength(2);
  });
});

describe("saveDemoProject", () => {
  it("persists a project and returns ok", () => {
    const p = makeProject("p-1");
    expect(saveDemoProject(p)).toEqual({ ok: true });
    expect(loadAllDemoProjects()).toHaveLength(1);
  });

  it("upserts a project with the same id", () => {
    const p = makeProject("p-1");
    saveDemoProject(p);
    const updated = { ...p, title: "Updated" };
    expect(saveDemoProject(updated)).toEqual({ ok: true });
    expect(loadAllDemoProjects()).toHaveLength(1);
    expect(loadAllDemoProjects()[0].title).toBe("Updated");
  });

  it("reports failure when storage is unavailable", () => {
    const setItemSpy = vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new DOMException("storage quota exceeded", "QuotaExceededError");
    });
    const result = saveDemoProject(makeProject("p-1"));
    expect(result).toEqual({ ok: false, error: "Storage quota exceeded" });
    setItemSpy.mockRestore();
  });
});

describe("loadDemoProject", () => {
  it("returns null for unknown id", () => {
    expect(loadDemoProject("does-not-exist")).toBeNull();
  });

  it("returns the matching project", () => {
    const p = makeProject("p-1");
    saveDemoProject(p);
    expect(loadDemoProject("p-1")).toEqual(p);
  });
});

describe("clearDemoProjects", () => {
  it("removes all persisted projects", () => {
    saveDemoProject(makeProject("p-1"));
    saveDemoProject(makeProject("p-2"));
    clearDemoProjects();
    expect(loadAllDemoProjects()).toEqual([]);
  });

  it("does not throw when storage is already empty", () => {
    expect(() => clearDemoProjects()).not.toThrow();
  });
});

describe("generateProjectId", () => {
  it("returns a string starting with demo-", () => {
    expect(generateProjectId()).toMatch(/^demo-/);
  });

  it("returns unique values on successive calls", () => {
    const ids = new Set(Array.from({ length: 10 }, () => generateProjectId()));
    expect(ids.size).toBe(10);
  });
});
