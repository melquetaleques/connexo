import { useState } from "react";

type CtrlSelectProps = {
  label: string;
  value: string;
  options: string[];
  tone?: "dark" | "light";
};

export function CtrlSelect({ label, value, options, tone = "dark" }: CtrlSelectProps) {
  const [current, setCurrent] = useState(value);
  const light = tone === "light";
  return (
    <label data-ctrl="select" className="block w-full">
      <span
        className={`font-ui text-[10px] font-semibold uppercase tracking-[0.12em] ${
          light ? "text-on-surface-variant" : "text-white/80"
        }`}
      >
        {label}
      </span>
      <span className="relative mt-1.5 flex items-center">
        <select
          value={current}
          aria-label={label}
          onChange={(e) => setCurrent(e.target.value)}
          className={`w-full appearance-none rounded-xl font-ui text-sm font-semibold min-h-11 px-3 pr-10 ${
            light
              ? "bg-white border border-outline text-ivory-ink"
              : "bg-white/10 border border-white/20 text-paper"
          }`}
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-void-card text-paper">
              {opt}
            </option>
          ))}
        </select>
        <svg
          className={`pointer-events-none absolute right-3 ${light ? "text-ivory-ink" : "text-paper"}`}
          width="14"
          height="14"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M3.2 5.6 8 10.4l4.8-4.8 1.2 1.2L8 12.8 2 6.8z"
          />
        </svg>
      </span>
    </label>
  );
}
