import type { EscrowStatus, Project } from "./types";

export interface EscrowTotals {
  /** Sum of all milestone amounts — the contract value. */
  total: number;
  /** Amount already released to the freelancer. */
  released: number;
  /** Funds locked in the escrow contract but not yet released. */
  held: number;
  /** Released share of the contract value, 0–100. */
  releasedPct: number;
}

const FUNDED_STATUSES: ReadonlySet<EscrowStatus> = new Set([
  "funded",
  "partially_released",
  "released",
]);

export function isEscrowFunded(status: EscrowStatus): boolean {
  return FUNDED_STATUSES.has(status);
}

export function escrowTotals(project: Project): EscrowTotals {
  const total = project.milestones.reduce((sum, m) => sum + m.amount, 0);
  const released = project.milestones
    .filter((m) => m.state === "released")
    .reduce((sum, m) => sum + m.amount, 0);
  const held = isEscrowFunded(project.escrowStatus) ? total - released : 0;
  const releasedPct = total === 0 ? 0 : Math.round((released / total) * 100);
  return { total, released, held, releasedPct };
}

export function formatUsdc(amount: number): string {
  return `${amount.toLocaleString("en-US")} USDC`;
}

export const ESCROW_STATUS_LABELS: Record<EscrowStatus, string> = {
  draft: "Draft",
  awaiting_funding: "Awaiting funding",
  funded: "Escrow funded",
  partially_released: "Partially released",
  released: "Fully released",
  cancelled: "Cancelled",
};
