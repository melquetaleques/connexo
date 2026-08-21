import { Link } from "react-router-dom";
import { MagBotao } from "./MagBotao";

const LINKS = [
  { href: "#produto", label: "Expediente" },
  { href: "#landing-personas", label: "Peritos" },
  { href: "#landing-faq", label: "Recursos" },
  { href: "#landing-personas", label: "Escritórios" },
  { href: "#planos", label: "Planos" },
];

export function MagNav() {
  return (
    <header
      data-testid="mag-nav"
      style={{ position: "relative", padding: "0 40px" }}
    >
      <div
        style={{
          maxWidth: 1600,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          padding: "20px 0",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 44, flexWrap: "wrap" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: "rgb(255, 255, 255)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                font: '900 13px / 1 Figtree, sans-serif',
                color: "rgb(59, 13, 22)",
              }}
            >
              C
            </span>
            <span
              style={{
                font: "700 21px / 1 Figtree, sans-serif",
                letterSpacing: "-0.02em",
                color: "rgb(255, 255, 255)",
              }}
            >
              Connexo
            </span>
          </Link>
          <nav style={{ display: "flex", gap: 26, flexWrap: "wrap" }}>
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  font: '600 15px / 1 "Hanken Grotesk", sans-serif',
                  color: "rgb(255, 255, 255)",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <Link
            to="/login"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              height: 40,
              padding: "0 16px",
              borderRadius: 8,
              background: "rgba(255, 255, 255, 0.14)",
              border: "1px solid rgba(255, 255, 255, 0.22)",
              textDecoration: "none",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 15, lineHeight: 1, color: "rgba(255, 255, 255, 0.85)" }}
              aria-hidden="true"
            >
              search
            </span>
            <span
              style={{
                font: '600 14px / 1 "Hanken Grotesk", sans-serif',
                color: "rgb(255, 255, 255)",
              }}
            >
              Buscar processo
            </span>
          </Link>
          <Link
            to="/login"
            style={{
              font: '600 15px / 1 "Hanken Grotesk", sans-serif',
              color: "rgb(255, 255, 255)",
              textDecoration: "none",
            }}
          >
            Entrar
          </Link>
          <MagBotao to="/register" variant="light">
            Criar conta
          </MagBotao>
        </div>
      </div>
    </header>
  );
}
