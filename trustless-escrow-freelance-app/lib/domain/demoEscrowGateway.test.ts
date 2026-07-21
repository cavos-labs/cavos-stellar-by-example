import { beforeEach, describe, expect, it } from "vitest";
import { DemoEscrowGateway } from "./demoEscrowGateway";
import type { Project } from "./types";

function newProjectInput(id: string): Omit<Project, "escrowStatus"> {
  return {
    id,
    title: "Test project",
    summary: "A project created for tests.",
    client: { id: "client-1", role: "client", name: "Client" },
    freelancer: { id: "freelancer-1", role: "freelancer", name: "Freelancer" },
    asset: "USDC",
    milestones: [
      { id: "m1", title: "First deliverable", amount: 100, state: "pending", funded: false },
      { id: "m2", title: "Second deliverable", amount: 200, state: "pending", funded: false },
    ],
  };
}

describe("DemoEscrowGateway", () => {
  let gateway: DemoEscrowGateway;

  beforeEach(() => {
    gateway = new DemoEscrowGateway([]);
  });

  it("walks the happy path: create -> fund -> submit -> approve -> release", async () => {
    const created = await gateway.createEscrow(newProjectInput("proj-1"));
    if (!created.success) throw new Error("expected createEscrow to succeed");
    expect(created.data.escrowStatus).toBe("awaiting_funding");

    const funded1 = await gateway.fundMilestone("proj-1", "m1");
    if (!funded1.success) throw new Error("expected fundMilestone to succeed");
    expect(funded1.data.escrowStatus).toBe("awaiting_funding"); // only 1 of 2 milestones funded

    const funded2 = await gateway.fundMilestone("proj-1", "m2");
    if (!funded2.success) throw new Error("expected fundMilestone to succeed");
    expect(funded2.data.escrowStatus).toBe("funded"); // both milestones funded now

    const submitted = await gateway.submitMilestone("proj-1", "m1");
    if (!submitted.success) throw new Error("expected submitMilestone to succeed");
    expect(submitted.data.milestones.find((m) => m.id === "m1")?.state).toBe("submitted");
    expect(submitted.data.escrowStatus).toBe("funded"); // no releases yet

    const approved = await gateway.approveMilestone("proj-1", "m1");
    if (!approved.success) throw new Error("expected approveMilestone to succeed");
    expect(approved.data.milestones.find((m) => m.id === "m1")?.state).toBe("approved");

    const released = await gateway.releaseMilestone("proj-1", "m1");
    if (!released.success) throw new Error("expected releaseMilestone to succeed");
    expect(released.data.milestones.find((m) => m.id === "m1")?.state).toBe("released");
    expect(released.data.escrowStatus).toBe("partially_released"); // m2 still pending

    await gateway.submitMilestone("proj-1", "m2");
    await gateway.approveMilestone("proj-1", "m2");
    const finalRelease = await gateway.releaseMilestone("proj-1", "m2");
    if (!finalRelease.success) throw new Error("expected releaseMilestone to succeed");
    expect(finalRelease.data.escrowStatus).toBe("released");
    expect(finalRelease.txRef).toMatch(/^sim-tx-\d{6}$/);
  });

  it("rejects creating an escrow with a duplicate id", async () => {
    await gateway.createEscrow(newProjectInput("proj-dup"));
    const result = await gateway.createEscrow(newProjectInput("proj-dup"));
    expect(result).toEqual({
      success: false,
      error: { code: "ALREADY_EXISTS", message: expect.any(String) },
    });
  });

  it("returns ALREADY_FUNDED and leaves state untouched when funding twice", async () => {
    await gateway.createEscrow(newProjectInput("proj-2"));
    const first = await gateway.fundMilestone("proj-2", "m1");
    expect(first.success).toBe(true);

    const second = await gateway.fundMilestone("proj-2", "m1");
    expect(second).toEqual({
      success: false,
      error: { code: "ALREADY_FUNDED", message: expect.any(String) },
    });

    const state = await gateway.getEscrow("proj-2");
    if (!state.success) throw new Error("expected getEscrow to succeed");
    const milestone = state.data.milestones.find((m) => m.id === "m1");
    expect(milestone?.funded).toBe(true);
    expect(milestone?.state).toBe("pending");
  });

  it("returns UNAPPROVED_RELEASE and leaves state untouched when releasing before approval", async () => {
    await gateway.createEscrow(newProjectInput("proj-3"));
    await gateway.fundMilestone("proj-3", "m1");
    await gateway.submitMilestone("proj-3", "m1");

    const result = await gateway.releaseMilestone("proj-3", "m1");
    expect(result).toEqual({
      success: false,
      error: { code: "UNAPPROVED_RELEASE", message: expect.any(String) },
    });

    const state = await gateway.getEscrow("proj-3");
    if (!state.success) throw new Error("expected getEscrow to succeed");
    expect(state.data.milestones.find((m) => m.id === "m1")?.state).toBe("submitted");
  });

  it("returns UNFUNDED_ACTION and leaves state untouched when acting on an unfunded milestone", async () => {
    await gateway.createEscrow(newProjectInput("proj-4"));

    const result = await gateway.submitMilestone("proj-4", "m1");
    expect(result).toEqual({
      success: false,
      error: { code: "UNFUNDED_ACTION", message: expect.any(String) },
    });

    const state = await gateway.getEscrow("proj-4");
    if (!state.success) throw new Error("expected getEscrow to succeed");
    const milestone = state.data.milestones.find((m) => m.id === "m1");
    expect(milestone?.state).toBe("pending");
    expect(milestone?.funded).toBe(false);
  });

  it("returns NOT_FOUND for an unknown project or milestone", async () => {
    const missingProject = await gateway.getEscrow("does-not-exist");
    expect(missingProject).toEqual({
      success: false,
      error: { code: "NOT_FOUND", message: expect.any(String) },
    });

    await gateway.createEscrow(newProjectInput("proj-5"));
    const missingMilestone = await gateway.fundMilestone("proj-5", "does-not-exist");
    expect(missingMilestone).toEqual({
      success: false,
      error: { code: "NOT_FOUND", message: expect.any(String) },
    });
  });

  it("returns cloned data so callers cannot mutate internal state", async () => {
    await gateway.createEscrow(newProjectInput("proj-6"));
    const result = await gateway.getEscrow("proj-6");
    if (!result.success) throw new Error("expected getEscrow to succeed");

    result.data.milestones[0].funded = true;

    const again = await gateway.getEscrow("proj-6");
    if (!again.success) throw new Error("expected getEscrow to succeed");
    expect(again.data.milestones[0].funded).toBe(false);
  });

  it("seeds from the Wave 0 fixtures by default", async () => {
    const defaultGateway = new DemoEscrowGateway();
    const result = await defaultGateway.getEscrow("mobile-onboarding-flow");
    expect(result.success).toBe(true);
  });
});
