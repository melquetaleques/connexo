import { useRef, useState } from "react";
import {
  GlyphCatalogo,
  GlyphConsentimento,
  GlyphLaudo,
  GlyphPrazo,
  GlyphProcesso,
  GlyphVitrine,
  IconChip,
} from "@/components/ui/connexo-icons";

const FILTERS = ["Tudo", "Processo", "LGPD", "Laudo", "Vitrine"];

const TOOLS = [
  {
    icon: (
      <IconChip tint="peach">
        <GlyphProcesso />
      </IconChip>
    ),
    title: "Cadastro de processo",
    line: "CNJ, vara e escopo da perícia.",
  },
  {
    icon: (
      <IconChip tint="mint">
        <GlyphConsentimento />
      </IconChip>
    ),
    title: "Consentimento",
    line: "LGPD por arquivo, com dono.",
  },
  {
    icon: (
      <IconChip tint="lavender">
        <GlyphCatalogo />
      </IconChip>
    ),
    title: "Catálogo CRC",
    line: "Perito verificado e disponível.",
  },
  {
    icon: (
      <IconChip tint="sky">
        <GlyphLaudo />
      </IconChip>
    ),
    title: "Laudo versionado",
    line: "Arquivo assinado no rito.",
  },
  {
    icon: (
      <IconChip tint="sand">
        <GlyphPrazo />
      </IconChip>
    ),
    title: "Pedido de ajuste",
    line: "Cláusula no mesmo expediente.",
  },
  {
    icon: (
      <IconChip tint="rose">
        <GlyphVitrine />
      </IconChip>
    ),
    title: "Vitrine pública",
    line: "Slug, serviços e avaliações.",
  },
];

export function MagFerramentas() {
  const scroller = useRef<HTMLUListElement>(null);
  const [filter, setFilter] = useState(0);

  const go = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = 12;
    const w = card ? card.getBoundingClientRect().width + gap : 232;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * w, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-mg-ivory text-mg-ink py-20">
      <div className="mag-field mag-field-ivory pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="mag-grain" aria-hidden="true" />
      </div>
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between gap-3 mb-6">
          <h2 className="font-display font-semibold tracking-tight text-[2rem] text-mg-vinho">
            Ferramentas do expediente
          </h2>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              aria-label="Ferramenta anterior"
              onClick={() => go(-1)}
              className="w-11 h-11 rounded-full border border-outline bg-white font-ui text-lg"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Próxima ferramenta"
              onClick={() => go(1)}
              className="w-11 h-11 rounded-full border border-outline bg-white font-ui text-lg"
            >
              ›
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setFilter(i)}
              className={`landing-pill min-h-9 px-4 font-ui text-xs font-semibold ${
                i === filter
                  ? "bg-mg-ink text-white"
                  : "bg-white text-mg-ink border border-outline"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <ul
          data-testid="mag-ferramentas"
          ref={scroller}
          className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
        >
          {TOOLS.map((t) => (
            <li
              key={t.title}
              className="w-[220px] shrink-0 snap-start rounded-[16px] bg-white/80 backdrop-blur-xl border border-outline p-5 flex flex-col gap-3"
            >
              {t.icon}
              <p className="font-ui text-sm font-semibold tracking-tight text-mg-ink">{t.title}</p>
              <p className="font-ui text-xs font-medium text-mg-ink">{t.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
