import { useEffect, useRef, useState } from "react";

const CAPS = [
  { title: "Cadastrar o perito", indent: false },
  { title: "Vincular com base legal", indent: false },
  { title: "Controlar prazos", indent: false },
  { title: "Redigir o laudo", indent: false },
  { title: "Responder quesitos", indent: true },
  { title: "Assinar e entregar", indent: true },
  { title: "Publicar a vitrine", indent: true, dim: true },
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
              display: "flex",
              alignItems: "center",
              gap: isActive ? 14 : 0,
              font: "800 30px / 1.35 Figtree, sans-serif",
              letterSpacing: "-0.02em",
              color: isActive ? "rgb(255, 255, 255)" : idleColor,
              paddingLeft: !isActive && item.indent ? 33 : 0,
              background: "transparent",
              transition: "opacity 450ms ease, color 450ms ease, padding-left 450ms ease",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                color: "rgb(255, 77, 141)",
                fontSize: 19,
                width: isActive ? "auto" : 0,
                overflow: "hidden",
                opacity: isActive ? 1 : 0,
              }}
            >
              ▶
            </span>
            <p className="min-w-0" style={{ margin: 0 }}>
              {item.title}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
