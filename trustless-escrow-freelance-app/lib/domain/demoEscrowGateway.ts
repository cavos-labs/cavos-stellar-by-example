import { demoProjects } from "../fixtures/projects";
import type { EscrowErrorCode, EscrowGateway, EscrowResult } from "./escrowGateway";
import { recalculateProjectEscrowStatus } from "./projectTransitions";
import { applyMilestoneAction } from "./transitions";
import type { Milestone, Project } from "./types";

type Located = { project: Project; milestone: Milestone };

/**
 * Deterministic in-memory EscrowGateway, seeded from the Wave 0 fixtures
 * by default. No randomness, no timers, no network — every operation is a
 * pure state transition over an internal Map, and tx refs come from a
 * monotonic counter so a given call sequence always produces the same
 * output. This is the seam a real Cavos + Trustless Work gateway later
 * replaces without the UI or routes changing.
 */
export class DemoEscrowGateway implements EscrowGateway {
  private readonly projects = new Map<string, Project>();
  private txCounter = 0;

  constructor(seed: Project[] = demoProjects) {
    for (const project of seed) {
      this.projects.set(project.id, structuredClone(project));
    }
  }

  async getEscrow(projectId: string): Promise<EscrowResult<Project>> {
    const project = this.projects.get(projectId);
    if (!project) {
      return this.fail("NOT_FOUND", `Project "${projectId}" was not found.`);
    }
    // A read never advances the tx counter — it doesn't submit a transaction.
    return { success: true, data: structuredClone(project), txRef: "" };
  }

  async createEscrow(params: Omit<Project, "escrowStatus">): Promise<EscrowResult<Project>> {
    if (this.projects.has(params.id)) {
      return this.fail("ALREADY_EXISTS", `Project "${params.id}" already exists.`);
    }
    const project: Project = { ...structuredClone(params), escrowStatus: "awaiting_funding" };
    this.projects.set(project.id, project);
    return this.ok(project);
  }

  async fundMilestone(projectId: string, milestoneId: string): Promise<EscrowResult<Project>> {
    const located = this.locate(projectId, milestoneId);
    if ("success" in located) return located;
    const { project, milestone } = located;

    if (milestone.funded) {
      return this.fail("ALREADY_FUNDED", `Milestone "${milestoneId}" is already funded.`);
    }
    milestone.funded = true;
    project.escrowStatus = recalculateProjectEscrowStatus(project);
    return this.ok(project);
  }

  async submitMilestone(projectId: string, milestoneId: string): Promise<EscrowResult<Project>> {
    const located = this.locate(projectId, milestoneId);
    if ("success" in located) return located;
    const { project, milestone } = located;

    if (!milestone.funded) {
      return this.fail("UNFUNDED_ACTION", `Milestone "${milestoneId}" has no funds locked yet.`);
    }
    const next = applyMilestoneAction(milestone.state, "submit");
    if (!next) {
      return this.fail(
        "INVALID_TRANSITION",
        `Cannot submit milestone "${milestoneId}" from state "${milestone.state}".`
      );
    }
    milestone.state = next;
    project.escrowStatus = recalculateProjectEscrowStatus(project);
    return this.ok(project);
  }

  async approveMilestone(projectId: string, milestoneId: string): Promise<EscrowResult<Project>> {
    const located = this.locate(projectId, milestoneId);
    if ("success" in located) return located;
    const { project, milestone } = located;

    const next = applyMilestoneAction(milestone.state, "approve");
    if (!next) {
      return this.fail(
        "INVALID_TRANSITION",
        `Cannot approve milestone "${milestoneId}" from state "${milestone.state}".`
      );
    }
    milestone.state = next;
    project.escrowStatus = recalculateProjectEscrowStatus(project);
    return this.ok(project);
  }

  async releaseMilestone(projectId: string, milestoneId: string): Promise<EscrowResult<Project>> {
    const located = this.locate(projectId, milestoneId);
    if ("success" in located) return located;
    const { project, milestone } = located;

    if (!milestone.funded) {
      return this.fail("UNFUNDED_ACTION", `Milestone "${milestoneId}" has no funds locked yet.`);
    }
    if (milestone.state !== "approved") {
      return this.fail(
        "UNAPPROVED_RELEASE",
        `Milestone "${milestoneId}" must be approved before funds can be released.`
      );
    }
    milestone.state = applyMilestoneAction(milestone.state, "release")!;
    project.escrowStatus = recalculateProjectEscrowStatus(project);
    return this.ok(project);
  }

  /**
   * Finds the project and milestone, or returns a typed failure — used by
   * every mutating operation. Cancelled projects are rejected here too:
   * cancellation is terminal, so none of the four mutations that call this
   * should be able to act on a cancelled project.
   */
  private locate(projectId: string, milestoneId: string): Located | EscrowResult<Project> {
    const project = this.projects.get(projectId);
    if (!project) {
      return this.fail("NOT_FOUND", `Project "${projectId}" was not found.`);
    }
    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      return this.fail("NOT_FOUND", `Milestone "${milestoneId}" was not found.`);
    }
    if (project.escrowStatus === "cancelled") {
      return this.fail("PROJECT_CANCELLED", "Cannot perform actions on a cancelled project.");
    }
    return { project, milestone };
  }

  /** Wraps the current internal state in a fresh clone so callers can never mutate it back. */
  private ok(project: Project): EscrowResult<Project> {
    return { success: true, data: structuredClone(project), txRef: this.nextTxRef() };
  }

  private fail(code: EscrowErrorCode, message: string): EscrowResult<Project> {
    return { success: false, error: { code, message } };
  }

  private nextTxRef(): string {
    this.txCounter += 1;
    return `sim-tx-${String(this.txCounter).padStart(6, "0")}`;
  }
}
