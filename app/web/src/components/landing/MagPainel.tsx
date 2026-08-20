import type { ReactNode } from "react";

type MagPainelProps = {
  children: ReactNode;
};

export function MagPainel({ children }: MagPainelProps) {
  return (
    <div
      data-testid="mag-painel"
      className="relative isolate overflow-hidden rounded-[16px] grid lg:grid-cols-2 min-h-[28rem] bg-mg-ink"
    >
      <div className="relative min-h-[16rem] lg:min-h-full overflow-hidden">
        <div className="mag-photo-frame" aria-hidden="true">
          <div
            className="mag-photo mag-ken-burns"
            style={{ backgroundImage: "url(/landing/painel-retrato.jpg)" }}
          />
          <div className="mag-photo-veil mag-photo-veil-ink" />
          <div className="mag-grain" />
        </div>
      </div>
      <div className="relative landing-glass-ink backdrop-blur-xl overflow-hidden text-white">
        <div className="flex items-center gap-2 px-4 min-h-12 border-b border-white/10 bg-mg-ink">
          <span className="w-2.5 h-2.5 rounded-full bg-deny" aria-hidden="true" />
          <span className="w-2.5 h-2.5 rounded-full bg-mg-warm" aria-hidden="true" />
          <span className="w-2.5 h-2.5 rounded-full bg-ledger" aria-hidden="true" />
          <p className="ml-3 font-ui text-xs text-white truncate">connexo.app · expediente</p>
        </div>
        <div className="grid sm:grid-cols-[132px_1fr]">
          <aside className="hidden sm:flex flex-col gap-2 p-4 border-r border-white/10 bg-mg-ink font-ui text-xs text-white">
            <p className="font-semibold text-white">Processo</p>
            <p>Catálogo</p>
            <p>Consentimento</p>
            <p>Timeline</p>
            <p>Laudo</p>
          </aside>
          <div className="min-w-0 p-3 sm:p-4 bg-white text-mg-ink">{children}</div>
        </div>
      </div>
    </div>
  );
}
