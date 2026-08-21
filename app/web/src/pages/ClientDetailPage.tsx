import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Field,
  GhostButton,
  GoldButton,
  Icon,
  PageContainer,
  Pill,
  Stat,
  StatusDot,
} from "@/components/ui/connexo-primitives";
import api from "@/services/api";
import type { Process } from "@/types";



interface Client {
  id: string;
  name: string;
  type: string;
  status: string;
  email: string;
  phone: string;
  created_at: string;
  notes: string;
}

export function ClientDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"processos" | "documentos" | "notificacoes" | "informacoes">("processos");

  const [processes, setProcesses] = useState<Process[]>([]);
  const [loadingProcesses, setLoadingProcesses] = useState(true);
  const [isNewProcessOpen, setIsNewProcessOpen] = useState(false);
  const [savingProcess, setSavingProcess] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [newProcess, setNewProcess] = useState({ number: "", type: "", court: "", stage: "" });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<Client>(`/adv/clients/${id}`);
        setClient(res.data);
      } catch (err) {
        console.error("Erro ao carregar detalhes do cliente", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const loadProcesses = async () => {
    try {
      setLoadingProcesses(true);
      const res = await api.get<Process[]>("/adv/processes");
      setProcesses((res.data || []).filter((p) => p.client_id === id));
    } catch (err) {
      console.error("Erro ao carregar processos", err);
      setProcesses([]);
    } finally {
      setLoadingProcesses(false);
    }
  };

  useEffect(() => {
    loadProcesses();
  }, [id]);

  const handleCreateProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProcess.number.trim()) {
      setProcessError("Número do processo é obrigatório.");
      return;
    }
    setSavingProcess(true);
    setProcessError(null);
    try {
      await api.post("/adv/processes", { ...newProcess, client_id: id });
      setIsNewProcessOpen(false);
      setNewProcess({ number: "", type: "", court: "", stage: "" });
      loadProcesses();
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setProcessError("Já existe um processo com este número.");
      } else if (err?.response?.status === 403) {
        setProcessError("Cliente não encontrado para este advogado.");
      } else {
        setProcessError(err?.response?.data?.error || "Erro ao criar processo. Tente novamente.");
      }
    } finally {
      setSavingProcess(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
        </div>
      </PageContainer>
    );
  }

  if (!client) {
    return (
      <PageContainer>
        <p className="text-on-surface-variant mb-4">Cliente não encontrado.</p>
        <GhostButton onClick={() => navigate("/adv/clientes")}>Voltar para clientes</GhostButton>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <button
        type="button"
        onClick={() => navigate("/adv/clientes")}
        className="text-on-surface-variant hover:text-primary mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
      >
        <Icon name="arrow_back" className="text-base" /> Voltar para clientes
      </button>

      <Card className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex flex-wrap items-start gap-5">
            <div className="bg-primary flex h-20 w-20 shrink-0 items-center justify-center rounded-lg text-2xl font-extrabold text-white">
              {client.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Pill tone={client.status === "ativo" ? "success" : client.status === "atencao" ? "warning" : "neutral"}>
                  <StatusDot tone={client.status === "ativo" ? "success" : client.status === "atencao" ? "warning" : "neutral"} />
                  {client.status === "ativo" ? "Ativo" : client.status === "atencao" ? "Requer atenção" : "Encerrado"}
                </Pill>
              </div>
              <h2 className="text-primary text-3xl font-extrabold tracking-tight">{client.name}</h2>
              <p className="text-on-surface-variant mt-1">
                {client.type} • Cliente desde {new Date(client.created_at).toLocaleDateString()}
              </p>
              <div className="text-on-surface-variant mt-4 flex flex-wrap items-center gap-5 text-sm">
                <span className="flex items-center gap-2">
                  <Icon name="mail" className="text-base" />
                  {client.email}
                </span>
                <span className="flex items-center gap-2">
                  <Icon name="call" className="text-base" />
                  {client.phone || "Não informado"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <GhostButton icon="forum" disabled title="Mensagens em desenvolvimento">Mensagens</GhostButton>
            <GoldButton icon="add" onClick={() => setIsNewProcessOpen(true)}>
              Novo processo
            </GoldButton>
          </div>
        </div>
      </Card>

      <div className="border-outline mb-6 flex items-center gap-1 overflow-x-auto border-b">
        {(
          [
            { k: "processos" as const, l: "Processos", i: "folder_open" },
            { k: "documentos" as const, l: "Documentos", i: "description" },
            { k: "notificacoes" as const, l: "Notificações", i: "notifications" },
            { k: "informacoes" as const, l: "Informações", i: "info" },
          ] as const
        ).map((t) => (
          <button
            key={t.k}
            type="button"
            onClick={() => setTab(t.k)}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-5 py-3 text-sm font-bold transition-colors duration-300 motion-reduce:transition-none ${
              tab === t.k ? "text-primary border-secondary" : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            <Icon name={t.i} className="text-base" />
            {t.l}
          </button>
        ))}
      </div>

      {tab === "processos" && (
        <Card padded={false}>
          {loadingProcesses ? (
            <div className="py-24 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full border-4 border-secondary/20 border-t-secondary animate-spin" />
            </div>
          ) : processes.length === 0 ? (
            <div className="py-12 text-center">
              <Icon name="folder_open" className="text-4xl text-on-surface-variant/30 mb-4" />
              <p className="text-primary font-bold">Nenhum processo vinculado</p>
              <p className="text-on-surface-variant text-sm mt-1">Clique em "Novo processo" para começar a gestão pericial.</p>
            </div>
          ) : (
            <div className="divide-y divide-outline/40">
              {processes.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/adv/processos/${p.id}`)}
                  className="flex items-center justify-between gap-4 px-8 py-5 cursor-pointer hover:bg-surface-2/40 transition-colors"
                >
                  <div>
                    <p className="font-bold text-primary">{p.number}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mt-0.5">
                      {p.type || "—"} {p.court && `• ${p.court}`}
                    </p>
                  </div>
                  <Icon name="chevron_right" className="text-primary/20" />
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {isNewProcessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg shadow-2xl p-0 overflow-hidden">
            <div className="bg-primary p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">Novo Processo</h3>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Vinculado a {client.name}</p>
              </div>
              <button
                onClick={() => setIsNewProcessOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <Icon name="close" />
              </button>
            </div>

            <form onSubmit={handleCreateProcess} className="p-8 space-y-5">
              {processError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm font-bold text-rose-700">
                  {processError}
                </div>
              )}
              <Field
                label="Número do Processo"
                placeholder="0000000-00.0000.0.00.0000"
                value={newProcess.number}
                onChange={(e) => setNewProcess({ ...newProcess, number: e.target.value })}
              />
              <Field
                label="Tipo"
                placeholder="Ex: Cível, Trabalhista"
                value={newProcess.type}
                onChange={(e) => setNewProcess({ ...newProcess, type: e.target.value })}
              />
              <Field
                label="Tribunal / Vara"
                placeholder="Ex: 2ª Vara Cível de São Paulo"
                value={newProcess.court}
                onChange={(e) => setNewProcess({ ...newProcess, court: e.target.value })}
              />
              <Field
                label="Fase Atual"
                placeholder="Ex: Instrução"
                value={newProcess.stage}
                onChange={(e) => setNewProcess({ ...newProcess, stage: e.target.value })}
              />
              <div className="pt-2 flex justify-end gap-3">
                <GhostButton type="button" onClick={() => setIsNewProcessOpen(false)}>
                  Cancelar
                </GhostButton>
                <GoldButton type="submit" icon={savingProcess ? "autorenew" : "check"} disabled={savingProcess}>
                  {savingProcess ? "Salvando..." : "Cadastrar Processo"}
                </GoldButton>
              </div>
            </form>
          </Card>
        </div>
      )}

      {tab === "informacoes" && (
        <Card>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Stat label="Razão social" value={client.name} />
            <Stat label="Tipo de cliente" value={client.type} />
            <Stat label="Cliente desde" value={new Date(client.created_at).toLocaleString()} />
            <Stat label="E-mail principal" value={client.email} />
            <Stat label="Telefone" value={client.phone || "—"} />
            <div className="col-span-2">
               <Stat label="Notas internas" value={client.notes || "Nenhuma observação cadastrada."} />
            </div>
          </div>
        </Card>
      )}

      {tab === "documentos" && (
        <Card>
          <div className="py-12 text-center">
             <Icon name="description" className="text-4xl text-on-surface-variant/30 mb-4" />
             <p className="text-primary font-bold">Acesse os processos para gerenciar documentos</p>
             <p className="text-on-surface-variant text-sm mt-1">Selecione um processo na aba &quot;Processos&quot; para visualizar e fazer upload de documentos e provas periciais.</p>
          </div>
        </Card>
      )}

      {tab === "notificacoes" && (
        <Card>
          <div className="py-12 text-center">
             <Icon name="notifications_off" className="text-4xl text-on-surface-variant/30 mb-4" />
             <p className="text-primary font-bold">Nenhuma notificacao</p>
             <p className="text-on-surface-variant text-sm mt-1">As notificacoes relacionadas a este cliente aparecerao aqui.</p>
          </div>
        </Card>
      )}
    </PageContainer>
  );
}

