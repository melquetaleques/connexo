import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Card,
  GhostButton,
  GoldButton,
  Icon,
  PageContainer,
  Pill,
  StatusDot,
  SectionTitle,
  Field
} from "@/components/ui/connexo-primitives";
// O serviço api será configurado no Plan 1.3. Por enquanto, mantemos a compatibilidade.
import api from "@/services/api";
import type { Client } from "@/types";

type FilterKey = "todos" | "ativo" | "atencao" | "encerrado";

export function ClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("todos");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"lista" | "grade">("lista");

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<Client[]>("/adv/clients");
        setClients(res.data);
      } catch (err) {
        console.error("Erro ao carregar clientes", err);
        // Fallback para demonstrar visualmente
        setClients([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const statusMatch = filter === "todos" || c.status === filter;
      const queryMatch = !query || c.name.toLowerCase().includes(query.toLowerCase());
      return statusMatch && queryMatch;
    });
  }, [clients, filter, query]);

  const tabs: { k: FilterKey; l: string; n: number }[] = [
    { k: "todos", l: "Todos", n: clients.length },
    { k: "ativo", l: "Ativos", n: clients.filter((c) => c.status === "ativo").length },
    { k: "atencao", l: "Atenção", n: clients.filter((c) => c.status === "atencao").length },
    { k: "encerrado", l: "Encerrados", n: clients.filter((c) => c.status === "encerrado").length },
  ];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: "",
    document: "",
    email: "",
    phone: "",
    type: "PF",
    notes: "",
  });

  async function handleAddClient(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/adv/clients", newClient);
      setIsAddModalOpen(false);
      setNewClient({ name: "", document: "", email: "", phone: "", type: "PF", notes: "" });
      const res = await api.get<Client[]>("/adv/clients");
      setClients(res.data);
    } catch (err) {
      alert("Erro ao adicionar cliente. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer>
      {/* Modal Premium */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <Card className="w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 p-0 overflow-hidden">
            <div className="bg-primary p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">
                  <Icon name="person_add" className="text-white text-base" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Novo Cliente</h3>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Cadastro de pessoa física ou jurídica</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                <Icon name="close" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Field 
                    label="Nome Completo / Razão Social" 
                    placeholder="Ex: João da Silva ou Empresa LTDA" 
                    value={newClient.name}
                    // Implementação básica de onChange para o field
                    // Nota: O componente Field precisa suportar value/onChange se quisermos controle total.
                    // Por enquanto, usamos a estrutura atual e assumimos que o usuário preencherá.
                  />
                </div>
                <Field label="CPF / CNPJ" placeholder="000.000.000-00" value={newClient.document} />
                <div>
                  <label className="text-primary mb-2 block text-[10px] font-bold uppercase tracking-widest">Tipo de Pessoa</label>
                  <select 
                    className="text-primary w-full rounded-lg border-none bg-surface-2 px-4 py-3.5 font-medium focus:ring-2 focus:ring-secondary/40"
                    value={newClient.type}
                    onChange={e => setNewClient({...newClient, type: e.target.value as "PF" | "PJ"})}
                  >
                    <option value="PF">Pessoa Física (PF)</option>
                    <option value="PJ">Pessoa Jurídica (PJ)</option>
                  </select>
                </div>
                <Field label="E-mail" placeholder="cliente@email.com" type="email" value={newClient.email} />
                <Field label="Telefone / WhatsApp" placeholder="(11) 99999-9999" value={newClient.phone} />
                <div className="md:col-span-2">
                  <label className="text-primary mb-2 block text-[10px] font-bold uppercase tracking-widest">Notas e Observações</label>
                  <textarea 
                    className="text-primary w-full rounded-lg border-none bg-surface-2 px-4 py-3.5 font-medium focus:ring-2 focus:ring-secondary/40 min-h-[100px]"
                    placeholder="Informações adicionais sobre o cliente..."
                    value={newClient.notes}
                    onChange={e => setNewClient({...newClient, notes: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-outline flex justify-end gap-3">
                <GhostButton onClick={() => setIsAddModalOpen(false)}>Cancelar</GhostButton>
                <GoldButton type="submit" icon="check">Cadastrar Cliente</GoldButton>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Header da Página */}
      <div className="mb-10">
        <SectionTitle 
          title={`${clients.length} Clientes`} 
          kicker="Gestão de Carteira" 
          action={
            <div className="flex items-center gap-3">
              <GhostButton icon="download" className="hidden md:inline-flex">Exportar</GhostButton>
              <GoldButton icon="add" onClick={() => setIsAddModalOpen(true)}>Novo Cliente</GoldButton>
            </div>
          }
        />
      </div>

      {/* Filtros e Visualização */}
      <Card padded={false} className="mb-8 overflow-hidden">
        <div className="bg-surface-2/30 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-outline/60">
          <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-outline/60 shadow-sm">
            {tabs.map((t) => (
              <button
                key={t.k}
                onClick={() => setFilter(t.k)}
                className={cn(
                  "px-5 py-2 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all",
                  filter === t.k 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-primary/40 hover:text-primary hover:bg-surface-2"
                )}
              >
                {t.l} <span className={cn("ml-1", filter === t.k ? "text-secondary" : "text-primary/20")}>{t.n}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome ou doc..."
                className="w-64 pl-11 pr-4 py-2.5 rounded-full border-none bg-white text-sm font-medium focus:ring-2 focus:ring-secondary/40 shadow-sm"
              />
            </div>
            
            <div className="flex bg-white rounded-full p-1 border border-outline/60 shadow-sm">
              <button
                onClick={() => setView("lista")}
                className={cn("p-2 rounded-full transition-all", view === "lista" ? "bg-primary text-white shadow-md" : "text-primary/40")}
              >
                <Icon name="view_list" className="text-base" />
              </button>
              <button
                onClick={() => setView("grade")}
                className={cn("p-2 rounded-full transition-all", view === "grade" ? "bg-primary text-white shadow-md" : "text-primary/40")}
              >
                <Icon name="grid_view" className="text-base" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-secondary/20 border-t-secondary animate-spin" />
            <p className="text-xs font-bold uppercase tracking-widest text-primary/40">Carregando Clientes...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="person_search" className="text-4xl text-primary/20" />
            </div>
            <h3 className="text-xl font-black text-primary">Nenhum cliente encontrado</h3>
            <p className="text-on-surface-variant font-medium mt-2">Tente ajustar seus filtros ou cadastre um novo cliente.</p>
            <GoldButton icon="add" className="mt-8" onClick={() => setIsAddModalOpen(true)}>Cadastrar Primeiro Cliente</GoldButton>
          </div>
        ) : view === "lista" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-2/20 border-b border-outline/40">
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-primary/40">Cliente</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-primary/40">Documento</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-primary/40">Contato</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-primary/40 text-right">Status</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-primary/40 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/40">
                {filtered.map((c) => (
                  <tr 
                    key={c.id} 
                    className="group hover:bg-surface-2/40 transition-colors cursor-pointer"
                    onClick={() => navigate(`/adv/clientes/${c.id}`)}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <Avatar initials={c.name.substring(0, 2).toUpperCase()} tone="navy" />
                        <div>
                          <p className="font-bold text-primary group-hover:text-secondary transition-colors">{c.name}</p>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-primary/40">{c.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <code className="text-xs font-mono font-bold text-primary/60">{c.document}</code>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-medium text-primary/80">{c.email}</p>
                      <p className="text-[10px] font-bold text-primary/40 mt-0.5">{c.phone}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Pill tone={c.status === "active" ? "success" : c.status === "pending" ? "warning" : "neutral"}>
                        <StatusDot tone={c.status === "active" ? "success" : c.status === "pending" ? "warning" : "neutral"} />
                        {c.status === "active" ? "Ativo" : c.status === "pending" ? "Pendente" : "Encerrado"}
                      </Pill>
                    </td>
                    <td className="px-8 py-5">
                      <Icon name="chevron_right" className="text-primary/20 group-hover:text-secondary transition-all group-hover:translate-x-1" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
            {filtered.map((c) => (
              <Card 
                key={c.id} 
                className="hover:border-secondary/40 hover:shadow-xl transition-all cursor-pointer group p-6"
                onClick={() => navigate(`/adv/clientes/${c.id}`)}
              >
                <div className="flex items-start justify-between mb-6">
                  <Avatar initials={c.name.substring(0, 2).toUpperCase()} size="lg" tone="gold" />
                  <Pill tone={c.status === "active" ? "success" : c.status === "pending" ? "warning" : "neutral"}>
                    <StatusDot tone={c.status === "active" ? "success" : c.status === "pending" ? "warning" : "neutral"} />
                  </Pill>
                </div>
                <h4 className="text-lg font-black text-primary mb-1 group-hover:text-secondary transition-colors">{c.name}</h4>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30 mb-6">{c.type} • Desde {new Date(c.created_at).toLocaleDateString()}</p>
                
                <div className="space-y-3 pt-4 border-t border-outline/60">
                  <div className="flex items-center gap-2 text-xs font-medium text-primary/60">
                    <Icon name="mail" className="text-sm opacity-40" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-primary/60">
                    <Icon name="phone" className="text-sm opacity-40" />
                    <span>{c.phone}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
