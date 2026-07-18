import type { Milestone, MilestoneState, Project } from "@/lib/domain/types";
import { escrowTotals, formatUsdc, isEscrowFunded } from "@/lib/domain/escrow";
import { StatusBadge } from "./StatusBadge";

function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 48 48" aria-hidden className={className}>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.3C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.2 5.3C39.9 36 44 30.6 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

function CheckDot() {
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-signal/10 text-signal ring-1 ring-signal/25">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 12l5 5L20 6" />
      </svg>
    </span>
  );
}

function ActiveDot() {
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/10 text-brand ring-1 ring-brand/30">
      <span className="animate-pulse-dot h-2 w-2 rounded-full bg-brand" />
    </span>
  );
}

function PendingDot() {
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-ink/25 ring-1 ring-line-strong">
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
    </span>
  );
}

function DisputedDot() {
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/5 font-mono text-[13px] font-bold text-brand ring-1 ring-brand/30">
      !
    </span>
  );
}

function MilestoneDot({ state }: { state: MilestoneState }) {
  switch (state) {
    case "released":
      return <CheckDot />;
    case "submitted":
    case "approved":
      return <ActiveDot />;
    case "disputed":
      return <DisputedDot />;
    case "pending":
      return <PendingDot />;
  }
}

const MILESTONE_NOTES: Record<MilestoneState, string> = {
  pending: "Not started",
  submitted: "Submitted · awaiting client review",
  approved: "Approved · release pending",
  released: "Approved · released on Stellar",
  disputed: "Disputed · under review",
};

function balanceCaption(project: Project): string {
  const { released, held } = escrowTotals(project);
  switch (project.escrowStatus) {
    case "draft":
      return "Draft — milestones are not locked in escrow yet";
    case "awaiting_funding":
      return "Awaiting client funding — nothing locked yet";
    case "cancelled":
      return "Contract cancelled — no funds held";
    case "released":
      return `${released.toLocaleString("en-US")} released · escrow closed`;
    case "funded":
    case "partially_released":
      return `${held.toLocaleString("en-US")} held in escrow`;
  }
}

function primaryActionLabel(project: Project): string | null {
  const { total } = escrowTotals(project);
  const submitted = project.milestones.find((m) => m.state === "submitted");
  const approved = project.milestones.find((m) => m.state === "approved");
  switch (project.escrowStatus) {
    case "draft":
      return "Send contract for funding";
    case "awaiting_funding":
      return `Fund escrow (${formatUsdc(total)})`;
    case "funded":
    case "partially_released":
      if (approved) return `Release ${formatUsdc(approved.amount)}`;
      if (submitted) return `Approve & release ${formatUsdc(submitted.amount)}`;
      return "Waiting on next milestone";
    case "released":
    case "cancelled":
      return null;
  }
}

function MilestoneRow({ milestone }: { milestone: Milestone }) {
  return (
    <li className="flex items-center gap-3.5 rounded-xl border border-line bg-white px-4 py-3.5">
      <MilestoneDot state={milestone.state} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-medium text-ink">{milestone.title}</p>
        <p className="truncate text-[11.5px] text-muted">
          {MILESTONE_NOTES[milestone.state]}
        </p>
      </div>
      <span
        className={`shrink-0 font-mono text-[12.5px] font-medium ${
          milestone.state === "released" ? "text-signal" : "text-ink/70"
        }`}
      >
        {formatUsdc(milestone.amount)}
      </span>
    </li>
  );
}

interface EscrowContractCardProps {
  project: Project;
}

/**
 * The core product surface: contract + milestone ledger + escrow summary +
 * Cavos wallet card. Purely presentational — it renders whatever Project
 * it is given, so every demo scenario (and later, real gateway data) uses
 * the exact same UI.
 */
export function EscrowContractCard({ project }: EscrowContractCardProps) {
  const totals = escrowTotals(project);
  const funded = isEscrowFunded(project.escrowStatus);
  const actionLabel = primaryActionLabel(project);

  return (
    <div className="grid lg:grid-cols-[1.55fr_1fr] lg:divide-x lg:divide-line">
      {/* ── Left: contract + milestones ── */}
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-ink">
              {project.title}
            </h3>
            <p className="mt-1 text-[13px] text-muted">
              Contract between{" "}
              <span className="font-medium text-ink/70">{project.client.name}</span>{" "}
              and{" "}
              <span className="font-medium text-ink/70">
                {project.freelancer.handle ?? project.freelancer.name}
              </span>
            </p>
          </div>
          <StatusBadge status={project.escrowStatus} />
        </div>

        {/* Milestone ledger */}
        <div className="mt-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">
            Milestones
          </p>
          {project.milestones.length === 0 ? (
            <p className="mt-3 rounded-xl border border-dashed border-line-strong px-4 py-6 text-center text-[12.5px] text-muted">
              No milestones defined yet.
            </p>
          ) : (
            <ol className="mt-3 space-y-2.5">
              {project.milestones.map((m) => (
                <MilestoneRow key={m.id} milestone={m} />
              ))}
            </ol>
          )}
        </div>
      </div>

      {/* ── Right: escrow summary + Cavos wallet ── */}
      <div className="flex flex-col gap-6 bg-surface/60 p-6 md:p-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">
            {funded ? "Escrow balance" : "Contract value"}
          </p>
          <p className="mt-2 text-[2rem] font-semibold tracking-tight text-ink">
            {totals.total.toLocaleString("en-US")}{" "}
            <span className="text-[1rem] font-medium text-muted">{project.asset}</span>
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-signal"
              style={{ width: `${totals.releasedPct}%` }}
            />
          </div>
          <p className="mt-2 text-[12px] text-muted">
            {totals.released > 0 ? (
              <>
                <span className="font-medium text-signal">
                  {totals.released.toLocaleString("en-US")} released
                </span>{" "}
                · {balanceCaption(project)}
              </>
            ) : (
              balanceCaption(project)
            )}
          </p>
        </div>

        {/* Cavos wallet card — the onboarding surface */}
        <div className="rounded-xl border border-line bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">
              Signed in with Cavos
            </span>
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white ring-1 ring-line">
              <GoogleG />
            </span>
          </div>
          <p className="mt-2.5 text-[13px] font-medium text-ink">
            {project.freelancer.email ?? "Cavos sign-in pending"}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-mono text-[12.5px] text-ink/70">
              {project.freelancer.walletShort ?? "G…???"} · smart account
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
            {["self-custodial", "gas abstracted", "Stellar"].map((c) => (
              <span
                key={c}
                className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink/50"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {actionLabel ? (
          <>
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white opacity-90"
            >
              {actionLabel}
            </button>
            <p className="-mt-3 text-center text-[11px] text-ink/35">
              Mock-up only — Cavos &amp; Trustless Work wiring comes next
            </p>
          </>
        ) : (
          <p className="rounded-md border border-line bg-white px-4 py-3 text-center text-[12px] text-muted">
            {project.escrowStatus === "released"
              ? "All milestones released — this contract is complete."
              : "This contract is closed. No further escrow actions are available."}
          </p>
        )}
      </div>
    </div>
  );
}
