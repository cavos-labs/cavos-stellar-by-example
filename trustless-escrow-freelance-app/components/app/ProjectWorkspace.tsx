"use client";

import { useEffect, useState } from "react";
import { useEscrowGateway } from "@/lib/domain/escrowGatewayProvider";
import { availableMilestoneActions } from "@/lib/domain/transitions";
import type { MilestoneAction, Project } from "@/lib/domain/types";
import { EscrowContractCard } from "./EscrowContractCard";

const ACTION_LABELS: Record<MilestoneAction, string> = {
  submit: "Submit work",
  approve: "Approve",
  dispute: "Dispute",
  release: "Release funds",
  reopen: "Reopen",
};

type WiredAction = "submit" | "approve" | "release";

/** Milestone actions the DemoEscrowGateway implements — dispute/reopen exist in the state machine but have no gateway method yet. */
function isWiredAction(action: MilestoneAction): action is WiredAction {
  return action === "submit" || action === "approve" || action === "release";
}

interface StatusMessage {
  kind: "success" | "error";
  text: string;
}

interface ProjectWorkspaceProps {
  project: Project;
}

/**
 * Owns the live, gateway-backed copy of a project. `EscrowContractCard`
 * (the summary card) and the milestone action buttons below it both read
 * from this single piece of state, so a mutation from either surface is
 * reflected everywhere immediately.
 */
export function ProjectWorkspace({ project: initialProject }: ProjectWorkspaceProps) {
  const gateway = useEscrowGateway();
  const [project, setProject] = useState(initialProject);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<StatusMessage | null>(null);

  // The gateway seeds its own copy of the fixtures on mount. If this
  // project was already mutated earlier in the session (e.g. the user
  // navigated away and back), pick that up instead of the server-rendered
  // snapshot, which is always the pristine fixture.
  useEffect(() => {
    let cancelled = false;
    gateway.getEscrow(initialProject.id).then((result) => {
      if (!cancelled && result.success) setProject(result.data);
    });
    return () => {
      cancelled = true;
    };
  }, [gateway, initialProject.id]);

  async function runFund(milestoneId: string) {
    setPending(true);
    setStatus(null);
    const result = await gateway.fundMilestone(project.id, milestoneId);
    setPending(false);
    if (result.success) {
      setProject(result.data);
      setStatus({ kind: "success", text: `Milestone funded — tx ${result.txRef}` });
    } else {
      setStatus({ kind: "error", text: `${result.error.code}: ${result.error.message}` });
    }
  }

  async function runAction(milestoneId: string, action: WiredAction) {
    setPending(true);
    setStatus(null);
    const result = await (action === "submit"
      ? gateway.submitMilestone(project.id, milestoneId)
      : action === "approve"
        ? gateway.approveMilestone(project.id, milestoneId)
        : gateway.releaseMilestone(project.id, milestoneId));
    setPending(false);
    if (result.success) {
      setProject(result.data);
      setStatus({
        kind: "success",
        text: `${ACTION_LABELS[action]} succeeded — tx ${result.txRef}`,
      });
    } else {
      setStatus({ kind: "error", text: `${result.error.code}: ${result.error.message}` });
    }
  }

  return (
    <>
      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_80px_-48px_rgba(10,10,15,0.35)]">
        <EscrowContractCard project={project} />
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-white p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">
          Milestone actions
        </p>

        {status ? (
          <p
            className={`mt-3 rounded-lg border px-3 py-2 text-[12.5px] ${
              status.kind === "success"
                ? "border-signal/25 bg-signal/5 text-signal"
                : "border-brand/25 bg-brand-soft text-brand"
            }`}
          >
            {status.text}
          </p>
        ) : null}

        <ul className="mt-4 space-y-3">
          {project.milestones.map((m) => {
            const actions = availableMilestoneActions(m.state);
            return (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[13.5px] font-medium text-ink">{m.title}</span>
                <span className="flex flex-wrap gap-1.5">
                  {!m.funded ? (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => runFund(m.id)}
                      className="rounded-md border border-brand/30 bg-brand-soft px-3 py-1.5 text-[12px] font-semibold text-brand transition-colors hover:bg-brand-soft/70 disabled:cursor-wait disabled:opacity-50"
                    >
                      Fund
                    </button>
                  ) : null}
                  {actions.length === 0 ? (
                    <span className="font-mono text-[11px] text-ink/40">terminal state</span>
                  ) : (
                    actions.map((a) =>
                      isWiredAction(a) ? (
                        <button
                          key={a}
                          type="button"
                          disabled={pending || !m.funded}
                          onClick={() => runAction(m.id, a)}
                          className="rounded-md border border-line-strong bg-white px-3 py-1.5 text-[12px] font-semibold text-ink transition-colors hover:bg-surface disabled:cursor-wait disabled:opacity-50"
                        >
                          {ACTION_LABELS[a]}
                        </button>
                      ) : (
                        <button
                          key={a}
                          type="button"
                          disabled
                          title="Not implemented by the demo gateway yet"
                          className="rounded-md border border-line-strong bg-white px-3 py-1.5 text-[12px] font-semibold text-ink/40 opacity-60"
                        >
                          {ACTION_LABELS[a]}
                        </button>
                      )
                    )
                  )}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 border-t border-line pt-4 text-[11.5px] text-ink/40">
          Actions call <code className="font-mono text-[11px]">DemoEscrowGateway</code>, a
          deterministic in-memory simulator seeded from the Wave 0 fixtures — state resets on
          page reload. See{" "}
          <code className="font-mono text-[11px]">docs/ESCROW_GATEWAY_SEAM.md</code> for how a
          real gateway replaces it.
        </p>
      </div>
    </>
  );
}
