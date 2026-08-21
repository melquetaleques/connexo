import { Link } from "react-router-dom";

type FooterLink = { label: string; href?: string; to?: string; badge?: string };

const COLS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Produto",
    links: [
      { href: "#produto", label: "Vínculos" },
      { href: "#produto", label: "Processos" },
      { href: "#produto", label: "Editor de laudo" },
      { href: "#produto", label: "Prazos", badge: "Novo" },
      { href: "#produto", label: "Assinatura digital" },
      { href: "#produto", label: "Vitrine" },
      { href: "#planos", label: "API" },
    ],
  },
  {
    title: "Comece aqui",
    links: [
      { href: "#landing-faq", label: "Academia Connexo" },
      { href: "#landing-faq", label: "Documentação" },
      { href: "#landing-faq", label: "Suporte" },
      { href: "#landing-faq", label: "Termos de uso" },
      { href: "#landing-faq", label: "Privacidade" },
      { href: "#landing-faq", label: "Cookies" },
      { href: "#landing-faq", label: "Central de confiança" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "#planos", label: "Planos" },
      { href: "#produto", label: "Sobre nós" },
      { href: "#produto", label: "Casos" },
      { href: "#landing-faq", label: "Carreiras" },
      { href: "#landing-faq", label: "Blog" },
      { href: "#landing-faq", label: "Imprensa" },
    ],
  },
  {
    title: "Contato",
    links: [
      { href: "#landing-faq", label: "Atendimento" },
      { href: "#landing-faq", label: "LinkedIn" },
      { href: "#landing-faq", label: "Instagram" },
      { href: "#landing-faq", label: "YouTube" },
      { to: "/register?role=cliente", label: "Comunidade" },
    ],
  },
];

export function MagRodape() {
  return (
    <footer
      data-testid="mag-rodape"
      style={{ background: "rgb(17, 17, 16)", padding: "76px 40px 60px", color: "rgb(255, 255, 255)" }}
    >
      <div
        style={{
          maxWidth: 1220,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0px, 1.25fr) repeat(4, minmax(0px, 1fr))",
          gap: 40,
        }}
        className="max-lg:!grid-cols-2 max-sm:!grid-cols-1"
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 20 }}>
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: 7,
                background: "rgb(255, 255, 255)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                font: "900 12px / 1 Figtree, sans-serif",
                color: "rgb(17, 17, 16)",
              }}
            >
              C
            </span>
            <span style={{ font: "700 20px / 1 Figtree, sans-serif", letterSpacing: "-0.02em", color: "rgb(255, 255, 255)" }}>
              Connexo
            </span>
          </div>
          <p
            style={{
              margin: "0 0 26px",
              font: '400 15px / 1.6 "Hanken Grotesk", sans-serif',
              color: "rgba(255, 255, 255, 0.55)",
              maxWidth: "32ch",
            }}
          >
            A plataforma da perícia contábil judicial. Usada por escritórios de advocacia, contabilidades e peritos em todo o Brasil.
          </p>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              height: 38,
              padding: "0 15px",
              borderRadius: 8,
              border: "1px solid rgba(255, 255, 255, 0.2)",
              font: '600 14px / 1 "Hanken Grotesk", sans-serif',
              color: "rgb(255, 255, 255)",
            }}
          >
            Português <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>▾</span>
          </span>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <p
              style={{
                font: '700 15px / 1 "Hanken Grotesk", sans-serif',
                color: "rgb(255, 77, 141)",
                marginBottom: 18,
              }}
            >
              {col.title}
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: 11, listStyle: "none", margin: 0, padding: 0 }}>
              {col.links.map((l) => (
                <li key={l.label}>
                  {"to" in l && l.to ? (
                    <Link
                      to={l.to}
                      style={{
                        font: '400 15px / 1 "Hanken Grotesk", sans-serif',
                        color: "rgb(255, 255, 255)",
                        textDecoration: "none",
                      }}
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      href={l.href}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        font: '400 15px / 1 "Hanken Grotesk", sans-serif',
                        color: "rgb(255, 255, 255)",
                        textDecoration: "none",
                      }}
                    >
                      {l.label}
                      {"badge" in l && l.badge ? (
                        <span
                          style={{
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: "rgb(42, 51, 88)",
                            font: '600 11px / 1.3 "Hanken Grotesk", sans-serif',
                            color: "rgb(159, 176, 232)",
                          }}
                        >
                          {l.badge}
                        </span>
                      ) : null}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        style={{
          maxWidth: 1220,
          margin: "56px auto 0",
          paddingTop: 24,
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <span style={{ font: '400 13px / 1 "Hanken Grotesk", sans-serif', color: "rgba(255, 255, 255, 0.4)" }}>
          © 2026 Connexo Tecnologia LTDA
        </span>
        <span style={{ font: '400 13px / 1 "Hanken Grotesk", sans-serif', color: "rgba(255, 255, 255, 0.4)" }}>
          São Paulo · Brasil
        </span>
      </div>
    </footer>
  );
}
