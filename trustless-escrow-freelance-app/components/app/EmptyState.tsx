import Link from "next/link";

interface EmptyStateProps {
  title: string;
  body: string;
  action?: { href: string; label: string };
}

/** Deliberate empty / error surface for app-shell routes. */
export function EmptyState({ title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line-strong bg-white px-6 py-16 text-center">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-surface text-ink/30 ring-1 ring-line-strong">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <h2 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h2>
      <p className="max-w-[42ch] text-[13px] leading-relaxed text-muted">{body}</p>
      {action ? (
        <Link
          href={action.href}
          className="mt-2 inline-flex items-center rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
