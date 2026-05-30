import React from "react";
import { cn } from "@/lib/utils";

// ---- Icon ----
interface IconProps {
  name: string;
  className?: string;
  fill?: boolean;
}

export function Icon({ name, className, fill }: IconProps) {
  return (
    <span
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
interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  tone?: "gold" | "primary" | "surface";
  className?: string;
}

const AVATAR_SIZES = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
};

const AVATAR_TONES = {
  gold: "bg-secondary/20 text-secondary",
  primary: "bg-primary/10 text-primary",
  surface: "bg-surface-2 text-on-surface-variant",
};

export function Avatar({ initials, size = "md", tone = "gold", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-extrabold",
        AVATAR_SIZES[size],
        AVATAR_TONES[tone],
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
  padding?: "sm" | "md" | "lg";
}

const CARD_PADDING = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ children, className, padding = "md" }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-outline/60 shadow-sm",
        CARD_PADDING[padding],
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
}

export function GoldButton({ children, className, type = "button", icon, disabled, onClick, variant = "primary" }: GoldButtonProps) {
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

// ---- Field ----
interface FieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
}

export function Field({ label, placeholder, type = "text", value, onChange, error, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-xs font-extrabold uppercase tracking-widest text-primary/60">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          "w-full px-4 py-3 rounded-xl border bg-white text-sm font-bold text-primary placeholder:text-primary/30",
          "border-outline/80 focus:border-secondary focus:ring-2 focus:ring-secondary/10 focus:outline-none transition-all",
          error && "border-rose-400 focus:border-rose-400 focus:ring-rose-200"
        )}
      />
      {error && <p className="text-[11px] font-bold text-rose-500 mt-0.5">{error}</p>}
    </div>
  );
}

// ---- SectionTitle ----
interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
  center?: boolean;
}

export function SectionTitle({ children, subtitle, className, center }: SectionTitleProps) {
  return (
    <div className={cn("mb-10", center && "text-center", className)}>
      <h2 className="text-2xl lg:text-3xl font-black text-primary leading-tight">{children}</h2>
      {subtitle && (
        <p className="mt-2 text-sm font-medium text-on-surface-variant max-w-xl">{subtitle}</p>
      )}
    </div>
  );
}

// ---- Pill ----
interface PillProps {
  children: React.ReactNode;
  tone?: "gold" | "primary" | "surface" | "rose";
  className?: string;
}

const PILL_TONES = {
  gold: "bg-secondary/10 text-secondary",
  primary: "bg-primary/10 text-primary",
  surface: "bg-surface-2 text-on-surface-variant",
  rose: "bg-rose-50 text-rose-600",
};

export function Pill({ children, tone = "primary", className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
        PILL_TONES[tone],
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
  return (
    <div className={cn("max-w-7xl mx-auto px-6 py-8", className)}>
      {children}
    </div>
  );
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
