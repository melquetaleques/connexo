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
  Avatar,
} from "@/components/ui/connexo-primitives";
import api from "@/services/api";

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

const STATUS_LABELS_SHORT: Record<string, string> = {
  solicitado: "Solicitado",
  aceito: "Aceito",
  recusado: "Recusado",
  ativo: "Em andamento",
  em_andamento: "Em andamento",
  entregue: "Entregue",
  concluido: "Concluído",
  revisao_solicitada: "Em andamento",
  cancelamento_solicitado: "Cancelamento solicitado",
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

export function AccountantProcessDetail() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [events, setEvents] = useState<ProcessEvent[]>([]);
  const [client, setClient] = useState<UserData | null>(null);
  const [accountant, setAccountant] = useState<UserData | null>(null);

  // Formulário de entrega
  const [showForm, setShowForm] = useState(false);
  const [contentText, setContentText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/acc/links/${id}`);
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

  const handleTransition = async (newStatus: string) => {
    try {
      await api.post(`/acc/links/${id}/status`, { status: newStatus });
      loadData();
    } catch (err: any) {
      alert(err.response?.data || "Erro ao atualizar status");
    }
  };

  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentText && !file) {
      setError("É necessário fornecer um texto ou um arquivo");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("content_text", contentText);
      if (file) {
        formData.append("file", file);
      }
      await api.post(`/acc/links/${id}/entregas`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowForm(false);
      setContentText("");
      setFile(null);
      loadData();
    } catch (err: any) {
      setError(err.response?.data || "Erro ao submeter entregável");
    } finally {
      setSubmitting(false);
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
  const canStart = statusKey === "aceito";
  const canProgress = statusKey === "ativo";
  const canDeliver = statusKey === "em_andamento" || statusKey === "revisao_solicitada";

  return (
    <PageContainer>
      <Link to="/cnt/processos" className="flex items-center gap-2 text-primary/40 hover:text-primary transition-colors mb-6 group">
        <Icon name="arrow_back" className="text-xl" />
        <span className="text-xs font-bold uppercase tracking-widest">Voltar para Perícias Ativas</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-primary tracking-tight">
            Detalhes do Serviço
          </h2>
          <p className="text-on-surface-variant font-medium mt-1">
            Cliente: {client?.name || "Cliente"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Pill tone={STATUS_TONES[statusKey] || "neutral"}>
            <StatusDot tone={STATUS_TONES[statusKey] || "neutral"} /> {STATUS_LABELS[statusKey] || statusKey}
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
              Ações do Contador
            </h3>
            <div className="flex flex-wrap gap-4">
              {canStart && (
                <GoldButton icon="play_arrow" onClick={() => handleTransition("ativo")}>
                  Iniciar Serviço
                </GoldButton>
              )}
              {canProgress && (
                <GoldButton icon="trending_up" onClick={() => handleTransition("em_andamento")}>
                  Marcar como Em Andamento
                </GoldButton>
              )}
              {canDeliver && !showForm && (
                <GoldButton icon="upload_file" onClick={() => setShowForm(true)}>
                  Entregar Serviço
                </GoldButton>
              )}
              {canDeliver && (
                <GhostButton icon="history" onClick={() => handleTransition("entregue")}>
                  Marcar como Entregue
                </GhostButton>
              )}
            </div>

            {/* Delivery form */}
            {showForm && (
              <form onSubmit={handleSubmitDeliverable} className="mt-6 p-6 bg-surface-2 rounded-xl border border-outline/60 space-y-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Nova Entrega</h4>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">
                    Texto / Descrição
                  </label>
                  <textarea
                    value={contentText}
                    onChange={(e) => setContentText(e.target.value)}
                    rows={4}
                    placeholder="Descreva o que foi entregue..."
                    className="w-full rounded-lg border border-outline/60 bg-white px-4 py-3 text-sm font-medium text-primary focus:ring-2 focus:ring-secondary/40 outline-none transition-all"
                    disabled={submitting}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">
                    Arquivo (opcional)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:text-xs file:font-bold hover:file:bg-primary/80"
                    disabled={submitting}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <GhostButton onClick={() => { setShowForm(false); setError(null); }} type="button" disabled={submitting}>
                    Cancelar
                  </GhostButton>
                  <GoldButton type="submit" disabled={submitting}>
                    {submitting ? (
                      <><Icon name="autorenew" className="text-base animate-spin" /> Enviando...</>
                    ) : (
                      <><Icon name="check" className="text-base" /> Entregar</>
                    )}
                  </GoldButton>
                </div>
              </form>
            )}
          </Card>

          {/* Reviews feedback */}
          {deliverables.filter(d => d.review_comment).length > 0 && (
            <Card className="p-8">
              <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 border-b border-outline/60 pb-4">
                Feedback de Revisão
              </h3>
              <div className="space-y-4">
                {deliverables.filter(d => d.review_comment).map(d => (
                  <div key={d.id} className="p-4 rounded-xl border border-amber-100 bg-amber-50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-amber-800 uppercase">Revisão Solicitada</p>
                      <p className="text-[10px] text-amber-600">{new Date(d.reviewed_at || d.submitted_at).toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-amber-900">{d.review_comment}</p>
                    {d.content_text && (
                      <div className="mt-2 p-2 rounded bg-white/50">
                        <p className="text-[10px] font-bold text-primary/40 uppercase mb-1">Sua entrega original</p>
                        <p className="text-xs text-primary/70">{d.content_text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Client info */}
          <Card className="p-8">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 border-b border-outline/60 pb-4">
              Cliente
            </h3>
            <div className="flex flex-col items-center text-center">
              <Avatar initials={(client?.name || "CL").substring(0, 2).toUpperCase()} size="lg" tone="gold" />
              <h4 className="mt-4 text-lg font-black text-primary">{client?.name || "Cliente"}</h4>
              <p className="text-xs font-bold text-secondary uppercase tracking-widest">{client?.email || ""}</p>
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
                        {ev.event_type === "mudanca_estado_vinculo" ? "Mudança de Estado" : ev.event_type}
                      </p>
                      <p className="text-[10px] text-primary/40 uppercase font-medium">
                        {ev.actor_role} &bull; {new Date(ev.created_at).toLocaleString()}
                      </p>
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
