import type { Metadata } from "next";
import { NewProjectForm } from "@/components/app/NewProjectForm";

export const metadata: Metadata = {
  title: "New project | Trustless Escrow Freelance App",
};

export default function NewProjectPage() {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
        New project
      </p>
      <h1 className="mt-2 text-[1.75rem] font-semibold tracking-[-0.03em] text-ink">
        Draft an escrow contract
      </h1>
      <p className="mt-1 max-w-[60ch] text-[13.5px] text-muted">
        Define the parties and milestones, and preview the contract exactly as it
        will render once funded. Creation is simulated — no data is persisted yet.
      </p>
      <div className="mt-8">
        <NewProjectForm />
      </div>
    </div>
  );
}
