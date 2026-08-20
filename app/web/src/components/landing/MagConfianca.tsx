import {
  GlyphCatalogo,
  GlyphConsentimento,
  GlyphLaudo,
  GlyphProcesso,
  IconChip,
} from "@/components/ui/connexo-icons";

const CREDENCIAIS = [
  {
    icon: (
      <IconChip tint="lavender">
        <GlyphCatalogo />
      </IconChip>
    ),
    title: "CRC verificado",
    line: "Perito no catálogo com registro à vista.",
  },
  {
    icon: (
      <IconChip tint="mint">
        <GlyphConsentimento />
      </IconChip>
    ),
    title: "Consentimento LGPD",
    line: "Documento a documento, com o dono.",
  },
  {
    icon: (
      <IconChip tint="peach">
        <GlyphProcesso />
      </IconChip>
    ),
    title: "Ética OAB",
    line: "Honorários do perito separados da tese.",
  },
  {
    icon: (
      <IconChip tint="sky">
        <GlyphLaudo />
      </IconChip>
    ),
    title: "Laudo versionado",
    line: "Arquivo no processo, ajuste protocolado.",
  },
];

export function MagConfianca() {
  return (
    <section data-testid="mag-confianca" className="bg-mg-ivory text-mg-ink">
      <ul className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-2 lg:grid-cols-4 gap-3 py-8">
        {CREDENCIAIS.map((item) => (
          <li
            key={item.title}
            className="landing-glass-light backdrop-blur-xl rounded-[16px] p-4 flex items-start gap-3"
          >
            <span className="shrink-0">{item.icon}</span>
            <div className="min-w-0">
              <p className="font-ui text-sm font-semibold tracking-tight">{item.title}</p>
              <p className="font-ui text-xs text-on-surface-variant mt-1">{item.line}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
