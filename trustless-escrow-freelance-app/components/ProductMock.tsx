import Link from "next/link";
import { LANDING_DEMO_PROJECT_ID, getDemoProject } from "@/lib/fixtures/projects";
import { EscrowContractCard } from "./app/EscrowContractCard";
import { Reveal } from "./Reveal";

export function ProductMock() {
  const project = getDemoProject(LANDING_DEMO_PROJECT_ID);
  if (!project) return null;

  return (
    <section id="flow" className="border-t border-line px-6 py-20 md:px-16 md:py-28 lg:px-24">
      <Reveal className="max-w-[42rem]">
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-brand">
          Mock-up preview
        </p>
        <h2 className="mt-3 text-[clamp(1.625rem,2.6vw,2.375rem)] font-medium leading-[1.14] tracking-[-0.03em] text-ink">
          One contract. Funds locked up front,{" "}
          <span className="text-muted">
            released milestone by milestone — static UI for now.
          </span>
        </h2>
      </Reveal>

      <Reveal className="mt-12 md:mt-16" delay={80}>
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_80px_-48px_rgba(10,10,15,0.35)]">
          {/* App chrome */}
          <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="ml-3 font-mono text-[11px] text-ink/40">
              escrow-freelance.mock / projects / {project.id}
            </span>
          </div>
          <EscrowContractCard project={project} />
        </div>

        <p className="mt-5 text-center text-[13px] text-muted">
          This preview is one of several deterministic demo scenarios.{" "}
          <Link
            href={`/projects/${project.id}`}
            className="font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          >
            Open it in the demo app
          </Link>{" "}
          or{" "}
          <Link
            href="/dashboard"
            className="font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          >
            browse all scenarios
          </Link>
          .
        </p>
      </Reveal>
    </section>
  );
}
