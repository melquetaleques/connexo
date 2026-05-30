import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  GhostButton,
  GoldButton,
  Icon,
  PageContainer,
  Pill,
  StatusDot,
  SectionTitle,
  Avatar,
} from "@/components/ui/connexo-primitives";
import api from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

interface Deliverable {
  id: string;
  link_id: string;
  submitted_by: string;
  content_text: string;
  file_name: string;
  file_size: number;
  status: string;
  review_comment: string;
  submitted_at: string;
  reviewed_at: string | null;
  created_at: string;
}

interface ProcessEvent {
  id: string;
  process_id: string;
  event_type: string;
  actor_id: string;
  actor_role: string;
  metadata: any;
  created_at: string;
}

interface LinkData {
  id: string;
  client_id: string;
  accountant_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

const STATUS_LABELS: Record<string, string> = {
  solicitado: "Solicitado",
  aceito: "Aceito",
  recusado: "Recusado",
  ativo: "Ativo",
  em_andamento: "Em Andamento",
  entregue: "Entregue",
  concluido: "Concluído",
  revisao_solicitada: "Revisão Solicitada",
  cancelamento_solicitado: "Cancelamento Solicitado",
  cancelado: "Cancelado",
};

const STATUS_TONES: Record<string, "neutral" | "success" | "warning"> = {
  solicitado: "neutral",
  aceito: "success",
  recusado: "warning",
  ativo: "success",
  em_andamento: "neutral",
  entregue: "success",
  concluido: "success",
  revisao_solicitada: "warning",
  cancelamento_solicitado: "warning",
  cancelado: "warning",
};

const EVENT_LABELS: Record<string, string> = {
  mudanca_estado_vinculo: "Mudança de Estado do Vínculo",
  entrega_submetida: "Entregável Submetido",
  revisao_solicitada: "Revisão Solicitada",
};

export function LawyerProcessDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [events, setEvents] = useState<ProcessEvent[]>([]);
  const [client, setClient] = useState<UserData | null>(null);
  const [accountant, setAccountant] = useState<UserData | null>(null);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/adv/links/${id}`);
      const data = res.data;
      setLinkData(data.link);
      setDeliverables(data.deliverables || []);
      setEvents(data.process_events || []);
      setClient(data.client || null);
      setAccountant(data.accountant || null);
    } catch (err: any) {
      setError(err.response?.data || "Erro ao carregar dados do vínculo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleApprove = async (deliverableId: string) => {
    try {
      await api.put(`/adv/links/${id}/entregas/${deliverableId}/aprovar`);
      loadData();
    } catch (err: any) {
      alert(err.response?.data || "Erro ao aprovar entregável");
    }
  };

  const handleRequestReview = async (deliverableId: string) => {
    const comment = prompt("Comentário de revisão (obrigatório):");
    if (!comment || comment.trim() === "") return;
    try {
      await api.put(`/adv/links/${id}/entregas/${deliverableId}/revisar`, {
        review_comment: comment,
      });
      loadData();
    } catch (err: any) {
      alert(err.response?.data || "Erro ao solicitar revisão");
    }
  };

  const handleCancelRequest = async () => {
    if (!confirm("Tem certeza que deseja solicitar o cancelamento deste vínculo?")) return;
    try {
      await api.post(`/adv/links/${id}/cancelar`);
      loadData();
    } catch (err: any) {
      alert(err.response?.data || "Erro ao solicitar cancelamento");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary/20 border-t-secondary" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/40">Carregando Detalhes do Vínculo...</p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="rounded-lg border border-rose-200/60 bg-rose-50 px-6 py-4 text-rose-700 text-sm font-bold mt-8">
          {error}
        </div>
      </PageContainer>
    );
  }

  if (!linkData) {
    return (
      <PageContainer>
        <div className="py-20 text-center">
          <Icon name="link_off" className="text-5xl text-primary/20 mb-4" />
          <h3 className="text-xl font-black text-primary">Vínculo não encontrado</h3>
        </div>
      </PageContainer>
    );
  }

  const statusKey = linkData.status;
  const statusLabel = STATUS_LABELS[statusKey] || statusKey;
  const statusTone = STATUS_TONES[statusKey] || "neutral";
  const canApprove = statusKey === "entregue";
  const canCancel = !["concluido", "cancelado", "recusado"].includes(statusKey);

  return (
    <PageContainer>
      {/* Back link */}
      <Link to="/adv/clientes" className="flex items-center gap-2 text-primary/40 hover:text-primary transition-colors mb-6 group">
        <Icon name="arrow_back" className="text-xl" />
        <span className="text-xs font-bold uppercase tracking-widest">Voltar para Clientes</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-primary tracking-tight">
            Detalhes do Vínculo
          </h2>
          <p className="text-on-surface-variant font-medium mt-1">
            {client?.name || "Cliente"} &mdash; {accountant?.name || "Contador"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Pill tone={statusTone}>
            <StatusDot tone={statusTone} /> {statusLabel}
          </Pill>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-rose-200/60 bg-rose-50 px-4 py-3 text-rose-700 text-xs font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Actions */}
          <Card className="p-8">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 border-b border-outline/60 pb-4">
              Ações
            </h3>
            <div className="flex flex-wrap gap-4">
              {canApprove && (
                <>
                  <GoldButton icon="check_circle" onClick={() => {
                    if (deliverables.length > 0) {
                      handleApprove(deliverables[0].id);
                    }
                  }}>
                    Aprovar Última Entrega
                  </GoldButton>
                  <GhostButton icon="rate_review" onClick={() => {
                    if (deliverables.length > 0) {
                      handleRequestReview(deliverables[0].id);
                    }
                  }}>
                    Solicitar Revisão
                  </GhostButton>
                </>
              )}
              {canCancel && (
                <GhostButton icon="cancel" onClick={handleCancelRequest} tone="danger">
                  Solicitar Cancelamento
                </GhostButton>
              )}
            </div>
          </Card>

          {/* Deliverables */}
          <Card className="p-0 overflow-hidden">
            <div className="p-8 border-b border-outline/60 flex items-center justify-between">
              <h3 className="text-lg font-black text-primary flex items-center gap-2">
                <Icon name="folder" className="text-secondary" />
                Entregáveis
              </h3>
            </div>
            {deliverables.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">
                  Nenhum entregável ainda
                </p>
              </div>
            ) : (
              <div className="divide-y divide-outline/40">
                {deliverables.map((d) => (
                  <div key={d.id} className="p-8 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-primary">{d.status === "aprovado" ? "Aprovado" : d.status === "revisao_solicitada" ? "Revisão Solicitada" : d.status}</p>
                        <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mt-1">
                          {new Date(d.submitted_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {d.status === "entregue" && (
                          <>
                            <GhostButton icon="check_circle" onClick={() => handleApprove(d.id)}>
                              Aprovar
                            </GhostButton>
                            <GhostButton icon="rate_review" onClick={() => handleRequestReview(d.id)}>
                              Revisar
                            </GhostButton>
                          </>
                        )}
                      </div>
                    </div>
                    {d.content_text && (
                      <p className="text-sm text-on-surface-variant bg-surface-2 p-4 rounded-xl">{d.content_text}</p>
                    )}
                    {d.file_name && (
                      <div className="flex items-center gap-3 text-sm text-primary/60">
                        <Icon name="description" />
                        <span className="font-medium">{d.file_name}</span>
                        <span className="text-[10px] text-primary/30">{(d.file_size / 1024).toFixed(1)} KB</span>
                      </div>
                    )}
                    {d.review_comment && (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                        <p className="text-[10px] font-bold uppercase text-amber-700 mb-1">Comentário de Revisão</p>
                        <p className="text-sm text-amber-800">{d.review_comment}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Accountant info */}
          <Card className="p-8">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 border-b border-outline/60 pb-4">
              Contador Vinculado
            </h3>
            <div className="flex flex-col items-center text-center">
              <Avatar initials={(accountant?.name || "CT").substring(0, 2).toUpperCase()} size="lg" tone="gold" />
              <h4 className="mt-4 text-lg font-black text-primary">{accountant?.name || "Contador"}</h4>
              <p className="text-xs font-bold text-secondary uppercase tracking-widest">{accountant?.email || ""}</p>
              <div className="mt-6 w-full">
                <Pill tone={statusTone} className="w-full justify-center py-2">{statusLabel}</Pill>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-8">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 border-b border-outline/60 pb-4">
              Timeline
            </h3>
            <div className="space-y-6">
              {events.length === 0 ? (
                <p className="text-xs font-medium text-primary/40 text-center">Nenhum evento registrado</p>
              ) : (
                events.map((ev, i) => (
                  <div key={ev.id} className="flex gap-4 relative">
                    {i < events.length - 1 && (
                      <div className="absolute left-[11px] top-6 w-px h-10 bg-outline/60" />
                    )}
                    <div className="w-6 h-6 rounded-full bg-surface-2 border border-outline flex items-center justify-center shrink-0 z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">
                        {EVENT_LABELS[ev.event_type] || ev.event_type}
                      </p>
                      <p className="text-[10px] text-primary/40 uppercase font-medium">
                        {ev.actor_role} &bull; {new Date(ev.created_at).toLocaleString()}
                      </p>
                      {ev.metadata && (
                        <p className="text-[10px] text-primary/30 mt-1">
                          {ev.metadata.from_status} &rarr; {ev.metadata.to_status}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
