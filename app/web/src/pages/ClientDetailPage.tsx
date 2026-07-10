import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  GhostButton,
  GoldButton,
  Icon,
  PageContainer,
  Pill,
  Stat,
  StatusDot,
} from "@/components/ui/connexo-primitives";
import api from "@/services/api";

const ACCENT = "#C59D5C";

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
            <GhostButton icon="forum">Mensagens</GhostButton>
            <GoldButton icon="add" accent={ACCENT}>
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
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
              tab === t.k ? "text-primary" : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
            style={tab === t.k ? { borderColor: ACCENT, color: "#000830" } : {}}
          >
            <Icon name={t.i} className="text-base" />
            {t.l}
          </button>
        ))}
      </div>

      {tab === "processos" && (
        <Card padded={false}>
          <div className="py-12 text-center">
             <Icon name="folder_open" className="text-4xl text-on-surface-variant/30 mb-4" />
             <p className="text-primary font-bold">Nenhum processo vinculado</p>
             <p className="text-on-surface-variant text-sm mt-1">Clique em "Novo processo" para começar a gestão pericial.</p>
          </div>
        </Card>
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

