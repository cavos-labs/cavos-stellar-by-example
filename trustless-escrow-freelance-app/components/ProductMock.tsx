import { Reveal } from "./Reveal";

function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 48 48" aria-hidden className={className}>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.3C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.2 5.3C39.9 36 44 30.6 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

function CheckDot() {
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-signal/10 text-signal ring-1 ring-signal/25">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 12l5 5L20 6" />
      </svg>
    </span>
  );
}

function ActiveDot() {
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/10 text-brand ring-1 ring-brand/30">
      <span className="animate-pulse-dot h-2 w-2 rounded-full bg-brand" />
    </span>
  );
}

function PendingDot() {
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-ink/25 ring-1 ring-line-strong">
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
    </span>
  );
}

interface Milestone {
  title: string;
  amount: string;
  state: "released" | "active" | "pending";
  note: string;
}

const MILESTONES: Milestone[] = [
  { title: "Wireframes & IA", amount: "300 USDC", state: "released", note: "Approved · released on Stellar" },
  { title: "Visual design", amount: "400 USDC", state: "released", note: "Approved · released on Stellar" },
  { title: "Front-end build", amount: "500 USDC", state: "active", note: "Submitted · awaiting client review" },
];

export function ProductMock() {
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
              escrow-freelance.mock / contracts / 8f2a
            </span>
          </div>

          <div className="grid lg:grid-cols-[1.55fr_1fr] lg:divide-x lg:divide-line">
            {/* ── Left: contract + milestones ── */}
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-ink">
                    Landing page redesign
                  </h3>
                  <p className="mt-1 text-[13px] text-muted">
                    Contract between{" "}
                    <span className="font-medium text-ink/70">Nova Studio</span>{" "}
                    and{" "}
                    <span className="font-medium text-ink/70">@jamie.design</span>
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-[11px] font-semibold text-brand">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  Escrow funded
                </span>
              </div>

              {/* Milestone ledger */}
              <div className="mt-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">
                  Milestones
                </p>
                <ol className="mt-3 space-y-2.5">
                  {MILESTONES.map((m) => (
                    <li
                      key={m.title}
                      className="flex items-center gap-3.5 rounded-xl border border-line bg-white px-4 py-3.5"
                    >
                      {m.state === "released" ? (
                        <CheckDot />
                      ) : m.state === "active" ? (
                        <ActiveDot />
                      ) : (
                        <PendingDot />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-medium text-ink">
                          {m.title}
                        </p>
                        <p className="truncate text-[11.5px] text-muted">{m.note}</p>
                      </div>
                      <span
                        className={`shrink-0 font-mono text-[12.5px] font-medium ${
                          m.state === "released" ? "text-signal" : "text-ink/70"
                        }`}
                      >
                        {m.amount}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* ── Right: escrow summary + Cavos wallet ── */}
            <div className="flex flex-col gap-6 bg-surface/60 p-6 md:p-8">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">
                  Escrow balance
                </p>
                <p className="mt-2 text-[2rem] font-semibold tracking-tight text-ink">
                  1,200 <span className="text-[1rem] font-medium text-muted">USDC</span>
                </p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div className="h-full w-[58%] rounded-full bg-signal" />
                </div>
                <p className="mt-2 text-[12px] text-muted">
                  <span className="font-medium text-signal">700 released</span> ·
                  500 held in escrow
                </p>
              </div>

              {/* Cavos wallet card — the onboarding surface */}
              <div className="rounded-xl border border-line bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">
                    Signed in with Cavos
                  </span>
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-white ring-1 ring-line">
                    <GoogleG />
                  </span>
                </div>
                <p className="mt-2.5 text-[13px] font-medium text-ink">
                  jamie@studio.xyz
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-mono text-[12.5px] text-ink/70">
                    G…7f9 · smart account
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
                  {["self-custodial", "gas abstracted", "Stellar"].map((c) => (
                    <span
                      key={c}
                      className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink/50"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white opacity-90"
              >
                Approve &amp; release 500 USDC
              </button>
              <p className="-mt-3 text-center text-[11px] text-ink/35">
                Mock-up only — Cavos &amp; Trustless Work wiring comes next
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
