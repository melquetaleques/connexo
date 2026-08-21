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
import { MockCatalogo } from "./MockCatalogo";
import { MockConsentimento } from "./MockConsentimento";

const FEATURES = [
  {
    icon: (
      <IconChip tint="lavender">
        <GlyphCatalogo />
      </IconChip>
    ),
    title: "CRC visível",
    text: "Todo perito verificado no catálogo, antes de aceitar o processo.",
  },
  {
    icon: (
      <IconChip tint="mint">
        <GlyphConsentimento />
      </IconChip>
    ),
    title: "Consentimento por documento",
    text: "LGPD arquivo a arquivo, com dono e data de autorização.",
  },
  {
    icon: (
      <IconChip tint="peach">
        <GlyphProcesso />
      </IconChip>
    ),
    title: "Honorários separados",
    text: "O perito cobra o laudo. O escritório cobra a tese. Sem mistura.",
  },
  {
    icon: (
      <IconChip tint="sand">
        <GlyphPrazo />
      </IconChip>
    ),
    title: "Timeline com responsável",
    text: "Cada etapa com hora, papel e quem assinou embaixo.",
  },
  {
    icon: (
      <IconChip tint="sky">
        <GlyphLaudo />
      </IconChip>
    ),
    title: "Laudo versionado",
    text: "Toda revisão fica registrada no mesmo processo, sem sobrescrever.",
  },
  {
    icon: (
      <IconChip tint="rose">
        <GlyphVitrine />
      </IconChip>
    ),
    title: "Vitrine pública",
    text: "Perfil próprio com slug, avaliações e fila de processos recebidos.",
  },
];

function PreviewCard({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mag-field mag-field-ink border border-white/10 rounded-[16px] p-6 sm:p-8 flex flex-col">
      <h3 className="font-display font-semibold text-xl tracking-tight mb-3 text-white">{title}</h3>
      <p className="font-ui text-sm text-white/60 mb-6 max-w-md">{desc}</p>
      <div className="relative mt-auto h-64 overflow-hidden rounded-[16px] border border-white/10">
        <div className="origin-top-left scale-[0.58] w-[172%] pointer-events-none">{children}</div>
      </div>
    </article>
  );
}

export function MagPlanos() {
  return (
    <section
      id="planos"
      data-testid="mag-planos"
      className="mag-field mag-field-ink relative overflow-hidden text-white py-24"
    >
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <h2 className="font-display font-semibold tracking-tight text-[2.75rem] leading-[1.05] mb-14 max-w-xl">
          Dois caminhos, o mesmo rito
        </h2>

        <div className="grid sm:grid-cols-2 gap-10 mb-16">
          <div>
            <h3 className="font-display font-semibold text-xl tracking-tight mb-3">Advogado</h3>
            <p className="font-ui text-sm text-white/60 mb-6 max-w-sm">
              Cadastra o processo, escolhe o perito no catálogo e revisa o laudo no expediente.
            </p>
            <MagBotao to="/register?role=advogado" variant="light">
              Cadastrar escritório
            </MagBotao>
          </div>
          <div>
            <h3 className="font-display font-semibold text-xl tracking-tight mb-3">Contador</h3>
            <p className="font-ui text-sm text-white/60 mb-6 max-w-sm">
              Abre a vitrine, recebe a fila com CRC visível e entrega a versão no mesmo processo.
            </p>
            <MagBotao to="/register?role=contador" variant="light">
              Criar perfil público
            </MagBotao>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <PreviewCard
            title="Catálogo com CRC verificado"
            desc="O advogado escolhe o perito pelo registro, disponibilidade e nota — não por indicação."
          >
            <MockCatalogo />
          </PreviewCard>
          <PreviewCard
            title="Consentimento documento a documento"
            desc="O cliente autoriza cada arquivo. Sem o sim, o perito não lê."
          >
            <MockConsentimento />
          </PreviewCard>
        </div>

        <div className="mag-field mag-field-ink border border-white/10 rounded-[16px] p-6 sm:p-10">
          <h3 className="font-display font-semibold text-xl tracking-tight mb-2">O que o rito segura</h3>
          <p className="font-ui text-sm text-white/60 mb-8">
            Regras que valem para advogado, cliente e contador, sempre no mesmo processo.
          </p>
          <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <span className="shrink-0">{f.icon}</span>
                <div>
                  <p className="font-ui text-sm font-semibold text-white mb-1">{f.title}</p>
                  <p className="font-ui text-xs text-white/55 leading-relaxed">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
