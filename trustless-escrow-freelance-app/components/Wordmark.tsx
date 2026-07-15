interface WordmarkProps {
  className?: string;
  markClassName?: string;
  /** Compact label for the header; full name lives in the hero. */
  compact?: boolean;
}

/**
 * Escrow mark + product label. The bracket-and-line glyph reads as
 * "value held on a line" — the escrow idea and Stellar's ledger in one stroke.
 */
export function Wordmark({
  className = "",
  markClassName = "",
  compact = true,
}: WordmarkProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className={`h-6 w-6 shrink-0 text-brand ${markClassName}`}
      >
        <path
          d="M6 4H4v16h2M18 4h2v16h-2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8 12h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="2.4" fill="currentColor" />
      </svg>
      <span className="text-[1.0625rem] font-semibold tracking-[-0.03em] text-ink">
        {compact ? "Escrow Freelance" : "Trustless Escrow Freelance App"}
      </span>
    </span>
  );
}
