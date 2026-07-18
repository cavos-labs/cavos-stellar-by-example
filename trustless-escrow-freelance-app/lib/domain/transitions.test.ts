import { describe, expect, it } from "vitest";
import {
  MILESTONE_TRANSITIONS,
  applyMilestoneAction,
  availableMilestoneActions,
} from "./transitions";
import type { MilestoneState } from "./types";

describe("milestone transitions", () => {
  it("walks the happy path from pending to released", () => {
    let state: MilestoneState = "pending";
    state = applyMilestoneAction(state, "submit")!;
    expect(state).toBe("submitted");
    state = applyMilestoneAction(state, "approve")!;
    expect(state).toBe("approved");
    state = applyMilestoneAction(state, "release")!;
    expect(state).toBe("released");
  });

  it("supports dispute and reopen", () => {
    expect(applyMilestoneAction("submitted", "dispute")).toBe("disputed");
    expect(applyMilestoneAction("disputed", "reopen")).toBe("pending");
  });

  it("is terminal once released", () => {
    expect(availableMilestoneActions("released")).toEqual([]);
  });

  it("returns null for actions that are invalid in the current state", () => {
    expect(applyMilestoneAction("pending", "release")).toBeNull();
    expect(applyMilestoneAction("released", "submit")).toBeNull();
  });

  it("only transitions into known states", () => {
    const states = Object.keys(MILESTONE_TRANSITIONS);
    for (const targets of Object.values(MILESTONE_TRANSITIONS)) {
      for (const next of Object.values(targets)) {
        expect(states).toContain(next);
      }
    }
  });
});
