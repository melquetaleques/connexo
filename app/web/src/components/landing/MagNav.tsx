import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/connexo-primitives";
import { MagBotao } from "./MagBotao";

const LINKS = [
  { href: "#produto", label: "Produto" },
  { href: "#landing-personas", label: "Papéis" },
  { href: "#planos", label: "Planos" },
  { href: "#landing-faq", label: "Perguntas" },
];

export function MagNav() {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-3">
      <div
        data-testid="mag-nav"
        className="landing-pill landing-glass-ink backdrop-blur-xl w-full max-w-5xl h-14 flex items-center justify-between gap-3 px-3 sm:px-5 text-white"
      >
        <Link to="/" className="inline-flex items-center gap-2 min-h-11 shrink-0 text-white">
          <span className="w-8 h-8 rounded-full bg-mg-indigo text-white flex items-center justify-center">
            <Icon name="balance" />
          </span>
          <span className="hidden sm:inline font-ui font-bold text-sm tracking-tight">Connexo</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 font-ui text-sm font-semibold text-white">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-mg-ivory">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/login"
            className="inline-flex items-center min-h-11 px-3 font-ui text-sm font-semibold text-white"
          >
            Entrar
          </Link>
          <MagBotao href="#landing-personas">Começar</MagBotao>
        </div>
      </div>
    </header>
  );
}
