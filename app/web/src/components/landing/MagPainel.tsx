import type { ReactNode } from "react";

type MagPainelProps = {
  children: ReactNode;
};

export function MagPainel({ children }: MagPainelProps) {
  return (
    <div
      data-testid="mag-painel"
      className="landing-glass-ink backdrop-blur-xl rounded-[16px] overflow-hidden text-white"
    >
      <div className="flex items-center gap-2 px-4 min-h-12 border-b border-white/10 bg-mg-ink">
        <span className="w-2.5 h-2.5 rounded-full bg-deny" aria-hidden="true" />
        <span className="w-2.5 h-2.5 rounded-full bg-mg-warm" aria-hidden="true" />
        <span className="w-2.5 h-2.5 rounded-full bg-ledger" aria-hidden="true" />
        <p className="ml-3 font-ui text-xs text-white/80 truncate">connexo.app · expediente</p>
      </div>
      <div className="grid sm:grid-cols-[132px_1fr]">
        <aside className="hidden sm:flex flex-col gap-2 p-4 border-r border-white/10 bg-mg-ink font-ui text-xs text-white/80">
          <p className="font-semibold text-white">Processo</p>
          <p>Catálogo</p>
          <p>Consentimento</p>
          <p>Timeline</p>
          <p>Laudo</p>
        </aside>
        <div className="min-w-0 p-3 sm:p-4 bg-white text-mg-ink">{children}</div>
      </div>
    </div>
  );
}
