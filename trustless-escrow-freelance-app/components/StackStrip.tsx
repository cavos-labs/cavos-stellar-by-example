import { Reveal } from "./Reveal";
import { links } from "@/lib/links";

interface Tool {
  name: string;
  role: string;
  href: string;
}

const TOOLS: Tool[] = [
  { name: "Cavos", role: "Invisible wallet onboarding", href: links.cavos },
  { name: "Trustless Work", role: "Milestone escrow infrastructure", href: links.trustlessWork },
  { name: "Stellar", role: "Stablecoin settlement layer", href: links.stellar },
];

export function StackStrip() {
  return (
    <section id="stack" className="border-t border-line px-6 py-16 md:px-16 md:py-20 lg:px-24">
      <Reveal>
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-brand">
          Built with
        </p>
        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {TOOLS.map((tool) => (
            <a
              key={tool.name}
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between bg-white p-6 transition-colors hover:bg-surface md:p-7"
            >
              <div>
                <p className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink">
                  {tool.name}
                </p>
                <p className="mt-1 text-[13px] text-muted">{tool.role}</p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="shrink-0 text-ink/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
              >
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
