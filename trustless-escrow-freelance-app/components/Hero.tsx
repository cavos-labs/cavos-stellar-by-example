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

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-32 pb-20 md:px-16 lg:px-24"
    >
      {/* Full-bleed ambient plane: indigo wash + technical dot-grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_-10%,#ECEAFF_0%,#F6F5FF_34%,#FFFFFF_68%)]"
      />
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent_75%)]"
      />

      <div className="mx-auto w-full max-w-[1000px]">
        <div
          className="animate-fade-up flex flex-wrap items-center gap-2.5"
        >
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-brand">
            Cavos &times; Trustless Work &times; Stellar
          </p>
          <span className="rounded-full border border-brand/20 bg-brand-soft px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-brand">
            Mock-up
          </span>
        </div>

        {/* Brand is the hero-level signal */}
        <h1
          className="animate-fade-up mt-5 max-w-[16ch] text-[clamp(2.25rem,6.5vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink"
          style={{ animationDelay: "60ms" }}
        >
          Trustless Escrow Freelance App
        </h1>

        <p
          className="animate-fade-up mt-6 max-w-[28ch] text-[clamp(1.25rem,2.6vw,1.75rem)] font-medium leading-[1.2] tracking-[-0.02em] text-ink/80"
          style={{ animationDelay: "120ms" }}
        >
          A reference mock-up for freelancing with escrow on Stellar.
        </p>

        <p
          className="animate-fade-up mt-5 max-w-[54ch] text-[15px] leading-relaxed text-muted md:text-base"
          style={{ animationDelay: "180ms" }}
        >
          This is not a production product yet — it is an open-source example of
          an important use case: clients and freelancers onboard with a full{" "}
          <span className="font-medium text-ink/70">Cavos</span> integration,
          and payments settle through a full{" "}
          <span className="font-medium text-ink/70">Trustless Work</span>{" "}
          milestone-escrow integration on Stellar. Builders can clone it,
          study the flow, and ship their own version on web and mobile.
        </p>

        <div
          className="animate-fade-up mt-9 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <a
            href="#flow"
            className="group inline-flex items-center gap-1.5 rounded-md bg-brand px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover active:scale-[0.98]"
          >
            Explore the mock-up
            <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href={links.contributing}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md border border-line-strong bg-white px-7 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/40"
          >
            Contribute
          </a>
        </div>
      </div>
    </section>
  );
}
