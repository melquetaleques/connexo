import { useEffect, useRef, useState } from "react";

const CAPS = [
  {
    title: "Catálogo com CRC",
    line: "Perito verificado, especialidade e janela.",
  },
  {
    title: "Consentimento LGPD",
    line: "Documento a documento, com o dono no meio.",
  },
  {
    title: "Timeline do rito",
    line: "Pedido, autorização, laudo e revisão à vista.",
  },
  {
    title: "Laudo versionado",
    line: "Arquivo no processo, ajuste protocolado.",
  },
  {
    title: "Vitrine pública",
    line: "Slug próprio, serviços e avaliações.",
  },
];

export function MagHeroLista() {
  const [active, setActive] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;
    const id = window.setInterval(() => {
      if (!paused.current) {
        setActive((i) => (i + 1) % CAPS.length);
      }
    }, 1300);
    return () => window.clearInterval(id);
  }, []);

  const pause = () => {
    paused.current = true;
  };
  const resume = () => {
    paused.current = false;
  };

  return (
    <ul
      data-testid="mag-hero-lista"
      className="space-y-2"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) resume();
      }}
    >
      {CAPS.map((item, i) => {
        const isActive = i === active;
        return (
          <li
            key={item.title}
            tabIndex={0}
            aria-current={isActive ? "true" : undefined}
            onFocus={() => {
              pause();
              setActive(i);
            }}
            className="landing-glass-ink backdrop-blur-xl flex items-center gap-3 rounded-[16px] px-4 py-3 text-white"
            style={{
              transition: "box-shadow 450ms ease",
              boxShadow: isActive ? "inset 0 0 0 1px rgb(80 96 224 / 0.7)" : "none",
            }}
          >
            <span
              className="w-3 shrink-0 font-ui text-xs text-mg-magenta"
              aria-hidden="true"
              style={{
                opacity: isActive ? 1 : 0,
                transition: "opacity 450ms ease",
              }}
            >
              ▶
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-ui text-sm font-semibold tracking-tight text-white">{item.title}</p>
              <p className="font-ui text-xs mt-0.5 text-white">{item.line}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
