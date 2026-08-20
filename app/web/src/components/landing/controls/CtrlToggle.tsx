import { useState } from "react";

type CtrlToggleProps = {
  label: string;
  on?: boolean;
  tone?: "dark" | "light";
};

export function CtrlToggle({ label, on = true, tone = "dark" }: CtrlToggleProps) {
  const [checked, setChecked] = useState(on);
  return (
    <button
      type="button"
      data-ctrl="toggle"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => setChecked((v) => !v)}
      className="w-full flex items-center justify-between gap-3 min-h-11"
    >
      <span
        className={`font-ui text-[10px] font-semibold uppercase tracking-[0.12em] text-left ${
          tone === "light" ? "text-on-surface-variant" : "text-white/80"
        }`}
      >
        {label}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full ${
          checked ? "bg-mg-indigo" : tone === "light" ? "bg-outline" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
