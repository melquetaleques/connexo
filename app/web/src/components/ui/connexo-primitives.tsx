import React from "react";
import { cn } from "@/lib/utils";

// ---- Icon ----
interface IconProps {
  name: string;
  className?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Icon({ name, className, fill, style, onClick }: IconProps) {
  return (
    <span
      style={style}
      onClick={onClick}
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
  gold: "bg-secondary/15 text-secondary",
  primary: "bg-primary/10 text-primary",
  surface: "bg-surface-2 text-on-surface-variant/70",
  navy: "bg-primary/15 text-primary",
};

export function Avatar({ initials, size = "md", tone = "gold", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold font-theme-display tracking-tight",
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
        "bg-white/80 rounded-[16px] border border-outline shadow-[0_8px_28px_rgba(64,16,30,0.05)] backdrop-blur-sm",
        CARD_PADDING[pad] ?? CARD_PADDING.md,
        onClick &&
          "cursor-pointer transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(64,16,30,0.10)] hover:border-secondary/30 active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
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
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: "primary" | "ghost";
  accent?: string;
  tone?: string;
  title?: string;
}

export function GoldButton({
  children,
  className,
  type = "button",
  icon,
  disabled,
  onClick,
  variant = "primary",
  title,
}: GoldButtonProps) {
  const base = cn(
    "inline-flex items-center justify-center gap-2 min-h-11 px-7 py-3 rounded-[8px] text-base font-semibold uppercase tracking-wide leading-none transition-all duration-300 ease-out font-theme-body motion-reduce:transition-none motion-reduce:active:scale-100",
    variant === "primary" &&
      "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.97]",
    variant === "ghost" &&
      "border border-outline text-primary hover:border-secondary/50 hover:text-secondary bg-white",
    disabled && "opacity-50 pointer-events-none",
    className
  );

  return (
    <button type={type} className={base} disabled={disabled} onClick={onClick} title={title}>
      {icon && <Icon name={icon} className="text-lg leading-none shrink-0" />}
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
  title,
}: {
  children?: React.ReactNode;
  className?: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  tone?: string;
  title?: string;
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[8px] text-sm font-semibold uppercase tracking-widest transition-all duration-300 ease-out border border-outline text-primary hover:border-secondary/50 hover:text-secondary hover:bg-secondary/5 bg-white font-theme-body active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100",
        tone === "danger" && "border-rose-300 text-rose-700 hover:bg-rose-50",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {icon && <Icon name={icon} className="text-lg" />}
      {children}
    </button>
  );
}

// ---- SuccessDialog ----
// Modal de confirmação com marca própria — não usar alert nativo do navegador.
interface SuccessDialogProps {
  open: boolean;
  title: string;
  message?: string;
  actionLabel?: string;
  onClose: () => void;
}

export function SuccessDialog({ open, title, message, actionLabel = "Continuar", onClose }: SuccessDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] shadow-2xl max-w-sm w-full p-10 text-center animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-6">
          <Icon name="check_circle" fill className="text-5xl text-emerald-500" />
        </div>
        <h3 className="text-2xl font-black text-primary tracking-tight mb-2">{title}</h3>
        {message && <p className="text-sm text-primary/50 font-medium mb-8">{message}</p>}
        <GoldButton className="w-full py-4 justify-center" onClick={onClose}>
          {actionLabel}
        </GoldButton>
      </div>
    </div>
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
    "w-full px-4 py-3 rounded-xl border bg-white text-sm font-medium text-ink placeholder:text-on-surface-variant/40 font-theme-body",
    "border-outline focus:border-secondary focus:ring-2 focus:ring-secondary/15 focus:outline-none transition-all duration-300 motion-reduce:transition-none",
    disabled && "opacity-60 cursor-not-allowed bg-surface-2",
    error && "border-rose-400 focus:border-rose-400 focus:ring-rose-200"
  );
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-xs font-semibold uppercase tracking-widest text-primary/60 font-theme-body">{label}</label>
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
      <label className="text-xs font-semibold uppercase tracking-widest text-primary/60 font-theme-body">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-xl border border-outline bg-white text-sm font-medium text-ink font-theme-body focus:border-secondary focus:ring-2 focus:ring-secondary/15 focus:outline-none transition-all duration-300 motion-reduce:transition-none"
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
        <h2 className="text-2xl lg:text-3xl font-semibold text-ink leading-tight font-theme-display tracking-tight">{heading}</h2>
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
  return <div className={cn("max-w-7xl mx-auto px-6 py-8 font-theme-body", className)}>{children}</div>;
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

// ---- Shared panel vocabulary (StatCard lives in dashboard/) ----

export function PageHeader({
  kicker,
  title,
  subtitle,
  action,
  search,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  className,
}: {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 flex flex-col gap-6", className)}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          {kicker && (
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-2 font-theme-body">
              {kicker}
            </p>
          )}
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink font-theme-display">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-on-surface-variant/70 font-theme-body">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {onSearchChange && (
        <div className="relative max-w-md">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
          <input
            value={search ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-outline bg-white text-sm font-medium text-ink placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-all duration-300 font-theme-body motion-reduce:transition-none"
          />
        </div>
      )}
    </div>
  );
}

export function StatusBadge({
  status,
  children,
  className,
}: {
  status?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const key = (status ?? "").toLowerCase();
  const tone =
    key === "ativo" || key === "active" || key === "success" || key === "disponivel"
      ? "success"
      : key === "atencao" || key === "warning" || key === "parcial"
        ? "warning"
        : key === "error" || key === "danger" || key === "recusado"
          ? "error"
          : key === "gold" || key === "pendente" || key === "solicitado"
            ? "gold"
            : "neutral";
  return (
    <Pill tone={tone} className={className}>
      {children ?? status}
    </Pill>
  );
}

export function DataTable({ headers, children }: { headers: React.ReactNode[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse font-theme-body">
        <thead>
          <tr className="bg-surface-2/40 border-b border-outline">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline/60">{children}</tbody>
      </table>
    </div>
  );
}

export function DataRow({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "group transition-colors duration-200 motion-reduce:transition-none",
        onClick && "cursor-pointer hover:bg-primary/[0.03] active:bg-primary/[0.05]"
      )}
    >
      {children}
    </tr>
  );
}

export function TimelineStep({
  date,
  title,
  description,
  active = true,
  last = false,
}: {
  date?: string;
  title: string;
  description?: string;
  active?: boolean;
  last?: boolean;
}) {
  return (
    <div className="relative flex gap-4 cx-reveal">
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "w-3 h-3 rounded-full shrink-0 ring-4 ring-white transition-colors duration-300",
            active ? "bg-secondary" : "bg-outline"
          )}
        />
        {!last && <span className="w-px flex-1 bg-outline/70 mt-1 min-h-[2rem]" />}
      </div>
      <div className={cn("pb-6", last && "pb-0")}>
        {date && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 font-theme-body">
            {date}
          </p>
        )}
        <p className={cn("text-sm font-semibold font-theme-display", active ? "text-ink" : "text-on-surface-variant/50")}>
          {title}
        </p>
        {description && (
          <p className="text-xs text-on-surface-variant/60 leading-relaxed font-theme-body mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

export function DeadlineCard({
  label,
  value,
  hint,
  icon = "schedule",
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: string;
  className?: string;
}) {
  return (
    <Card className={cn("p-6 border-l-4 border-l-secondary cx-reveal", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 font-theme-body">
            {label}
          </p>
          <p className="mt-1 text-lg font-semibold text-ink font-theme-display">{value}</p>
          {hint && <p className="mt-1 text-xs text-on-surface-variant/50 font-theme-body">{hint}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
          <Icon name={icon} className="text-xl" />
        </div>
      </div>
    </Card>
  );
}

export function EmptyState({
  icon = "inbox",
  title,
  hint,
  action,
}: {
  icon?: string;
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-20 bg-surface-1 rounded-[32px] border-2 border-dashed border-outline/60">
      <Icon name={icon} className="text-4xl text-primary/15 mb-4" />
      <p className="text-sm font-semibold text-on-surface-variant/50 uppercase tracking-widest font-theme-body">
        {title}
      </p>
      {hint && <p className="mt-2 text-xs text-on-surface-variant/40 font-theme-body">{hint}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
