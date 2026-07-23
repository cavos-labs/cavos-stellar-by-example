import type { Project } from "./domain/types";

const STORAGE_KEY = "cavos-demo-projects";
const CURRENT_VERSION = 1 as const;

type DemoStorePayload = {
  version: typeof CURRENT_VERSION;
  projects: Project[];
};

function isPayload(value: unknown): value is DemoStorePayload {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return v.version === CURRENT_VERSION && Array.isArray(v.projects);
}

function canUseStorage(): boolean {
  try {
    return typeof globalThis !== "undefined" && "localStorage" in globalThis;
  } catch {
    return false;
  }
}

export function loadAllDemoProjects(): Project[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!isPayload(parsed)) return [];
    return parsed.projects;
  } catch {
    return [];
  }
}

export function loadDemoProject(id: string): Project | null {
  const projects = loadAllDemoProjects();
  return projects.find((p) => p.id === id) ?? null;
}

export function saveDemoProject(project: Project): { ok: true } | { ok: false; error: string } {
  if (!canUseStorage()) return { ok: false, error: "localStorage is not available" };
  try {
    const existing = loadAllDemoProjects();
    const index = existing.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      existing[index] = project;
    } else {
      existing.push(project);
    }
    const payload: DemoStorePayload = { version: CURRENT_VERSION, projects: existing };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return { ok: true };
  } catch (err) {
    const message = err instanceof DOMException && err.name === "QuotaExceededError"
      ? "Storage quota exceeded"
      : "Failed to save to localStorage";
    return { ok: false, error: message };
  }
}

export function clearDemoProjects(): void {
  if (!canUseStorage()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently ignore — clear should never throw in practice
  }
}

/** Generate a unique, non-fixture-colliding project ID. */
export function generateProjectId(): string {
  const hex = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  return `demo-${hex}`;
}
