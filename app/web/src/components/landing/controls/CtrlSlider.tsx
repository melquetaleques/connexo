import { useState } from "react";

type CtrlSliderProps = {
  label: string;
  value?: number;
  tone?: "dark" | "light";
};

export function CtrlSlider({ label, value = 62, tone = "dark" }: CtrlSliderProps) {
  const [current, setCurrent] = useState(value);
  return (
    <div data-ctrl="slider" className="w-full">
      <p
        className={`font-ui text-[10px] font-semibold uppercase tracking-[0.12em] mb-2 ${
          tone === "light" ? "text-mg-ink" : "text-white"
        }`}
      >
        {label}
        <span
          className={`ml-2 normal-case tracking-normal ${
            tone === "light" ? "text-ivory-ink" : "text-paper"
          }`}
        >
          {current}%
        </span>
      </p>
      <input
        type="range"
        min={0}
        max={100}
        value={current}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={current}
        onChange={(e) => setCurrent(Number(e.target.value))}
        className={`ctrl-slider w-full ${tone === "light" ? "ctrl-slider-light" : ""}`}
        style={{ ["--ctrl-pct" as string]: `${current}%` }}
      />
    </div>
  );
}
