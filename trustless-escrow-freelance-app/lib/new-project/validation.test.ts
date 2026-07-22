import { describe, expect, it } from "vitest";
import { generateMilestoneId, mapDraftToCreateEscrowInput, validateNewProjectDraft } from "./validation";

const validDraft = {
  title: "Landing page redesign",
  clientName: "Nova Studio",
  freelancerHandle: "@jamie.design",
  milestones: [
    { title: "Wireframes", amount: "300" },
    { title: "Visual design", amount: "400" },
  ],
};

describe("validateNewProjectDraft", () => {
  it("returns valid for a complete draft", () => {
    expect(validateNewProjectDraft(validDraft)).toEqual({ valid: true });
  });

  it("rejects missing title", () => {
    const result = validateNewProjectDraft({ ...validDraft, title: "" });
    expect(result).toEqual({ valid: false, errors: { title: "Project title is required" } });
  });

  it("rejects whitespace-only title", () => {
    const result = validateNewProjectDraft({ ...validDraft, title: "   " });
    expect(result).toEqual({ valid: false, errors: { title: "Project title is required" } });
  });

  it("rejects missing client name", () => {
    const result = validateNewProjectDraft({ ...validDraft, clientName: "" });
    expect(result).toEqual({ valid: false, errors: { clientName: "Client name is required" } });
  });

  it("rejects missing freelancer handle", () => {
    const result = validateNewProjectDraft({ ...validDraft, freelancerHandle: "" });
    expect(result).toEqual({ valid: false, errors: { freelancerHandle: "Freelancer handle is required" } });
  });

  it("rejects missing freelancer handle (whitespace)", () => {
    const result = validateNewProjectDraft({ ...validDraft, freelancerHandle: "  " });
    expect(result).toEqual({ valid: false, errors: { freelancerHandle: "Freelancer handle is required" } });
  });

  it("does NOT require @ prefix — only non-empty", () => {
    const result = validateNewProjectDraft({ ...validDraft, freelancerHandle: "jamie" });
    expect(result).toEqual({ valid: true });
  });

  it("rejects zero milestones", () => {
    const result = validateNewProjectDraft({ ...validDraft, milestones: [] });
    expect(result).toEqual({ valid: false, errors: { milestones: "At least one milestone is required" } });
  });

  it("rejects milestone with missing title", () => {
    const result = validateNewProjectDraft({ ...validDraft, milestones: [{ title: "", amount: "100" }] });
    expect(result).toEqual({ valid: false, errors: { milestoneTitle: [0] } });
  });

  it("rejects milestone with zero amount", () => {
    const result = validateNewProjectDraft({ ...validDraft, milestones: [{ title: "M1", amount: "0" }] });
    expect(result).toEqual({ valid: false, errors: { milestoneAmount: [0] } });
  });

  it("rejects milestone with negative amount", () => {
    const result = validateNewProjectDraft({ ...validDraft, milestones: [{ title: "M1", amount: "-50" }] });
    expect(result).toEqual({ valid: false, errors: { milestoneAmount: [0] } });
  });

  it("rejects fractional USDC amount", () => {
    const result = validateNewProjectDraft({ ...validDraft, milestones: [{ title: "M1", amount: "100.5" }] });
    expect(result).toEqual({ valid: false, errors: { milestoneAmount: [0] } });
  });

  it("rejects non-numeric amount", () => {
    const result = validateNewProjectDraft({ ...validDraft, milestones: [{ title: "M1", amount: "abc" }] });
    expect(result).toEqual({ valid: false, errors: { milestoneAmount: [0] } });
  });

  it("collects multiple errors at once", () => {
    const result = validateNewProjectDraft({
      title: "",
      clientName: "",
      freelancerHandle: "",
      milestones: [
        { title: "", amount: "0" },
        { title: "M2", amount: "-10" },
      ],
    });
    expect(result).toEqual({
      valid: false,
      errors: {
        title: expect.any(String),
        clientName: expect.any(String),
        freelancerHandle: expect.any(String),
        milestoneTitle: [0],
        milestoneAmount: [0, 1],
      },
    });
  });
});

describe("mapDraftToCreateEscrowInput", () => {
  it("produces the correct Omit<Project, 'escrowStatus'> shape", () => {
    const result = mapDraftToCreateEscrowInput(validDraft, "demo-a1b2c3d4");
    expect(result.id).toBe("demo-a1b2c3d4");
    expect(result.title).toBe("Landing page redesign");
    expect(result.summary).toBe("");
    expect(result.asset).toBe("USDC");

    expect(result.client.name).toBe("Nova Studio");
    expect(result.client.role).toBe("client");
    expect(result.client.id).toMatch(/^client-/);

    expect(result.freelancer.name).toBe("@jamie.design");
    expect(result.freelancer.handle).toBe("@jamie.design");
    expect(result.freelancer.role).toBe("freelancer");
    expect(result.freelancer.id).toMatch(/^freelancer-/);
  });

  it("maps milestones with m-1, m-2 IDs matching fixture convention", () => {
    const result = mapDraftToCreateEscrowInput(validDraft, "demo-x");
    expect(result.milestones).toHaveLength(2);
    expect(result.milestones[0].id).toBe("m-1");
    expect(result.milestones[0].title).toBe("Wireframes");
    expect(result.milestones[0].amount).toBe(300);
    expect(result.milestones[0].state).toBe("pending");
    expect(result.milestones[0].funded).toBe(false);

    expect(result.milestones[1].id).toBe("m-2");
    expect(result.milestones[1].title).toBe("Visual design");
    expect(result.milestones[1].amount).toBe(400);
  });

  it("strips whitespace from title and handle", () => {
    const result = mapDraftToCreateEscrowInput(
      { ...validDraft, title: "  My Project  ", freelancerHandle: "  @user  " },
      "demo-y"
    );
    expect(result.title).toBe("My Project");
    expect(result.freelancer.handle).toBe("@user");
  });

  it("expects empty milestones when all titles are blank", () => {
    const result = mapDraftToCreateEscrowInput(
      { ...validDraft, milestones: [{ title: "", amount: "100" }] },
      "demo-z"
    );
    expect(result.milestones).toHaveLength(0);
  });
});

describe("generateMilestoneId", () => {
  it("is 1-based to match fixture convention", () => {
    expect(generateMilestoneId(0)).toBe("m-1");
    expect(generateMilestoneId(1)).toBe("m-2");
    expect(generateMilestoneId(2)).toBe("m-3");
  });
});
