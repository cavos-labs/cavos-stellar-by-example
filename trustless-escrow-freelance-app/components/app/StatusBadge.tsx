import type { EscrowStatus } from "@/lib/domain/types";
import { ESCROW_STATUS_LABELS } from "@/lib/domain/escrow";

const TONES: Record<EscrowStatus, string> = {
  draft: "bg-white text-ink/60 ring-1 ring-line-strong",
  awaiting_funding: "bg-brand-soft text-brand",
  funded: "bg-brand-soft text-brand",
  partially_released: "bg-signal/10 text-signal",
  released: "bg-signal/10 text-signal",
  cancelled: "bg-ink/5 text-ink/50",
};

export function StatusBadge({ status }: { status: EscrowStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${TONES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {ESCROW_STATUS_LABELS[status]}
    </span>
  );
}
