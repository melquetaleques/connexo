import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  GhostButton,
  GoldButton,
  Icon,
  PageContainer,
  Pill,
  Field,
} from "@/components/ui/connexo-primitives";
import api from "@/services/api";

interface CatalogAccountant {
  id: string;
  name: string;
  email: string;
  specialty: string;
  city: string;
  state: string;
  logo_url: string;
  availability: string;
}

const AVAILABILITY_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "disponivel", label: "Disponível" },
  { value: "parcial", label: "Disponibilidade Limitada" },
  { value: "indisponivel", label: "Indisponível" },
];

const AVAILABILITY_BADGE: Record<string, { label: string; color: string; tone: "success" | "warning" | "muted" }> = {
  disponivel: { label: "Disponível", color: "bg-emerald-500", tone: "success" },
  parcial: { label: "Disponibilidade Limitada", color: "bg-amber-500", tone: "warning" },
  indisponivel: { label: "Indisponível", color: "bg-gray-400", tone: "muted" },
};

export function CatalogPage() {
  const navigate = useNavigate();
  const [accountants, setAccountants] = useState<CatalogAccountant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");

  const loadCatalog = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (filterSpecialty) params.set("specialty", filterSpecialty);
      if (filterCity) params.set("city", filterCity);
      if (filterState) params.set("state", filterState);
      if (filterAvailability) params.set("availability", filterAvailability);

      const res = await api.get<CatalogAccountant[]>(`/public/accountants?${params.toString()}`);
      setAccountants(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar catálogo", err);
      setError("Não foi possível carregar o catálogo de contadores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, [filterSpecialty, filterCity, filterState, filterAvailability]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCatalog();
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">
            Catálogo de Contadores
          </span>
          <h2 className="text-3xl font-bold text-primary mt-1">Encontre o Perito Ideal</h2>
          <p className="text-sm font-medium text-primary/60 mt-2">
            Profissionais especializados em perícia contábil para seu processo.
          </p>
        </div>

        {/* Search & Filters */}
        <Card>
          <form onSubmit={handleSearch} className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Field
                  label="Buscar"
                  placeholder="Nome, especialidade..."
                  value={search}
                  onChange={(e: any) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <GoldButton type="submit" icon="search">
                  Buscar
                </GoldButton>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em] block mb-1">
                  Especialidade
                </label>
                <select
                  value={filterSpecialty}
                  onChange={(e) => setFilterSpecialty(e.target.value)}
                  className="w-full rounded-xl border border-outline bg-surface-2 px-4 py-2.5 text-sm font-medium text-primary focus:border-secondary focus:ring-1 focus:ring-secondary/40 outline-none transition-all"
                >
                  <option value="">Todas</option>
                  <option value="Perícia Contábil Judicial">Perícia Contábil Judicial</option>
                  <option value="Tributário">Tributário</option>
                  <option value="Trabalhista">Trabalhista</option>
                  <option value="Empresarial">Empresarial</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em] block mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  placeholder="Ex: São Paulo"
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full rounded-xl border border-outline bg-surface-2 px-4 py-2.5 text-sm font-medium text-primary focus:border-secondary focus:ring-1 focus:ring-secondary/40 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em] block mb-1">
                  Estado
                </label>
                <input
                  type="text"
                  placeholder="UF"
                  maxLength={2}
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-outline bg-surface-2 px-4 py-2.5 text-sm font-medium text-primary focus:border-secondary focus:ring-1 focus:ring-secondary/40 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em] block mb-1">
                  Disponibilidade
                </label>
                <select
                  value={filterAvailability}
                  onChange={(e) => setFilterAvailability(e.target.value)}
                  className="w-full rounded-xl border border-outline bg-surface-2 px-4 py-2.5 text-sm font-medium text-primary focus:border-secondary focus:ring-1 focus:ring-secondary/40 outline-none transition-all"
                >
                  {AVAILABILITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(search || filterSpecialty || filterCity || filterState || filterAvailability) && (
              <div className="flex items-center gap-2 text-xs font-medium text-primary/50">
                <Icon name="filter_alt" className="text-sm" />
                Filtros ativos
                <GhostButton onClick={() => {
                  setSearch("");
                  setFilterSpecialty("");
                  setFilterCity("");
                  setFilterState("");
                  setFilterAvailability("");
                  setLoading(true);
                  api.get<CatalogAccountant[]>("/public/accountants").then(res => {
                    setAccountants(res.data || []);
                  }).finally(() => setLoading(false));
                }} className="text-xs ml-2">
                  Limpar filtros
                </GhostButton>
              </div>
            )}
          </form>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Icon name="autorenew" className="text-4xl text-secondary animate-spin" />
            <p className="text-sm font-medium text-primary/60">Buscando contadores...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center">
            <Icon name="error_outline" className="text-4xl text-rose-400 mb-4" />
            <p className="text-sm font-bold text-rose-700">{error}</p>
            <GhostButton onClick={loadCatalog} className="mt-4">
              Tentar Novamente
            </GhostButton>
          </div>
        ) : accountants.length === 0 ? (
          <div className="rounded-[32px] border-2 border-dashed border-outline/30 bg-surface py-20 text-center">
            <Icon name="search_off" className="text-4xl text-primary/10 mb-4" />
            <h3 className="text-sm font-bold text-primary/30 uppercase tracking-widest">
              Nenhum contador encontrado
            </h3>
            <p className="text-xs text-primary/20 mt-2">
              Tente ajustar os filtros ou buscar por outro termo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accountants.map((acc) => {
              const badge = AVAILABILITY_BADGE[acc.availability] || AVAILABILITY_BADGE.disponivel;
              return (
                <Card key={acc.id} className="group hover:border-secondary/30 transition-all cursor-pointer" onClick={() => navigate(`/cnt/perfil/${acc.id}`)}>
                  <div className="flex flex-col gap-4">
                    {/* Header with logo */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-surface-2 border border-outline/30 flex items-center justify-center overflow-hidden shrink-0">
                        {acc.logo_url ? (
                          <img src={acc.logo_url} alt={acc.name} className="w-full h-full object-cover" />
                        ) : (
                          <Icon name="account_balance" className="text-2xl text-primary/20" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-primary truncate group-hover:text-secondary transition-colors">
                          {acc.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Pill tone={badge.tone as any} className="text-[10px] px-2 py-0.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${badge.color} inline-block mr-1`} />
                            {badge.label}
                          </Pill>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2">
                      {acc.specialty && (
                        <div className="flex items-center gap-2 text-xs font-medium text-primary/60">
                          <Icon name="star" className="text-amber-500 text-sm" />
                          {acc.specialty}
                        </div>
                      )}
                      {(acc.city || acc.state) && (
                        <div className="flex items-center gap-2 text-xs font-medium text-primary/60">
                          <Icon name="location_on" className="text-secondary text-sm" />
                          {[acc.city, acc.state].filter(Boolean).join(", ")}
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="pt-2 border-t border-outline/20">
                      <GoldButton
                        className="w-full text-xs py-2.5"
                        icon="handshake"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          navigate(`/cnt/perfil/${acc.id}`);
                        }}
                      >
                        Ver Perfil
                      </GoldButton>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
