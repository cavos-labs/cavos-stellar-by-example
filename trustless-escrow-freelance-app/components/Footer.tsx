import { Wordmark } from "./Wordmark";
import { links } from "@/lib/links";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface px-6 py-14 md:px-16 lg:px-24">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs space-y-4">
          <Wordmark />
          <p className="text-[13px] leading-relaxed text-muted">
            An open-source mock-up of a freelance escrow use case: full Cavos
            onboarding + full Trustless Work escrow flows on Stellar.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div className="space-y-3">
            <h5 className="text-[10px] font-bold uppercase tracking-[0.28em] text-ink/45">
              Stack
            </h5>
            <ul className="space-y-2.5 text-[13px] font-medium text-muted">
              <li><a href={links.cavos} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">Cavos</a></li>
              <li><a href={links.trustlessWork} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">Trustless Work</a></li>
              <li><a href={links.stellar} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">Stellar</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="text-[10px] font-bold uppercase tracking-[0.28em] text-ink/45">
              Build
            </h5>
            <ul className="space-y-2.5 text-[13px] font-medium text-muted">
              <li><a href={links.repo} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">Repository</a></li>
              <li><a href={links.contributing} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">Contributing</a></li>
              <li><a href={links.issues} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">Issues</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="text-[10px] font-bold uppercase tracking-[0.28em] text-ink/45">
              Learn
            </h5>
            <ul className="space-y-2.5 text-[13px] font-medium text-muted">
              <li><a href={links.cavosDocs} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-ink">Cavos docs</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1200px] items-center justify-between border-t border-line pt-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30">
          Mock-up · reference use case · MIT
        </p>
        <p className="font-mono text-[11px] text-ink/30">Not a live product</p>
      </div>
    </footer>
  );
}
