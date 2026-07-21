/**
 * Domain model for the freelance escrow use case.
 *
 * These types describe exactly what the UI consumes. They are deliberately
 * decoupled from any SDK response shapes so a later gateway (Cavos +
 * Trustless Work) can map real data into them without rewriting the UI.
 */

export type PartyRole = "client" | "freelancer";

export interface Party {
  id: string;
  role: PartyRole;
  /** Display name, e.g. "Nova Studio" or "Jamie Rivera". */
  name: string;
  /** Public handle shown in contract copy, e.g. "@jamie.design". */
  handle?: string;
  /** Cavos social-login identity. Absent until the party signs in. */
  email?: string;
  /** Truncated Stellar smart-account address, e.g. "G…7F9". */
  walletShort?: string;
}

export type EscrowStatus =
  | "draft"
  | "awaiting_funding"
  | "funded"
  | "partially_released"
  | "released"
  | "cancelled";

export type MilestoneState =
  | "pending"
  | "submitted"
  | "approved"
  | "released"
  | "disputed";

export type MilestoneAction =
  | "submit"
  | "approve"
  | "dispute"
  | "release"
  | "reopen";

export interface Milestone {
  id: string;
  title: string;
  /** Whole USDC units — enough precision for the demo fixtures. */
  amount: number;
  state: MilestoneState;
  /**
   * Whether this milestone's amount is locked in the escrow contract.
   * Tracked independently of `state`: a milestone can be funded while
   * still `pending` (work not submitted yet) or `submitted` (awaiting
   * approval) — funding and work progress advance separately.
   */
  funded: boolean;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  client: Party;
  freelancer: Party;
  escrowStatus: EscrowStatus;
  /** Settlement asset. The demo only uses USDC. */
  asset: "USDC";
  milestones: Milestone[];
}
