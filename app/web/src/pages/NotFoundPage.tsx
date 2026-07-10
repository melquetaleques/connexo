import { Link } from "react-router-dom";
import { Icon, GoldButton } from "@/components/ui/connexo-primitives";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-1 px-4">
      <div className="text-center max-w-lg">
        <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-lg border border-outline/30">
          <Icon name="search_off" className="text-5xl text-primary/15" />
        </div>
        <div className="text-[120px] font-black text-primary/5 leading-none mb-4 tracking-tighter">
          404
        </div>
        <h1 className="text-2xl font-black text-primary mb-2">Página não encontrada</h1>
        <p className="text-sm text-primary/50 font-medium mb-8">
          A página que você procura não existe ou foi movida. Verifique o endereço ou volte ao início.
        </p>
        <Link to="/login">
          <GoldButton icon="arrow_back">Voltar ao Início</GoldButton>
        </Link>
      </div>
    </div>
  );
}
