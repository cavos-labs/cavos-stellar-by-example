import type { Milestone, Party, Project } from "../domain/types";

export interface NewProjectDraft {
  title: string;
  clientName: string;
  freelancerHandle: string;
  milestones: { title: string; amount: string }[];
}

export interface FieldErrors {
  title?: string;
  clientName?: string;
  freelancerHandle?: string;
  milestones?: string;
  milestoneTitle?: number[];
  milestoneAmount?: number[];
}

export function validateNewProjectDraft(draft: NewProjectDraft): { valid: false; errors: FieldErrors } | { valid: true } {
  const errors: FieldErrors = {};

  if (!draft.title.trim()) {
    errors.title = "Project title is required";
  }

  if (!draft.clientName.trim()) {
    errors.clientName = "Client name is required";
  }

  if (!draft.freelancerHandle.trim()) {
    errors.freelancerHandle = "Freelancer handle is required";
  }

  if (draft.milestones.length === 0) {
    errors.milestones = "At least one milestone is required";
  }

  const missingTitles: number[] = [];
  const invalidAmounts: number[] = [];

  draft.milestones.forEach((m, i) => {
    if (!m.title.trim()) {
      missingTitles.push(i);
    }
    const parsed = Number(m.amount);
    if (!Number.isFinite(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
      invalidAmounts.push(i);
    }
  });

  if (missingTitles.length > 0) {
    errors.milestoneTitle = missingTitles;
  }
  if (invalidAmounts.length > 0) {
    errors.milestoneAmount = invalidAmounts;
  }

  return Object.keys(errors).length > 0 ? { valid: false, errors } : { valid: true };
}

/** Mapping helpers exposed for unit testing. */
export function generateMilestoneId(index: number): string {
  return `m-${index + 1}`;
}

export function mapDraftToCreateEscrowInput(
  draft: NewProjectDraft,
  projectId: string
): Omit<Project, "escrowStatus"> {
  const client: Party = {
    id: `client-${projectId}`,
    role: "client",
    name: draft.clientName.trim(),
  };

  const freelancer: Party = {
    id: `freelancer-${projectId}`,
    role: "freelancer",
    name: draft.freelancerHandle.trim(),
    handle: draft.freelancerHandle.trim(),
  };

  const milestones: Milestone[] = draft.milestones
    .filter((m) => m.title.trim() !== "")
    .map((m, i) => ({
      id: generateMilestoneId(i),
      title: m.title.trim(),
      amount: Math.max(0, Math.floor(Number(m.amount)) || 0),
      state: "pending" as const,
      funded: false,
    }));

  return {
    id: projectId,
    title: draft.title.trim(),
    summary: "",
    client,
    freelancer,
    asset: "USDC",
    milestones,
  };
}
