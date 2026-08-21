import type { MonthlyActivity } from "@/types";

export function ActivityChart({ data, accent }: { data: MonthlyActivity[]; accent: string }) {
  const max = Math.max(...data.map((d) => Math.max(d.processos, d.laudos)));
  const w = 720;
  const h = 240;
  const pad = 28;
  const xStep = (w - pad * 2) / (data.length - 1);
  const y = (v: number) => h - pad - (v / max) * (h - pad * 2);
  const linePath = (key: "processos" | "laudos") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"} ${pad + i * xStep} ${y(d[key])}`).join(" ");
  const areaPath = `M ${pad} ${h - pad} ${data.map((d, i) => `L ${pad + i * xStep} ${y(d.processos)}`).join(" ")} L ${pad + (data.length - 1) * xStep} ${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-56 w-full" aria-hidden>
      <defs>
        <linearGradient id="activity-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((t, i) => (
        <line
          key={i}
          x1={pad}
          x2={w - pad}
          y1={pad + (h - pad * 2) * t}
          y2={pad + (h - pad * 2) * t}
          stroke="#E4E2DE"
          strokeDasharray="3 4"
        />
      ))}
      <path d={areaPath} fill="url(#activity-gradient)" />
      <path
        d={linePath("processos")}
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d={linePath("laudos")}
        fill="none"
        stroke="#40101E"
        strokeWidth="2"
        strokeDasharray="5 4"
        strokeLinecap="round"
      />
      {data.map((d, i) => (
        <g key={d.m}>
          <circle cx={pad + i * xStep} cy={y(d.processos)} r="4" fill="#fff" stroke={accent} strokeWidth="2" />
          <text
            x={pad + i * xStep}
            y={h - 8}
            textAnchor="middle"
            fontSize="10"
            fill="#141414"
            fontWeight="700"
          >
            {d.m}
          </text>
        </g>
      ))}
    </svg>
  );
}
