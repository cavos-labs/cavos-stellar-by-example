"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useEscrowGatewayWithDemo } from "@/lib/domain/escrowGatewayProvider";
import { generateProjectId } from "@/lib/localDemoStore";
import { mapDraftToCreateEscrowInput, validateNewProjectDraft } from "@/lib/new-project/validation";
import type { FieldErrors } from "@/lib/new-project/validation";
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

const errorInputClass =
  "rounded-md border border-red-500 bg-white px-3 py-2 text-[13.5px] text-ink placeholder:text-ink/30 focus:border-red-500 focus:outline-none";

export function NewProjectForm() {
  const router = useRouter();
  const { createDemoEscrow, lastPersistError, clearPersistError } = useEscrowGatewayWithDemo();

  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [freelancerHandle, setFreelancerHandle] = useState("");
  const [milestones, setMilestones] = useState<MilestoneDraft[]>(INITIAL_MILESTONES);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdProject, setCreatedProject] = useState<{ id: string; txRef: string } | null>(null);

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
          funded: false,
        })),
    }),
    [title, clientName, freelancerHandle, milestones]
  );

  const updateMilestone = (index: number, patch: Partial<MilestoneDraft>) => {
    setMilestones((prev) => prev.map((m, i) => (i === index ? { ...m, ...patch } : m)));
    setErrors({});
    setSubmitError(null);
    clearPersistError();
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearPersistError();
    setSubmitError(null);

    const validation = validateNewProjectDraft({ title, clientName, freelancerHandle, milestones });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const projectId = generateProjectId();
      const input = mapDraftToCreateEscrowInput({ title, clientName, freelancerHandle, milestones }, projectId);
      const result = await createDemoEscrow(input);

      if (!result.success) {
        setSubmitError(`${result.error.code}: ${result.error.message}`);
        setSubmitting(false);
        return;
      }

      setCreatedProject({ id: result.data.id, txRef: result.txRef });

      // Navigate after a brief pause so the user sees the success banner
      setTimeout(() => {
        router.push(`/projects/${result.data.id}?created=true&txRef=${result.txRef}`);
      }, 1800);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.3fr]">
      <form
        className="rounded-2xl border border-line bg-white p-6"
        onSubmit={handleSubmit}
      >
        <label className="block">
          <span className="text-[12.5px] font-medium text-ink/70">Project title</span>
          <input
            className={`mt-1.5 w-full ${errors.title ? errorInputClass : inputClass}`}
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors({}); setSubmitError(null); }}
            placeholder="Landing page redesign"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title ? (
            <p id="title-error" className="mt-1 text-[12px] text-red-500">{errors.title}</p>
          ) : null}
        </label>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[12.5px] font-medium text-ink/70">Client</span>
            <input
              className={`mt-1.5 w-full ${errors.clientName ? errorInputClass : inputClass}`}
              value={clientName}
              onChange={(e) => { setClientName(e.target.value); setErrors({}); setSubmitError(null); }}
              placeholder="Nova Studio"
              aria-invalid={!!errors.clientName}
              aria-describedby={errors.clientName ? "client-error" : undefined}
            />
            {errors.clientName ? (
              <p id="client-error" className="mt-1 text-[12px] text-red-500">{errors.clientName}</p>
            ) : null}
          </label>
          <label className="block">
            <span className="text-[12.5px] font-medium text-ink/70">Freelancer handle</span>
            <input
              className={`mt-1.5 w-full ${errors.freelancerHandle ? errorInputClass : inputClass}`}
              value={freelancerHandle}
              onChange={(e) => { setFreelancerHandle(e.target.value); setErrors({}); setSubmitError(null); }}
              placeholder="@jamie.design"
              aria-invalid={!!errors.freelancerHandle}
              aria-describedby={errors.freelancerHandle ? "handle-error" : undefined}
            />
            {errors.freelancerHandle ? (
              <p id="handle-error" className="mt-1 text-[12px] text-red-500">{errors.freelancerHandle}</p>
            ) : null}
          </label>
        </div>

        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/40">
            Milestones
          </p>
          {errors.milestones ? (
            <p className="mt-1 text-[12px] text-red-500">{errors.milestones}</p>
          ) : null}
          <div className="mt-3 space-y-2.5">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <input
                    className={`w-full ${errors.milestoneTitle?.includes(i) ? errorInputClass : inputClass}`}
                    value={m.title}
                    onChange={(e) => updateMilestone(i, { title: e.target.value })}
                    placeholder={`Milestone ${i + 1}`}
                    aria-label={`Milestone ${i + 1} title`}
                    aria-invalid={errors.milestoneTitle?.includes(i)}
                  />
                  {errors.milestoneTitle?.includes(i) ? (
                    <p className="mt-0.5 text-[11px] text-red-500">Milestone title is required</p>
                  ) : null}
                </div>
                <div className="w-28 shrink-0">
                  <input
                    className={`w-full font-mono text-[12.5px] ${errors.milestoneAmount?.includes(i) ? errorInputClass : inputClass}`}
                    value={m.amount}
                    onChange={(e) => updateMilestone(i, { amount: e.target.value })}
                    inputMode="numeric"
                    placeholder="USDC"
                    aria-label={`Milestone ${i + 1} amount in USDC`}
                    aria-invalid={errors.milestoneAmount?.includes(i)}
                  />
                  {errors.milestoneAmount?.includes(i) ? (
                    <p className="mt-0.5 text-[11px] text-red-500">Must be a positive whole USDC amount</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMilestones((prev) => prev.filter((_, idx) => idx !== i));
                    setErrors({});
                    setSubmitError(null);
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
              setErrors({});
              setSubmitError(null);
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand transition-colors hover:text-brand-hover"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add milestone
          </button>
        </div>

        {submitError ? (
          <p role="alert" className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-[12.5px] text-red-700">
            {submitError}
          </p>
        ) : null}

        {lastPersistError ? (
          <p role="alert" className="mt-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-[12.5px] text-amber-800">
            Project created in this session, but could not save to local storage: {lastPersistError}.
            It will be lost on refresh.
          </p>
        ) : null}

        {createdProject ? (
          <div role="status" className="mt-4 rounded-md border border-signal/25 bg-signal/5 px-4 py-3">
            <p className="text-[13px] font-semibold text-signal">Project created successfully</p>
            <p className="mt-1 text-[12.5px] text-ink/70">
              Project ID: <code className="font-mono text-signal">{createdProject.id}</code>
            </p>
            <p className="text-[12.5px] text-ink/70">
              Simulator reference: <code className="font-mono text-signal">{createdProject.txRef}</code>
            </p>
            <p className="mt-1.5 text-[11.5px] text-ink/40">Redirecting to project page…</p>
          </div>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="mt-7 w-full rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? "Creating project…" : "Create project"}
          </button>
        )}
      </form>

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
