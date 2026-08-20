import { Link } from "react-router-dom";

const COLS = [
  {
    title: "Produto",
    links: [
      { href: "#produto", label: "Expediente" },
      { href: "#planos", label: "Planos" },
      { href: "#landing-faq", label: "Perguntas" },
      { to: "/login", label: "Catálogo" },
    ],
  },
  {
    title: "Papéis",
    links: [
      { href: "#landing-personas", label: "Cliente" },
      { href: "#landing-personas", label: "Advogado" },
      { href: "#landing-personas", label: "Contador" },
      { to: "/login", label: "Entrar" },
    ],
  },
  {
    title: "Conta",
    links: [
      { to: "/register?role=cliente", label: "Sou cliente" },
      { to: "/register?role=advogado", label: "Sou advogado" },
      { to: "/register?role=contador", label: "Sou contador" },
      { to: "/login", label: "Já tenho conta" },
    ],
  },
  {
    title: "Rito",
    links: [
      { href: "#produto", label: "Consentimento LGPD" },
      { href: "#produto", label: "Ética OAB" },
      { href: "#produto", label: "CRC verificado" },
      { href: "#landing-personas", label: "Vitrine pública" },
    ],
  },
];

export function MagRodape() {
  return (
    <footer data-testid="mag-rodape" className="bg-mg-ink text-white py-20 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <nav className="grid grid-cols-4 gap-3 sm:gap-8 mb-12">
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="font-ui text-xs font-semibold uppercase tracking-wide text-mg-magenta mb-3">
                {col.title}
              </p>
              <ul className="space-y-1">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {"to" in l && l.to ? (
                      <Link
                        to={l.to}
                        className="inline-flex items-center min-h-9 font-ui text-xs sm:text-sm text-white hover:text-mg-ivory"
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        className="inline-flex items-center min-h-9 font-ui text-xs sm:text-sm text-white hover:text-mg-ivory"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 border-t border-white/10">
          <p className="font-ui font-bold text-sm tracking-tight">Connexo</p>
          <p className="font-ui text-xs text-white">O expediente da perícia · laudo no processo</p>
        </div>
      </div>
    </footer>
  );
}
