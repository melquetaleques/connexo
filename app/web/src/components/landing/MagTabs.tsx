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
  const baseW = useRef(1);
  const [ind, setInd] = useState({ x: 0, s: 1 });
  const reduceRef = useRef(false);

  useLayoutEffect(() => {
    reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wrap = wrapRef.current;
    const btn = btnRefs.current[tab];
    if (!wrap || !btn) return;
    if (baseW.current <= 1) baseW.current = btn.offsetWidth || 1;
    setInd({
      x: btn.offsetLeft,
      s: (btn.offsetWidth || 1) / baseW.current,
    });
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
          left: 0,
          height: 38,
          background: "rgb(28, 27, 26)",
          width: baseW.current,
          transform: `translateX(${ind.x}px) scaleX(${ind.s})`,
          transformOrigin: "left center",
          transition: reduceRef.current ? "none" : "transform 320ms ease",
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
