import { describe, expect, it } from "vitest";
import { recalculateProjectEscrowStatus } from "./projectTransitions";
import type { Milestone, Project } from "./types";

const baseProject: Omit<Project, "milestones" | "escrowStatus"> = {
  id: "p1",
  title: "Test project",
  summary: "",
  client: { id: "c1", role: "client", name: "Client" },
  freelancer: { id: "f1", role: "freelancer", name: "Freelancer" },
  asset: "USDC",
};

function milestone(overrides: Partial<Milestone> & Pick<Milestone, "id">): Milestone {
  return { title: "Milestone", amount: 100, state: "pending", funded: false, ...overrides };
}

describe("recalculateProjectEscrowStatus", () => {
  it("returns awaiting_funding when no milestone is funded", () => {
    const project: Project = {
      ...baseProject,
      escrowStatus: "awaiting_funding",
      milestones: [milestone({ id: "m1" }), milestone({ id: "m2" })],
    };
    expect(recalculateProjectEscrowStatus(project)).toBe("awaiting_funding");
  });

  it("returns awaiting_funding when only some milestones are funded", () => {
    const project: Project = {
      ...baseProject,
      escrowStatus: "awaiting_funding",
      milestones: [milestone({ id: "m1", funded: true }), milestone({ id: "m2", funded: false })],
    };
    expect(recalculateProjectEscrowStatus(project)).toBe("awaiting_funding");
  });

  it("returns funded when every milestone is funded but none are released", () => {
    const project: Project = {
      ...baseProject,
      escrowStatus: "funded",
      milestones: [
        milestone({ id: "m1", funded: true, state: "submitted" }),
        milestone({ id: "m2", funded: true }),
      ],
    };
    expect(recalculateProjectEscrowStatus(project)).toBe("funded");
  });

  it("returns partially_released when some but not all milestones are released", () => {
    const project: Project = {
      ...baseProject,
      escrowStatus: "partially_released",
      milestones: [
        milestone({ id: "m1", funded: true, state: "released" }),
        milestone({ id: "m2", funded: true, state: "submitted" }),
      ],
    };
    expect(recalculateProjectEscrowStatus(project)).toBe("partially_released");
  });

  it("returns released when every milestone is released", () => {
    const project: Project = {
      ...baseProject,
      escrowStatus: "released",
      milestones: [
        milestone({ id: "m1", funded: true, state: "released" }),
        milestone({ id: "m2", funded: true, state: "released" }),
      ],
    };
    expect(recalculateProjectEscrowStatus(project)).toBe("released");
  });

  it("stays cancelled regardless of milestone data", () => {
    const project: Project = {
      ...baseProject,
      escrowStatus: "cancelled",
      milestones: [milestone({ id: "m1", funded: true, state: "released" })],
    };
    expect(recalculateProjectEscrowStatus(project)).toBe("cancelled");
  });
});
