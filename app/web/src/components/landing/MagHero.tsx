import { MagBotao } from "./MagBotao";

export function MagHero() {
  return (
    <div data-testid="mag-hero">
      <span className="landing-pill landing-glass-soft backdrop-blur-xl inline-flex items-center min-h-8 px-3 mb-6 font-ui text-xs font-semibold text-white">
        Expediente com CRC à vista
      </span>
      <h1 className="landing-hero-title font-display text-white mb-6">
        O laudo que a tese precisa.
        <br />
        O cliente no meio.
      </h1>
      <p className="font-ui text-base text-white mb-8 max-w-xl">
        Advogado pede o número, cliente autoriza o dado, contador assina o laudo.
      </p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <MagBotao href="#landing-personas" variant="light">
          Escolher meu papel
        </MagBotao>
        <MagBotao to="/login" variant="ghost" className="text-white">
          Já tenho conta
        </MagBotao>
      </div>
    </div>
  );
}
