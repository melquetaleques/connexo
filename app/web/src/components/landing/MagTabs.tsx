import { useLayoutEffect, useRef, useState } from "react";

const PILLS = ["Catálogo", "Consentimento", "Timeline"];

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
      className="relative inline-flex flex-wrap gap-2 p-1"
    >
      <span
        aria-hidden="true"
        className="absolute top-1 left-0 h-11 rounded-full bg-mg-ink pointer-events-none"
        style={{
          width: baseW.current,
          transform: `translateX(${ind.x}px) scaleX(${ind.s})`,
          transformOrigin: "left center",
          transition: reduceRef.current ? "none" : "transform 320ms ease",
        }}
      />
      {PILLS.map((label, i) => {
        const active = i === tab;
        return (
          <button
            key={label}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onTab(i)}
            className={`landing-pill relative z-10 min-h-11 px-5 font-ui text-sm font-semibold tracking-tight bg-transparent ${
              active ? "text-white" : "text-mg-ink"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
