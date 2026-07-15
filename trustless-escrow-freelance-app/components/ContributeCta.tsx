import { Reveal } from "./Reveal";
import { links } from "@/lib/links";

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ContributeCta() {
  return (
    <section
      id="contribute"
      className="border-t border-line px-6 py-20 md:px-16 md:py-28 lg:px-24"
    >
      <Reveal className="mx-auto max-w-[52rem] text-center">
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-brand">
          Open source
        </p>
        <h2 className="mt-4 text-[clamp(1.75rem,3.4vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.03em] text-ink">
          Help turn this mock-up into the full reference app.
        </h2>
        <p className="mx-auto mt-5 max-w-[48ch] text-[15px] leading-relaxed text-muted md:text-base">
          Right now this is a landing mock-up. The goal is a complete Cavos
          integration and a complete Trustless Work integration on Stellar —
          a real freelance escrow use case people can clone and learn from on
          web and mobile. Pick an issue, read the contributor guide, and ship
          a piece of it.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href={links.issues}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-md bg-brand px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover active:scale-[0.98]"
          >
            Browse open issues
            <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href={links.contributing}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md border border-line-strong bg-white px-7 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/40"
          >
            Read the contributor guide
          </a>
        </div>
      </Reveal>
    </section>
  );
}
