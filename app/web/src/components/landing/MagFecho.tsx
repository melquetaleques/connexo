import type { ReactNode } from "react";
import { MagBotao } from "./MagBotao";

type MagFechoProps = {
  children?: ReactNode;
};

export function MagFecho({ children }: MagFechoProps) {
  return (
    <section data-testid="mag-fecho" className="relative overflow-hidden text-white py-24 bg-mg-ink">
      <div className="landing-field-fecho absolute inset-0" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <p className="landing-fecho-title font-display mb-8 text-white">Entre no expediente.</p>
        <MagBotao href="#landing-personas">Escolher meu papel</MagBotao>
        {children}
      </div>
    </section>
  );
}
