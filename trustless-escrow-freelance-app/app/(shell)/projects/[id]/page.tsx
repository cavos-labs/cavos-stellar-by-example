import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { availableMilestoneActions } from "@/lib/domain/transitions";
import { getDemoScenario } from "@/lib/fixtures/projects";
import { getProject } from "@/lib/gateway";
import { EscrowContractCard } from "@/components/app/EscrowContractCard";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  return {
    title: `${project?.title ?? "Project not found"} | Trustless Escrow Freelance App`,
  };
}

const ACTION_LABELS: Record<string, string> = {
  submit: "Submit work",
  approve: "Approve",
  dispute: "Dispute",
  release: "Release funds",
  reopen: "Reopen",
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const scenario = getDemoScenario(project.id);

  return (
    <div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink/50 transition-colors hover:text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        Dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-ink">
            {project.title}
          </h1>
          <p className="mt-1 text-[13.5px] text-muted">{project.summary}</p>
        </div>
        {scenario ? (
          <div className="max-w-[22rem] rounded-xl border border-brand/20 bg-brand-soft/60 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand">
              Demo scenario · {scenario.label}
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink/70">
              {scenario.description}
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_80px_-48px_rgba(10,10,15,0.35)]">
        <EscrowContractCard project={project} />
      </div>

      {/* Available actions, derived from the milestone state machine */}
      <div className="mt-8 rounded-2xl border border-line bg-white p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">
          Available milestone actions
        </p>
        <ul className="mt-4 space-y-3">
          {project.milestones.map((m) => {
            const actions = availableMilestoneActions(m.state);
            return (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[13.5px] font-medium text-ink">{m.title}</span>
                <span className="flex flex-wrap gap-1.5">
                  {actions.length === 0 ? (
                    <span className="font-mono text-[11px] text-ink/40">
                      terminal state
                    </span>
                  ) : (
                    actions.map((a) => (
                      <button
                        key={a}
                        type="button"
                        disabled
                        className="rounded-md border border-line-strong bg-white px-3 py-1.5 text-[12px] font-semibold text-ink/60 opacity-80"
                      >
                        {ACTION_LABELS[a]}
                      </button>
                    ))
                  )}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 border-t border-line pt-4 text-[11.5px] text-ink/40">
          Actions come from the milestone state machine in{" "}
          <code className="font-mono text-[11px]">lib/domain/transitions.ts</code>.
          They are disabled here — escrow action simulation is a follow-up issue.
        </p>
      </div>
    </div>
  );
}
