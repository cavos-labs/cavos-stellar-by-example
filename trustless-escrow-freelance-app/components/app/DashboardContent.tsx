"use client";

import { useMemo, useState } from "react";
import { useEscrowGatewayWithDemo } from "@/lib/domain/escrowGatewayProvider";
import { getDemoScenario } from "@/lib/fixtures/projects";
import type { EscrowStatus, Project } from "@/lib/domain/types";
import { ProjectCard } from "./ProjectCard";

interface DashboardContentProps {
  fixtureProjects: Project[];
  filterStatuses: EscrowStatus[] | null;
}

export function DashboardContent({ fixtureProjects, filterStatuses }: DashboardContentProps) {
  const { demoProjects, resetDemoProjects } = useEscrowGatewayWithDemo();
  const [showConfirm, setShowConfirm] = useState(false);

  const merged = useMemo(() => {
    const visible = (projects: Project[]) =>
      filterStatuses === null
        ? projects
        : projects.filter((p) => filterStatuses.includes(p.escrowStatus));

    const fixtures = visible(fixtureProjects).map((p) => {
      const scenario = getDemoScenario(p.id);
      return { project: p, scenario: scenario?.label ?? null, kind: "fixture" as const };
    });

    const demos = visible(demoProjects).map((p) => ({
      project: p,
      scenario: "Simulated" as const,
      kind: "demo" as const,
    }));

    return { fixtures, demos, showDemoSection: demoProjects.length > 0 };
  }, [fixtureProjects, demoProjects, filterStatuses]);

  return (
    <div className="mt-6">
      {merged.fixtures.length === 0 && merged.demos.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-8 text-center">
          <p className="text-[13.5px] font-medium text-ink/60">No projects match this filter</p>
        </div>
      ) : (
        <>
          {merged.fixtures.length > 0 ? (
            <>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">
                Demo scenarios
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {merged.fixtures.map(({ project, scenario }) => (
                  <div key={project.id} className="relative">
                    {scenario ? (
                      <span className="absolute -top-3 left-3 z-10 rounded-full border border-brand/20 bg-brand-soft/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-brand">
                        {scenario}
                      </span>
                    ) : null}
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {merged.demos.length > 0 ? (
            <div className={merged.fixtures.length > 0 ? "mt-8" : ""}>
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">
                  Your simulated projects
                </p>
                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="rounded-md border border-line-strong px-3 py-1.5 text-[11px] font-medium text-ink/50 transition-colors hover:border-red-400 hover:text-red-600"
                >
                  Clear demo data
                </button>
              </div>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {merged.demos.map(({ project }) => (
                  <div key={project.id} className="relative">
                    <span className="absolute -top-3 left-3 z-10 rounded-full border border-signal/30 bg-signal/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-signal">
                      Simulated
                    </span>
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}

      {showConfirm ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border border-line bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full text-[14px] text-ink/40 transition-colors hover:bg-line/60 hover:text-ink/70"
              aria-label="Close"
            >
              ✕
            </button>
            <p className="text-center text-[14px] font-semibold text-ink">
              Delete all simulated projects?
            </p>
            <p className="mt-1 text-center text-[12.5px] text-muted">
              This action cannot be undone.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-line-strong px-5 py-2 text-[12.5px] font-medium text-ink/70 transition-colors hover:bg-line/50"
              >
                Don&apos;t Delete it
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemoProjects();
                  setShowConfirm(false);
                }}
                className="rounded-lg bg-red-600 px-5 py-2 text-[12.5px] font-medium text-white transition-colors hover:bg-red-700"
              >
                Yes, Delete it
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
