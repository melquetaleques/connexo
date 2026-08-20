import type { ReactNode } from "react";
import { MagBotao } from "./MagBotao";

type MagBentoProps = {
  children?: ReactNode;
};

export function MagBento({ children }: MagBentoProps) {
  return (
    <section data-testid="mag-bento" className="relative overflow-hidden bg-mg-ivory text-mg-ink py-20">
      <div className="mag-field mag-veil mag-field-ivory" aria-hidden="true">
        <div className="mag-grain" aria-hidden="true" />
      </div>
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <h2 className="mag-title-vinho font-display font-semibold tracking-tight text-[2rem] text-mg-vinho">
            Três papéis, o mesmo processo
          </h2>
          <MagBotao href="#landing-personas">Escolher meu papel</MagBotao>
        </div>
        <div className="landing-stagger">{children}</div>
      </div>
    </section>
  );
}
