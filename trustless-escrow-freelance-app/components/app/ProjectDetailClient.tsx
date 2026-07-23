"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEscrowGateway } from "@/lib/domain/escrowGatewayProvider";
import { getDemoScenario } from "@/lib/fixtures/projects";
import type { Project } from "@/lib/domain/types";
import { ProjectWorkspace } from "./ProjectWorkspace";

interface ProjectDetailClientProps {
  id: string;
  fixtureProject: Project | null;
}

export function ProjectDetailClient({ id, fixtureProject }: ProjectDetailClientProps) {
  const gateway = useEscrowGateway();
  const searchParams = useSearchParams();

  const [resolved, setResolved] = useState<{
    project: Project;
    kind: "fixture" | "demo";
  } | null>(() => {
    if (fixtureProject) return { project: fixtureProject, kind: "fixture" };
    return null;
  });
  const [loading, setLoading] = useState(!fixtureProject);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (fixtureProject) return;

    setLoading(true);
    let cancelled = false;

    gateway.getEscrow(id).then((result) => {
      if (cancelled) return;
      setLoading(false);
      if (result.success) {
        setResolved({ project: result.data, kind: "demo" });
      } else {
        setNotFound(true);
      }
    });

    return () => { cancelled = true; };
  }, [gateway, id, fixtureProject]);

  const isCreated = searchParams.get("created") === "true";
  const createdTxRef = searchParams.get("txRef") ?? "";

  if (loading) {
    return (
      <div className="mt-8 animate-pulse space-y-4">
        <div className="h-8 w-1/3 rounded bg-ink/5" />
        <div className="h-4 w-1/2 rounded bg-ink/5" />
        <div className="mt-8 h-64 rounded-2xl bg-ink/5" />
      </div>
    );
  }

  if (notFound || !resolved) {
    return (
      <div className="mt-12 text-center">
        <p className="text-[1.25rem] font-semibold text-ink/60">Project not found</p>
        <p className="mt-1 text-[13.5px] text-muted">
          No demo scenario or simulated project matches this ID.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex items-center rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const scenario = resolved.kind === "fixture" ? getDemoScenario(resolved.project.id) : null;

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
            {resolved.project.title}
          </h1>
          <p className="mt-1 text-[13.5px] text-muted">{resolved.project.summary}</p>
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
        ) : resolved.kind === "demo" ? (
          <div className="max-w-[22rem] rounded-xl border border-signal/20 bg-signal/5 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
              Simulated project
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink/70">
              This project was created in your browser as a local demo. Data is
              stored in localStorage and will persist across sessions.
            </p>
          </div>
        ) : null}
      </div>

      {isCreated && createdTxRef ? (
        <div role="status" className="mt-5 rounded-md border border-signal/25 bg-signal/5 px-4 py-3">
          <p className="text-[13px] font-semibold text-signal">Project created successfully</p>
          <p className="mt-1 text-[12.5px] text-ink/70">
            Project ID: <code className="font-mono text-signal">{resolved.project.id}</code>
          </p>
          <p className="text-[12.5px] text-ink/70">
            Simulator reference: <code className="font-mono text-signal">{createdTxRef}</code>
          </p>
        </div>
      ) : null}

      <ProjectWorkspace project={resolved.project} />
    </div>
  );
}
