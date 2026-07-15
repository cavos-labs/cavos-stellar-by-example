import { Reveal } from "./Reveal";

interface Step {
  n: string;
  title: string;
  body: string;
  tool: string;
}

const STEPS: Step[] = [
  {
    n: "01",
    title: "Onboard with a social login",
    body: "The client and freelancer sign in with Google or Apple. Cavos deploys a self-custodial smart account for each of them automatically — no extensions, no seed phrases, gas abstracted.",
    tool: "Cavos",
  },
  {
    n: "02",
    title: "Fund a milestone escrow",
    body: "The client locks the agreed amount into a Trustless Work escrow, split across milestones. Funds are held on-chain and non-custodially — neither party, nor the platform, can touch them.",
    tool: "Trustless Work",
  },
  {
    n: "03",
    title: "Release on approval",
    body: "When the client approves a milestone, the escrow releases that portion to the freelancer's wallet on Stellar in seconds. Transparent, final, and free of chargebacks.",
    tool: "Stellar",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-line px-6 py-20 md:px-16 md:py-28 lg:px-24"
    >
      <Reveal className="max-w-[42rem]">
        <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-brand">
          Target flow
        </p>
        <h2 className="mt-3 text-[clamp(1.625rem,2.6vw,2.375rem)] font-medium leading-[1.14] tracking-[-0.03em] text-ink">
          The use case we&apos;re building toward.{" "}
          <span className="text-muted">Full Cavos. Full Trustless Work. On Stellar.</span>
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:mt-16 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <Reveal key={step.n} delay={i * 90}>
            <div className="flex h-full flex-col bg-white p-7 md:p-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[13px] font-medium text-brand">
                  {step.n}
                </span>
                <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/45">
                  {step.tool}
                </span>
              </div>
              <h3 className="mt-6 text-[1.1875rem] font-medium leading-tight tracking-[-0.02em] text-ink">
                {step.title}
              </h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
