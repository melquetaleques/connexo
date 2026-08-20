import type { ReactNode } from "react";
import { MagBotao } from "./MagBotao";

type MagFechoProps = {
  children?: ReactNode;
};

export function MagFecho({ children }: MagFechoProps) {
  return (
    <section data-testid="mag-fecho" className="relative overflow-hidden text-white py-28 bg-mg-ink">
      <div className="mag-photo-frame" aria-hidden="true">
        <div
          className="mag-photo mag-ken-burns mag-ken-burns-rev"
          style={{ backgroundImage: "url(/landing/fecho-campo.jpg)" }}
        />
      </div>
      <div className="mag-field mag-veil landing-field-fecho" aria-hidden="true">
        <div className="mag-grain" aria-hidden="true" />
      </div>
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <p className="landing-fecho-title font-display mb-8 text-white">Entre no expediente.</p>
        <MagBotao href="#landing-personas">Escolher meu papel</MagBotao>
        {children}
      </div>
    </section>
  );
}
