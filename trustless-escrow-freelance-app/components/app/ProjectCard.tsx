import Link from "next/link";
import type { Project } from "@/lib/domain/types";
import { escrowTotals, formatUsdc } from "@/lib/domain/escrow";
import { StatusBadge } from "./StatusBadge";

export function ProjectCard({ project }: { project: Project }) {
  const totals = escrowTotals(project);

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-ink/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold tracking-tight text-ink group-hover:text-brand">
            {project.title}
          </h3>
          <p className="mt-1 truncate text-[12.5px] text-muted">
            {project.client.name} ·{" "}
            {project.freelancer.handle ?? project.freelancer.name}
          </p>
        </div>
        <StatusBadge status={project.escrowStatus} />
      </div>

      <div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-signal"
            style={{ width: `${totals.releasedPct}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-[11.5px] text-ink/50">
          {project.milestones.length} milestone
          {project.milestones.length === 1 ? "" : "s"} · {formatUsdc(totals.total)} ·{" "}
          {totals.releasedPct}% released
        </p>
      </div>
    </Link>
  );
}
