import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoldButton, GhostButton, Icon, Card, Pill, Field } from "@/components/ui/connexo-primitives";
import api from "@/services/api";

interface PublicAccountant {
  id: string;
  name: string;
  specialty: string;
  city: string;
  state: string;
  logo_url: string;
  availability: string;
  slug?: string;
}

const AVAILABILITY_BADGE: Record<string, { label: string; tone: "success" | "warning" | "muted" }> = {
  disponivel: { label: "Disponível", tone: "success" },
  parcial: { label: "Disponibilidade Limitada", tone: "warning" },
  ocupado: { label: "Disponibilidade Limitada", tone: "warning" },
  indisponivel: { label: "Indisponível", tone: "muted" },
};

export function PublicProfilePage() {
  const navigate = useNavigate();
  const [accountants, setAccountants] = useState<PublicAccountant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = async (q = "") => {
    setLoading(true);
    setError("");
    try {
      const params = q ? `?q=${encodeURIComponent(q)}` : "";
      const res = await api.get<PublicAccountant[]>(`/public/accountants${params}`);
      setAccountants(res.data || []);
    } catch {
      setError("Não foi possível carregar o catálogo público de contadores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const profilePath = (acc: PublicAccountant) => `/contadores/${acc.slug || acc.id}`;

  return (
    <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans']">
      <header className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Icon name="balance" className="text-white text-xl" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">Connexo</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-xs font-extrabold uppercase tracking-widest text-white/60 hover:text-white">
              Entrar
            </Link>
            <Link to="/register">
              <GoldButton className="py-2 px-5 text-[10px]">Cadastrar</GoldButton>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-2">Catálogo público</p>
          <h1 className="text-4xl font-black text-primary tracking-tight mb-3">Contadores peritos</h1>
          <p className="text-primary/50 font-medium max-w-2xl">
            Perfis públicos de contadores especializados em perícia. Escolha um profissional para ver especialidades, serviços e avaliações.
          </p>
        </div>

        <form
          className="mb-10 flex flex-col md:flex-row gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            load(search);
          }}
        >
          <div className="flex-1">
            <Field
              label="Buscar"
              placeholder="Nome ou especialidade"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <GoldButton type="submit" icon="search">Buscar</GoldButton>
          </div>
        </form>

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <Icon name="autorenew" className="text-4xl text-secondary animate-spin" />
            <p className="text-sm font-medium text-primary/50">Carregando catálogo...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
            <p className="text-sm font-bold text-rose-700 mb-4">{error}</p>
            <GhostButton onClick={() => load(search)}>Tentar novamente</GhostButton>
          </div>
        ) : accountants.length === 0 ? (
          <div className="rounded-[32px] border-2 border-dashed border-outline/30 bg-white py-20 text-center">
            <Icon name="search_off" className="text-4xl text-primary/10 mb-4" />
            <p className="text-sm font-bold text-primary/30 uppercase tracking-widest">Nenhum contador público encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accountants.map((acc) => {
              const badge = AVAILABILITY_BADGE[acc.availability] || AVAILABILITY_BADGE.disponivel;
              return (
                <Card
                  key={acc.id}
                  className="p-6 hover:border-secondary/40 transition-all cursor-pointer"
                  onClick={() => navigate(profilePath(acc))}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-surface-2 flex items-center justify-center overflow-hidden">
                      {acc.logo_url ? (
                        <img src={acc.logo_url} alt={acc.name} className="w-full h-full object-cover" />
                      ) : (
                        <Icon name="account_balance" className="text-2xl text-primary/20" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base font-black text-primary truncate">{acc.name}</h2>
                      <Pill tone={badge.tone} className="text-[10px] mt-1">{badge.label}</Pill>
                    </div>
                  </div>
                  {acc.specialty && <p className="text-sm font-medium text-primary/60 mb-2">{acc.specialty}</p>}
                  {(acc.city || acc.state) && (
                    <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-4">
                      {[acc.city, acc.state].filter(Boolean).join(", ")}
                    </p>
                  )}
                  <GoldButton className="w-full text-xs py-2.5" icon="visibility" onClick={() => navigate(profilePath(acc))}>
                    Ver perfil
                  </GoldButton>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
