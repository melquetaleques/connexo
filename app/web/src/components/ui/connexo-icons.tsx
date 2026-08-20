import type { ReactNode } from "react";

type DuotoneIconProps = {
  className?: string;
};

const CHIP_TINTS = {
  lavender: { bg: "#E4D9F8", fg: "#5B21B6" },
  mint: { bg: "#CFF5E4", fg: "#047857" },
  peach: { bg: "#FFDCC8", fg: "#C2410C" },
  sky: { bg: "#D4E5FF", fg: "#1D4ED8" },
  rose: { bg: "#F8D0E0", fg: "#BE185D" },
  sand: { bg: "#FDE68A", fg: "#B45309" },
} as const;

export type IconChipTint = keyof typeof CHIP_TINTS;

export function IconChip({ tint, children }: { tint: IconChipTint; children: ReactNode }) {
  const t = CHIP_TINTS[tint];
  return (
    <span
      data-icon-chip="true"
      className="inline-flex items-center justify-center shrink-0"
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: t.bg,
        color: t.fg,
      }}
    >
      {children}
    </span>
  );
}

function GlyphFrame({ children }: { children: ReactNode }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      {children}
    </svg>
  );
}

export function GlyphCatalogo() {
  return (
    <GlyphFrame>
      <path
        fill="currentColor"
        opacity="0.22"
        d="M6 3.5h9.2L19.5 8v12.5H6V3.5z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        d="M15.2 3.5V8H19.5"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        d="M9 12.2h8M9 15.6h5.5M9 8.8h3"
      />
    </GlyphFrame>
  );
}

export function GlyphConsentimento() {
  return (
    <GlyphFrame>
      <path
        fill="currentColor"
        opacity="0.22"
        d="M12 3.2 19.4 6.2v5.4c0 4.4-3.1 7.4-7.4 9.2-4.3-1.8-7.4-4.8-7.4-9.2V6.2L12 3.2z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        d="M12 3.2 19.4 6.2v5.4c0 4.4-3.1 7.4-7.4 9.2-4.3-1.8-7.4-4.8-7.4-9.2V6.2L12 3.2z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.2 12.2 11.1 14l3.8-4.2"
      />
    </GlyphFrame>
  );
}

export function GlyphLaudo() {
  return (
    <GlyphFrame>
      <path
        fill="currentColor"
        opacity="0.22"
        d="M5.5 3.5h10.2L19 7.2V20.5H5.5V3.5z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        d="M15.6 3.5v3.8H19"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        d="M8 11h8M8 14.2h5"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        d="M8.2 18.2c1.4-2.2 3.6-2.4 5.2-.4 1.2 1.4 2.6 1.6 3.8.2"
      />
    </GlyphFrame>
  );
}

export function GlyphVitrine() {
  return (
    <GlyphFrame>
      <path fill="currentColor" opacity="0.22" d="M4 9.2h16V20H4V9.2z" />
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        d="M4 9.2h16V20H4V9.2zM4 5.2h16v4H4z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        d="M9 13.2h2.8V20M14.2 13.2H17V20"
      />
    </GlyphFrame>
  );
}

export function GlyphPrazo() {
  return (
    <GlyphFrame>
      <circle cx="12" cy="13" r="7.2" fill="currentColor" opacity="0.22" />
      <circle
        cx="12"
        cy="13"
        r="7.2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        d="M12 13V9.4M12 13l3.2 2.2M9 4.6h6"
      />
    </GlyphFrame>
  );
}

export function GlyphProcesso() {
  return (
    <GlyphFrame>
      <path
        fill="currentColor"
        opacity="0.22"
        d="M7 4.2h10v4.2l-2.2 2.2v3.2H9.2V10.6L7 8.4V4.2z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        d="M8.2 4.2h7.6v3.6l-2.4 2.4v3.6H10.6V10.2L8.2 7.8V4.2z"
      />
      <path
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        d="M9.4 19.4h5.2M12 13.8v5.6"
      />
    </GlyphFrame>
  );
}

export function IconAutorizacao({ className }: DuotoneIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        className="fill-ledger"
        d="M5 2h9l5 5v15H5V2z"
      />
      <path
        className="fill-secondary"
        d="M16 14.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6zm-2.15 4.55 1.45 1.45 3.35-3.55 1.15 1.1-4.5 4.75-2.6-2.6 1.15-1.15z"
      />
    </svg>
  );
}

export function IconLaudo({ className }: DuotoneIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        className="fill-secondary"
        d="M4 2h12l4 4v16H4V2z"
      />
      <path
        className="fill-primary"
        d="M7 8h8v1.6H7V8zm0 3.2h8v1.6H7v-1.6zm0 3.2h5v1.6H7v-1.6zM15.2 15.4a4.4 4.4 0 1 1 0 8.8 4.4 4.4 0 0 1 0-8.8z"
      />
    </svg>
  );
}

export function IconAcompanhamento({ className }: DuotoneIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        className="fill-ledger"
        d="M12 3.2 21.2 20.2H2.8L12 3.2z"
      />
      <path
        className="fill-secondary"
        d="M12 5.1a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6zM6.2 15.9a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6zm11.6 0a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6z"
      />
    </svg>
  );
}

export function IconVitrine({ className }: DuotoneIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        className="fill-secondary"
        d="M3 8h18v13H3V8z"
      />
      <path
        className="fill-primary"
        d="M3 4h18v5H3V4zm3 9h5v6H6v-6zm7 0h5v6h-5v-6z"
      />
    </svg>
  );
}

export function IconPrazo({ className }: DuotoneIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        className="fill-primary"
        d="M3 6h18v15H3V6z"
      />
      <path
        className="fill-secondary"
        d="M3 6h18v4.2H3V6zm4.2-3.2h1.8v3.2H7.2V2.8zm7.8 0h1.8v3.2h-1.8V2.8zM8 13.2h3.2V16.4H8v-3.2z"
      />
    </svg>
  );
}
