"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/domain/types";
import { EscrowContractCard } from "./EscrowContractCard";

interface MilestoneDraft {
  title: string;
  amount: string;
}

const INITIAL_MILESTONES: MilestoneDraft[] = [
  { title: "Kickoff & discovery", amount: "250" },
  { title: "First deliverable", amount: "500" },
];

const inputClass =
  "rounded-md border border-line-strong bg-white px-3 py-2 text-[13.5px] text-ink placeholder:text-ink/30 focus:border-brand focus:outline-none";

/**
 * Local-only draft builder: the form state is mapped into a domain
 * Project and previewed with the same EscrowContractCard the rest of
 * the app uses. Nothing is persisted — creation is a simulation until
 * the Trustless Work gateway lands.
 */
export function NewProjectForm() {
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [freelancerHandle, setFreelancerHandle] = useState("");
  const [milestones, setMilestones] = useState<MilestoneDraft[]>(INITIAL_MILESTONES);
  const [simulated, setSimulated] = useState(false);

  const previewProject: Project = useMemo(
    () => ({
      id: "draft-preview",
      title: title.trim() || "Untitled project",
      summary: "",
      client: {
        id: "draft-client",
        role: "client",
        name: clientName.trim() || "Client",
      },
      freelancer: {
        id: "draft-freelancer",
        role: "freelancer",
        name: freelancerHandle.trim() || "Freelancer",
        handle: freelancerHandle.trim() || "@freelancer",
      },
      escrowStatus: "draft",
      asset: "USDC",
      milestones: milestones
        .filter((m) => m.title.trim() !== "")
        .map((m, i) => ({
          id: `draft-m${i + 1}`,
          title: m.title.trim(),
          amount: Math.max(0, Math.floor(Number(m.amount)) || 0),
          state: "pending" as const,
        })),
    }),
    [title, clientName, freelancerHandle, milestones]
  );

  const updateMilestone = (index: number, patch: Partial<MilestoneDraft>) => {
    setMilestones((prev) =>
      prev.map((m, i) => (i === index ? { ...m, ...patch } : m))
    );
    setSimulated(false);
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.3fr]">
      {/* ── Form ── */}
      <form
        className="rounded-2xl border border-line bg-white p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSimulated(true);
        }}
      >
        <label className="block">
          <span className="text-[12.5px] font-medium text-ink/70">Project title</span>
          <input
            className={`mt-1.5 w-full ${inputClass}`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSimulated(false);
            }}
            placeholder="Landing page redesign"
          />
        </label>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[12.5px] font-medium text-ink/70">Client</span>
            <input
              className={`mt-1.5 w-full ${inputClass}`}
              value={clientName}
              onChange={(e) => {
                setClientName(e.target.value);
                setSimulated(false);
              }}
              placeholder="Nova Studio"
            />
          </label>
          <label className="block">
            <span className="text-[12.5px] font-medium text-ink/70">Freelancer handle</span>
            <input
              className={`mt-1.5 w-full ${inputClass}`}
              value={freelancerHandle}
              onChange={(e) => {
                setFreelancerHandle(e.target.value);
                setSimulated(false);
              }}
              placeholder="@jamie.design"
            />
          </label>
        </div>

        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">
            Milestones
          </p>
          <div className="mt-3 space-y-2.5">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className={`min-w-0 flex-1 ${inputClass}`}
                  value={m.title}
                  onChange={(e) => updateMilestone(i, { title: e.target.value })}
                  placeholder={`Milestone ${i + 1}`}
                  aria-label={`Milestone ${i + 1} title`}
                />
                <input
                  className={`${inputClass} w-28 shrink-0 font-mono text-[12.5px]`}
                  value={m.amount}
                  onChange={(e) => updateMilestone(i, { amount: e.target.value })}
                  inputMode="numeric"
                  placeholder="USDC"
                  aria-label={`Milestone ${i + 1} amount in USDC`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setMilestones((prev) => prev.filter((_, idx) => idx !== i));
                    setSimulated(false);
                  }}
                  disabled={milestones.length === 1}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-line-strong text-ink/40 transition-colors hover:text-ink disabled:opacity-40 disabled:hover:text-ink/40"
                  aria-label={`Remove milestone ${i + 1}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                    <path d="M5 12h14" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setMilestones((prev) => [...prev, { title: "", amount: "" }]);
              setSimulated(false);
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand transition-colors hover:text-brand-hover"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add milestone
          </button>
        </div>

        <button
          type="submit"
          className="mt-7 w-full rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          Create project (simulated)
        </button>
        {simulated ? (
          <p role="status" className="mt-3 rounded-md border border-brand/20 bg-brand-soft px-3 py-2 text-[12px] text-ink/70">
            Creation is simulated in this mock — nothing was saved. The real flow
            will create a Trustless Work escrow contract here.
          </p>
        ) : (
          <p className="mt-3 text-center text-[11px] text-ink/35">
            No persistence yet — this drafts a contract preview only.
          </p>
        )}
      </form>

      {/* ── Live preview through the shared contract UI ── */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">
          Draft preview
        </p>
        <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_80px_-48px_rgba(10,10,15,0.35)]">
          <EscrowContractCard project={previewProject} />
        </div>
      </div>
    </div>
  );
}
