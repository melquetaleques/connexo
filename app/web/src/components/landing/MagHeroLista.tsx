import { useEffect, useRef, useState } from "react";

const CAPS = [
  { title: "Catálogo com CRC" },
  { title: "Consentimento LGPD" },
  { title: "Timeline do rito" },
  { title: "Laudo versionado" },
  { title: "Vitrine pública" },
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
            className="flex items-center gap-3 py-1.5 text-white bg-transparent font-ui font-normal tracking-tight text-[1.65rem] leading-tight"
            style={{
              opacity: isActive ? 1 : 0.45,
              transition: "opacity 450ms ease",
            }}
          >
            <span
              className="w-4 shrink-0 font-ui text-lg text-mg-magenta"
              aria-hidden="true"
              style={{
                opacity: isActive ? 1 : 0,
                transition: "opacity 450ms ease",
              }}
            >
              ▶
            </span>
            <p className="min-w-0 text-white">{item.title}</p>
          </li>
        );
      })}
    </ul>
  );
}
