import type { Metadata } from "next";
import Link from "next/link";
import type { EscrowStatus } from "@/lib/domain/types";
import { listProjects } from "@/lib/gateway";
import { EmptyState } from "@/components/app/EmptyState";
import { DashboardContent } from "@/components/app/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard | Trustless Escrow Freelance App",
};

const FILTERS: Record<string, { label: string; statuses: EscrowStatus[] | null }> = {
  all: { label: "All", statuses: null },
  draft: { label: "Draft", statuses: ["draft"] },
  "awaiting-funding": { label: "Awaiting funding", statuses: ["awaiting_funding"] },
  active: { label: "Active", statuses: ["funded", "partially_released"] },
  released: { label: "Released", statuses: ["released"] },
};

interface DashboardPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { status } = await searchParams;
  const filterKey = status ?? "all";
  const filter = FILTERS[filterKey];
  const projects = await listProjects();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
            Dashboard
          </p>
          <h1 className="mt-2 text-[1.75rem] font-semibold tracking-[-0.03em] text-ink">
            Projects
          </h1>
          <p className="mt-1 text-[13.5px] text-muted">
            Deterministic demo scenarios — each project shows one escrow state.
          </p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          New project
        </Link>
      </div>

      <div className="mt-7 flex flex-wrap gap-1.5">
        {Object.entries(FILTERS).map(([key, f]) => {
          const active = key === filterKey;
          return (
            <Link
              key={key}
              href={key === "all" ? "/dashboard" : `/dashboard?status=${key}`}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                active
                  ? "bg-ink text-white"
                  : "border border-line bg-white text-ink/60 hover:border-ink/30 hover:text-ink"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {filter === undefined ? (
        <div className="mt-6">
          <EmptyState
            title={`Unsupported filter: "${filterKey}"`}
            body="That status filter doesn't exist. Pick one of the tabs above, or view all projects."
            action={{ href: "/dashboard", label: "View all projects" }}
          />
        </div>
      ) : (
        <DashboardContent
          fixtureProjects={projects}
          filterStatuses={filter.statuses}
        />
      )}
    </div>
  );
}
