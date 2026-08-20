import {
  GlyphCatalogo,
  GlyphConsentimento,
  GlyphLaudo,
  GlyphPrazo,
  GlyphProcesso,
  GlyphVitrine,
  IconChip,
} from "@/components/ui/connexo-icons";
import { MagBotao } from "./MagBotao";

const FEATURES = [
  {
    icon: (
      <IconChip tint="lavender">
        <GlyphCatalogo />
      </IconChip>
    ),
    text: "CRC visível no catálogo",
  },
  {
    icon: (
      <IconChip tint="mint">
        <GlyphConsentimento />
      </IconChip>
    ),
    text: "Consentimento LGPD por documento",
  },
  {
    icon: (
      <IconChip tint="peach">
        <GlyphProcesso />
      </IconChip>
    ),
    text: "Honorários do perito separados",
  },
  {
    icon: (
      <IconChip tint="sand">
        <GlyphPrazo />
      </IconChip>
    ),
    text: "Timeline com hora e responsável",
  },
  {
    icon: (
      <IconChip tint="sky">
        <GlyphLaudo />
      </IconChip>
    ),
    text: "Laudo versionado no processo",
  },
  {
    icon: (
      <IconChip tint="rose">
        <GlyphVitrine />
      </IconChip>
    ),
    text: "Vitrine pública com slug próprio",
  },
];

export function MagPlanos() {
  return (
    <section id="planos" data-testid="mag-planos" className="bg-mg-ink text-white py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <h2 className="font-display font-semibold tracking-tight text-[2rem] mb-8">
          Dois caminhos, o mesmo rito
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-8">
          <article className="landing-glass backdrop-blur-xl rounded-[16px] p-5 sm:p-8 flex flex-col">
            <p className="font-ui text-xs uppercase tracking-wide text-white mb-3">Advogado</p>
            <h3 className="font-display font-semibold text-xl tracking-tight mb-3">
              Sustentar a tese com número
            </h3>
            <p className="font-ui text-sm text-white mb-6">
              Cadastra o processo, escolhe o perito no catálogo e revisa o laudo no expediente.
            </p>
            <div className="mt-auto">
              <MagBotao to="/register?role=advogado" className="w-full sm:w-auto">
                Cadastrar escritório
              </MagBotao>
            </div>
          </article>
          <article className="rounded-[16px] bg-mg-ivory text-mg-ink p-5 sm:p-8 flex flex-col">
            <p className="font-ui text-xs uppercase tracking-wide mb-3">Contador</p>
            <h3 className="font-display font-semibold text-xl tracking-tight mb-3">
              Assinar o laudo à vista
            </h3>
            <p className="font-ui text-sm text-on-surface-variant mb-6">
              Abre a vitrine, recebe a fila com CRC visível e entrega a versão no mesmo processo.
            </p>
            <div className="mt-auto">
              <MagBotao to="/register?role=contador" className="w-full sm:w-auto">
                Criar perfil público
              </MagBotao>
            </div>
          </article>
        </div>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {FEATURES.map((f) => (
            <li
              key={f.text}
              className="rounded-[16px] border border-white/10 bg-mg-ink p-4 flex items-center gap-3"
            >
              <span className="shrink-0">{f.icon}</span>
              <span className="font-ui text-sm font-medium text-white">{f.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
