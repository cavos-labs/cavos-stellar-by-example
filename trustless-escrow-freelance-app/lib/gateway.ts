import type { Project } from "./domain/types";
import { demoProjects, getDemoProject } from "./fixtures/projects";

/**
 * Data gateway for the app shell. Today it serves the deterministic
 * fixtures; a later iteration swaps the bodies for real Cavos +
 * Trustless Work calls while keeping these signatures, so the routes
 * and components never change.
 */

/** Fixed simulated latency so route loading states are visible and deterministic. */
const FIXTURE_LATENCY_MS = 350;

function simulateLatency(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, FIXTURE_LATENCY_MS));
}

export async function listProjects(): Promise<Project[]> {
  await simulateLatency();
  return demoProjects;
}

export async function getProject(id: string): Promise<Project | null> {
  await simulateLatency();
  return getDemoProject(id) ?? null;
}
