"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/Wordmark";
import { useCavosSession } from "@/lib/cavos/session";
import { resolveCavosConfig } from "@/lib/cavos";

const NAV = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "New project", href: "/projects/new" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    // Project detail pages are reached from the dashboard, so keep it lit.
    return (
      pathname === "/dashboard" ||
      (pathname.startsWith("/projects/") && pathname !== "/projects/new")
    );
  }
  return pathname === href;
}

function StatusBadge() {
  const { session } = useCavosSession();
  const cfg = resolveCavosConfig();

  if (session.status === "connected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/20 bg-signal/5 px-2.5 py-0.5 font-mono text-[11px] text-signal">
        <span className="h-1.5 w-1.5 rounded-full bg-signal" />
        {session.address}
      </span>
    );
  }

  if (session.status === "connecting") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-soft px-2.5 py-0.5 font-mono text-[11px] text-brand">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
        Connecting…
      </span>
    );
  }

  if (cfg.mode === "demo") {
    return (
      <span className="rounded-full border border-brand/20 bg-brand-soft px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-brand">
        Mock data
      </span>
    );
  }

  return (
    <span className="rounded-full border border-ink/10 bg-white px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">
      Disconnected
    </span>
  );
}

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[1100px] items-center justify-between gap-6 px-6 md:px-10">
        <div className="flex items-center gap-6">
          <Link href="/" className="shrink-0 transition-opacity hover:opacity-70">
            <Wordmark />
          </Link>
          <nav className="flex items-center gap-5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(pathname, item.href)
                    ? "text-ink"
                    : "text-ink/50 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <StatusBadge />
      </div>
    </header>
  );
}
