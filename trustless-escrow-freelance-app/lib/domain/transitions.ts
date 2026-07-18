import type { MilestoneAction, MilestoneState } from "./types";

/**
 * Milestone state machine: current state → the actions available in that
 * state and the state each action leads to. The UI derives its action
 * affordances from this map, and the later escrow-action simulation
 * applies it, so both stay in sync by construction.
 */
export const MILESTONE_TRANSITIONS: Readonly<
  Record<MilestoneState, Readonly<Partial<Record<MilestoneAction, MilestoneState>>>>
> = {
  pending: { submit: "submitted" },
  submitted: { approve: "approved", dispute: "disputed" },
  approved: { release: "released" },
  disputed: { reopen: "pending" },
  released: {},
};

export function availableMilestoneActions(state: MilestoneState): MilestoneAction[] {
  return Object.keys(MILESTONE_TRANSITIONS[state]) as MilestoneAction[];
}

/** Returns the next state, or null when the action is invalid in this state. */
export function applyMilestoneAction(
  state: MilestoneState,
  action: MilestoneAction
): MilestoneState | null {
  return MILESTONE_TRANSITIONS[state][action] ?? null;
}
