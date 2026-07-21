import type { Project } from "./types";

/**
 * Port that any escrow backend must satisfy — today a deterministic local
 * simulator, later a real Cavos + Trustless Work integration. The UI and
 * routes depend only on this interface, never on a concrete
 * implementation, so swapping one for the other is a one-file change.
 *
 * Every operation returns an `EscrowResult` instead of throwing, so
 * callers handle failure as data — mirroring how an on-chain call can
 * fail without anything being broken in the app itself.
 */
export interface EscrowGateway {
  getEscrow(projectId: string): Promise<EscrowResult<Project>>;
  createEscrow(project: Omit<Project, "escrowStatus">): Promise<EscrowResult<Project>>;
  fundMilestone(projectId: string, milestoneId: string): Promise<EscrowResult<Project>>;
  submitMilestone(projectId: string, milestoneId: string): Promise<EscrowResult<Project>>;
  approveMilestone(projectId: string, milestoneId: string): Promise<EscrowResult<Project>>;
  releaseMilestone(projectId: string, milestoneId: string): Promise<EscrowResult<Project>>;
}

export type EscrowResult<T> =
  | {
      success: true;
      data: T;
      /** Simulated or real Stellar transaction hash for this operation. */
      txRef: string;
    }
  | { success: false; error: EscrowError };

export interface EscrowError {
  code: EscrowErrorCode;
  message: string;
}

export type EscrowErrorCode =
  | "NOT_FOUND"
  | "ALREADY_EXISTS"
  | "INVALID_TRANSITION"
  | "ALREADY_FUNDED"
  | "UNAPPROVED_RELEASE"
  | "UNFUNDED_ACTION";
