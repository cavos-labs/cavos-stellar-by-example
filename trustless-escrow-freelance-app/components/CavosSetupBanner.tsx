"use client";

import { links } from "@/lib/links";
import { maskAppId, resolveCavosConfig } from "@/lib/cavos";

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16v-5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12l5 5L20 6" />
    </svg>
  );
}

/**
 * In-app setup state for the Cavos App ID. NEXT_PUBLIC_* variables are
 * inlined at build time, so this renders correctly on both server and
 * client without a loading flash.
 */
export function CavosSetupBanner() {
  const config = resolveCavosConfig();

  if (config.mode === "configured" && config.appId) {
    return (
      <div
        role="status"
        className="flex flex-wrap items-center gap-2.5 rounded-xl border border-signal/25 bg-signal/5 px-4 py-3 text-[13px] text-ink/80"
      >
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-signal/10 text-signal ring-1 ring-signal/25">
          <CheckIcon />
        </span>
        <p>
          <span className="font-medium text-ink">Cavos App ID configured</span>{" "}
          <span className="font-mono text-[12.5px] text-ink/60">
            ({maskAppId(config.appId)} · {config.network})
          </span>
          — this preview still shows mock data; live Cavos wiring is a
          follow-up.
        </p>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="flex flex-wrap items-start gap-2.5 rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-[13px] text-ink/80"
    >
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-brand ring-1 ring-brand/25">
        <InfoIcon />
      </span>
      <p className="min-w-0 flex-1">
        <span className="font-medium text-ink">
          Demo mode — no Cavos App ID configured.
        </span>{" "}
        You&rsquo;re seeing mock data on the{" "}
        <span className="font-mono text-[12.5px] text-ink/60">
          {config.network}
        </span>{" "}
        network config. This is expected on a fresh clone.{" "}
        <a
          href={links.cavosAppIdSetup}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
        >
          Get a Cavos App ID
        </a>{" "}
        and set <code className="font-mono text-[12px]">NEXT_PUBLIC_CAVOS_APP_ID</code> in{" "}
        <code className="font-mono text-[12px]">.env.local</code> to switch out
        of demo mode.
      </p>
    </div>
  );
}
