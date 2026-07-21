import type { EscrowStatus, Project } from "./types";

/**
 * Project-level counterpart to the milestone state machine in
 * transitions.ts. Where that file governs a single milestone's workflow,
 * this derives the escrow's overall status from all of its milestones —
 * so `EscrowStatus` is never set by hand and can't drift out of sync with
 * the milestones it's supposed to summarize.
 *
 * `cancelled` is sticky: once a project is cancelled that's a terminal,
 * explicitly-set status, not something this function should recompute
 * away on the next call.
 *
 * Funding is evaluated as "are all milestones funded", not "is any
 * milestone funded" — `EscrowStatus` has no partially-funded state, so a
 * project with some but not all milestones funded is still
 * `awaiting_funding`.
 */
export function recalculateProjectEscrowStatus(project: Project): EscrowStatus {
  if (project.escrowStatus === "cancelled") return "cancelled";

  const { milestones } = project;
  const allFunded = milestones.every((m) => m.funded);
  if (!allFunded) return "awaiting_funding";

  const releasedCount = milestones.filter((m) => m.state === "released").length;
  if (releasedCount === 0) return "funded";
  if (releasedCount === milestones.length) return "released";
  return "partially_released";
}
