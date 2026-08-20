import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type MagBotaoProps = {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "ghost";
  className?: string;
  type?: "button" | "submit";
};

export function MagBotao({
  children,
  to,
  href,
  onClick,
  variant = "solid",
  className = "",
  type = "button",
}: MagBotaoProps) {
  const skin =
    variant === "solid"
      ? "mag-botao-solid bg-mg-ink text-white hover:bg-black"
      : "border border-current bg-transparent hover:bg-white/10";
  const cls = `landing-pill inline-flex items-center justify-center gap-2 min-h-11 px-6 font-ui text-sm font-semibold tracking-tight ${skin} ${className}`;

  if (to) {
    return (
      <Link to={to} data-testid="mag-botao" className={cls}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} data-testid="mag-botao" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} data-testid="mag-botao" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
