import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDemoScenario } from "@/lib/fixtures/projects";
import { getProject } from "@/lib/gateway";
import { ProjectWorkspace } from "@/components/app/ProjectWorkspace";

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

      <ProjectWorkspace project={project} />
    </div>
  );
}
