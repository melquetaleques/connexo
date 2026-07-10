import { Link } from "react-router-dom";
import { GoldButton, Icon } from "@/components/ui/connexo-primitives";

export function PublicProfilePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-['Plus_Jakarta_Sans']">
      <div className="text-center max-w-md">
        <Icon name="public" className="text-5xl text-primary/10 mb-6 mx-auto" />
        <h1 className="text-3xl font-black text-primary tracking-tight mb-4">Perfil Publico</h1>
        <p className="text-primary/50 font-medium mb-8">
          As informacoes do seu perfil publico serao exibidas aqui. Configure seu perfil no painel.
        </p>
        <Link to="/login">
          <GoldButton icon="arrow_back">Voltar ao Login</GoldButton>
        </Link>
      </div>
    </div>
  );
}
