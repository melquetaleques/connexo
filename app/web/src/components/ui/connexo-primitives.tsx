import React from "react";
import { cn } from "@/lib/utils";

// ---- Icon ----
interface IconProps {
  name: string;
  className?: string;
  fill?: boolean;
  style?: React.CSSProperties;
}

export function Icon({ name, className, fill, style }: IconProps) {
  return (
    <span
      style={style}
      className={cn(
        "material-symbols-outlined text-[1.2em] leading-none",
        fill ? "material-symbols-filled" : "",
        className
      )}
    >
      {name}
    </span>
  );
}

// ---- Avatar ----
type ToneName =
  | "gold"
  | "primary"
  | "surface"
  | "navy"
  | "rose"
  | "success"
  | "warning"
  | "neutral"
  | "gray"
  | "emerald"
  | "error";

interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  tone?: ToneName;
  className?: string;
}

const AVATAR_SIZES = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
};

const AVATAR_TONES: Record<string, string> = {
  gold: "bg-secondary/20 text-secondary",
  primary: "bg-primary/10 text-primary",
  surface: "bg-surface-2 text-on-surface-variant",
  navy: "bg-primary/15 text-primary",
};

export function Avatar({ initials, size = "md", tone = "gold", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-extrabold",
        AVATAR_SIZES[size],
        AVATAR_TONES[tone] ?? AVATAR_TONES.gold,
        className
      )}
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
}

// ---- Card ----
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg" | "none";
  /** alias used by several pages */
  padded?: boolean;
  onClick?: () => void;
}

const CARD_PADDING: Record<string, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ children, className, padding, padded, onClick }: CardProps) {
  const pad = padding ?? (padded === false ? "none" : "md");
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl border border-outline/60 shadow-sm",
        CARD_PADDING[pad] ?? CARD_PADDING.md,
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

// ---- GoldButton ----
interface GoldButtonProps {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  accent?: string;
  tone?: string;
}

export function GoldButton({
  children,
  className,
  type = "button",
  icon,
  disabled,
  onClick,
  variant = "primary",
}: GoldButtonProps) {
  const base = cn(
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold uppercase tracking-widest transition-all",
    variant === "primary" &&
      "bg-secondary text-white hover:bg-secondary/90 shadow-lg shadow-secondary/20 active:scale-[0.97]",
    variant === "ghost" &&
      "border border-outline text-primary hover:border-secondary/50 hover:text-secondary bg-white",
    disabled && "opacity-50 pointer-events-none",
    className
  );

  return (
    <button type={type} className={base} disabled={disabled} onClick={onClick}>
      {icon && <Icon name={icon} className="text-lg" />}
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className,
  icon,
  onClick,
  disabled,
  type = "button",
  tone,
}: {
  children?: React.ReactNode;
  className?: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  tone?: string;
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold uppercase tracking-widest transition-all border border-outline text-primary hover:border-secondary/50 hover:text-secondary bg-white",
        tone === "danger" && "border-rose-300 text-rose-700",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <Icon name={icon} className="text-lg" />}
      {children}
    </button>
  );
}

// ---- Field ----
interface FieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
  as?: "input" | "textarea" | string;
  rows?: number;
}

export function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  className,
  disabled,
  as = "input",
  rows = 3,
}: FieldProps) {
  const inputClass = cn(
    "w-full px-4 py-3 rounded-xl border bg-white text-sm font-bold text-primary placeholder:text-primary/30",
    "border-outline/80 focus:border-secondary focus:ring-2 focus:ring-secondary/10 focus:outline-none transition-all",
    disabled && "opacity-60 cursor-not-allowed bg-surface-2",
    error && "border-rose-400 focus:border-rose-400 focus:ring-rose-200"
  );
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-xs font-extrabold uppercase tracking-widest text-primary/60">{label}</label>
      {as === "textarea" ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          rows={rows}
          className={inputClass}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={inputClass}
        />
      )}
      {error && <p className="text-[11px] font-bold text-rose-500 mt-0.5">{error}</p>}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-xs font-extrabold uppercase tracking-widest text-primary/60">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl border border-outline/80 bg-white text-sm font-bold text-primary focus:border-secondary focus:ring-2 focus:ring-secondary/10 focus:outline-none transition-all"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ---- SectionTitle ----
interface SectionTitleProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  kicker?: string;
  action?: React.ReactNode;
  className?: string;
  center?: boolean;
}

export function SectionTitle({
  children,
  title,
  subtitle,
  kicker,
  action,
  className,
  center,
}: SectionTitleProps) {
  const heading = children ?? title;
  return (
    <div className={cn("mb-10 flex flex-wrap items-end justify-between gap-4", center && "text-center", className)}>
      <div className={cn(center && "w-full")}>
        {kicker && (
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-2">{kicker}</p>
        )}
        <h2 className="text-2xl lg:text-3xl font-black text-primary leading-tight">{heading}</h2>
        {subtitle && (
          <p className="mt-2 text-sm font-medium text-on-surface-variant max-w-xl">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ---- Pill ----
interface PillProps {
  children: React.ReactNode;
  tone?: ToneName | string;
  className?: string;
}

const PILL_TONES: Record<string, string> = {
  gold: "bg-secondary/10 text-secondary",
  primary: "bg-primary/10 text-primary",
  surface: "bg-surface-2 text-on-surface-variant",
  rose: "bg-rose-50 text-rose-600",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  neutral: "bg-surface-2 text-on-surface-variant",
  gray: "bg-surface-2 text-on-surface-variant",
  navy: "bg-primary/10 text-primary",
  emerald: "bg-emerald-50 text-emerald-700",
  error: "bg-rose-50 text-rose-600",
};

export function Pill({ children, tone = "primary", className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
        PILL_TONES[tone] ?? PILL_TONES.primary,
        className
      )}
    >
      {children}
    </span>
  );
}

// ---- PageContainer ----
interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn("max-w-7xl mx-auto px-6 py-8", className)}>{children}</div>;
}

// ---- Badge ----
interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info";
  className?: string;
}

const BADGE_VARIANTS = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-rose-50 text-rose-700 border-rose-200",
  info: "bg-sky-50 text-sky-700 border-sky-200",
};

export function Badge({ children, variant = "info", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
        BADGE_VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ---- Stat ----
export function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">{label}</p>
      <p className="text-sm font-bold text-primary">{value}</p>
    </div>
  );
}

// ---- StatusDot ----
const STATUS_DOT_COLORS: Record<string, string> = {
  ativo: "bg-emerald-500",
  active: "bg-emerald-500",
  atencao: "bg-amber-500",
  warning: "bg-amber-500",
  encerrado: "bg-slate-400",
  inactive: "bg-slate-400",
  pendente: "bg-sky-500",
  pending: "bg-sky-500",
  success: "bg-emerald-500",
  neutral: "bg-slate-400",
  default: "bg-slate-400",
};

export function StatusDot({
  status,
  tone,
  className,
}: {
  status?: string;
  tone?: string;
  className?: string;
}) {
  const key = status ?? tone ?? "default";
  const color = STATUS_DOT_COLORS[key] ?? STATUS_DOT_COLORS.default;
  return (
    <span className={cn("inline-block w-2 h-2 rounded-full shrink-0", color, className)} />
  );
}
