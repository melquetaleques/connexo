import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

const PILLS: { label: string; extra?: ReactNode }[] = [
  { label: "Vínculo" },
  { label: "Prazos" },
  { label: "Laudo", extra: <span style={{ color: "rgb(255, 77, 141)" }}> Novo</span> },
  { label: "Vitrine" },
  { label: "LGPD" },
];

type MagTabsProps = {
  tab: number;
  onTab: (index: number) => void;
};

export function MagTabs({ tab, onTab }: MagTabsProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [ind, setInd] = useState({ x: 0, w: 0 });
  const reduceRef = useRef(false);

  useLayoutEffect(() => {
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      const wrap = wrapRef.current;
      const btn = btnRefs.current[tab];
      if (!wrap || !btn) return;
      setInd({
        x: btn.offsetLeft,
        w: btn.offsetWidth || 0,
      });
    };

    measure();

    const wrap = wrapRef.current;
    const ro = new ResizeObserver(measure);
    if (wrap) ro.observe(wrap);
    btnRefs.current.forEach((btn) => {
      if (btn) ro.observe(btn);
    });

    window.addEventListener("resize", measure);
    const fonts = document.fonts;
    if (fonts?.ready) {
      void fonts.ready.then(measure);
    }

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [tab]);

  return (
    <div
      data-testid="mag-tabs"
      ref={wrapRef}
      role="tablist"
      className="landing-capsule relative inline-flex flex-wrap items-center"
      style={{
        gap: 4,
        padding: 6,
        background: "rgb(255, 255, 255)",
        marginBottom: 40,
      }}
    >
      <span
        aria-hidden="true"
        className="landing-capsule absolute pointer-events-none"
        style={{
          top: 6,
          left: ind.x,
          height: 38,
          background: "rgb(28, 27, 26)",
          width: ind.w,
          transition: reduceRef.current ? "none" : "left 320ms ease, width 320ms ease",
        }}
      />
      {PILLS.map((item, i) => {
        const active = i === tab;
        return (
          <button
            key={item.label}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onTab(i)}
            className="landing-capsule relative z-10 bg-transparent"
            style={{
              padding: "11px 22px",
              font: '600 15px / 1 "Hanken Grotesk", sans-serif',
              color: active ? "rgb(255, 255, 255)" : "rgb(59, 13, 22)",
            }}
          >
            {item.label}
            {item.extra}
          </button>
        );
      })}
    </div>
  );
}
