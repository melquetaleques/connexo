import { useEffect, useRef, useState } from "react";

const CAPS = [
  { title: "Cadastrar o perito" },
  { title: "Vincular com base legal" },
  { title: "Controlar prazos" },
  { title: "Redigir o laudo" },
  { title: "Responder quesitos" },
  { title: "Assinar e entregar" },
  { title: "Publicar a vitrine", dim: true },
];

const MARKER_GUTTER = 33;

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
      style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 80, listStyle: "none", margin: 0 }}
      className="max-lg:!pl-0"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) resume();
      }}
    >
      {CAPS.map((item, i) => {
        const isActive = i === active;
        const idleColor = item.dim ? "rgba(255, 255, 255, 0.14)" : "rgba(255, 255, 255, 0.24)";
        // 01-landing-dom-body.html: o ▶ fica fixo na calha (x = borda da lista) e o
        // recuo de 33px acompanha o item ativo — os anteriores ficam rentes, o ativo
        // e os seguintes recuam. Medido no modelo: marcador 733, texto rente 733,
        // texto recuado 766.
        const indented = i >= active;
        return (
          <li
            key={item.title}
            tabIndex={0}
            aria-current={isActive ? "true" : undefined}
            onFocus={() => {
              pause();
              setActive(i);
            }}
            style={{
              position: "relative",
              display: "block",
              font: "800 30px / 1.35 Figtree, sans-serif",
              letterSpacing: "-0.02em",
              color: isActive ? "rgb(255, 255, 255)" : idleColor,
              paddingLeft: indented ? MARKER_GUTTER : 0,
              background: "transparent",
              transition: "color 450ms ease, opacity 450ms ease, padding-left 450ms ease",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                width: MARKER_GUTTER,
                color: "rgb(255, 77, 141)",
                fontSize: 19,
                lineHeight: 1,
                opacity: isActive ? 1 : 0,
                pointerEvents: "none",
                transition: "opacity 450ms ease",
              }}
            >
              ▶
            </span>
            <p className="min-w-0" data-hero-item-text="" style={{ margin: 0 }}>
              {item.title}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
