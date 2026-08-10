import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Card,
  GoldButton,
  GhostButton,
  Icon,
  PageContainer,
  Pill,
  StatusDot,
  Stat,
  Avatar,
} from "@/components/ui/connexo-primitives";
import { DocumentManager } from "@/components/shared/DocumentManager";
import { getProcess, getProcessTimeline, type TimelineEntry } from "@/services/processes";
import { listAccountants, type AccountantCatalogItem } from "@/services/catalog";
import api from "@/services/api";
import type { Process } from "@/types";

interface ProcessLink {
  id: string;
  status: string;
}

interface LinkAccountant {
  id: string;
  name: string;
}

const LINK_STATUS_LABELS: Record<string, string> = {
  solicitado: "Solicitado",
  aceito: "Aceito",
  ativo: "Ativo",
  em_andamento: "Em Andamento",
  entregue: "Entregue",
  revisao_solicitada: "Revisão Solicitada",
  cancelamento_solicitado: "Cancelamento Solicitado",
};

export function ProcessPage() {
  const { id: _id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [process, setProcess] = useState<Process | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState<ProcessLink | null>(null);
  const [linkAccountant, setLinkAccountant] = useState<LinkAccountant | null>(null);
  const [linkLoading, setLinkLoading] = useState(true);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [accountants, setAccountants] = useState<AccountantCatalogItem[]>([]);
  const [accountantsLoading, setAccountantsLoading] = useState(false);
  const [selectedAccountantId, setSelectedAccountantId] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const refreshLink = () => {
    if (!_id) return;
    setLinkLoading(true);
    api.get(`/adv/processes/${_id}/link`)
      .then((res) => {
        setLink(res.data?.link ?? null);
        setLinkAccountant(res.data?.accountant ?? null);
      })
      .catch(() => setLink(null))
      .finally(() => setLinkLoading(false));
  };

  useEffect(() => {
    if (_id) {
      Promise.all([
        getProcess(_id),
        getProcessTimeline(_id),
      ]).then(([p, t]) => {
        setProcess(p);
        setTimeline(t);
        setLoading(false);
      }).catch(() => setLoading(false));

      refreshLink();
    }
  }, [_id]);

  useEffect(() => {
    if (isRequestModalOpen) {
      setAccountantsLoading(true);
      listAccountants()
        .then(setAccountants)
        .catch(() => setAccountants([]))
        .finally(() => setAccountantsLoading(false));
    }
  }, [isRequestModalOpen]);

  const handleRequestPericia = async () => {
    if (!_id || !selectedAccountantId) return;
    setRequesting(true);
    setRequestError(null);
    try {
      await api.post(`/adv/processes/${_id}/solicitar-pericia`, { accountant_id: selectedAccountantId });
      setIsRequestModalOpen(false);
      setSelectedAccountantId(null);
      refreshLink();
    } catch (err: any) {
      if (err?.response?.status === 422) {
        setRequestError(err.response.data?.error || "Cliente sem e-mail cadastrado.");
      } else if (err?.response?.status === 409) {
        setRequestError(err.response.data?.error || "Este processo já tem um contador vinculado.");
      } else {
        setRequestError(err?.response?.data?.error || "Erro ao solicitar perícia. Tente novamente.");
      }
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Icon name="autorenew" className="text-4xl text-secondary animate-spin" />
        </div>
      </PageContainer>
    );
  }

  if (!process) {
    return (
      <PageContainer>
        <div className="text-center py-20">
          <Icon name="error_outline" className="text-4xl text-rose-400 mb-4" />
          <p className="text-sm font-bold text-primary/30 uppercase tracking-widest">Processo não encontrado</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <Link to="/adv/clientes" className="flex items-center gap-2 text-primary/40 hover:text-primary transition-colors mb-6 group">
          <Icon name="arrow_back" className="text-xl" />
          <span className="text-xs font-bold uppercase tracking-widest">Voltar para Clientes</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Pill tone="gold" className="px-4 py-1">Processo Judicial</Pill>
              <Pill tone={process.status === "active" ? "success" : "neutral"}>
                <StatusDot tone={process.status === "active" ? "success" : "neutral"} /> {process.status === "active" ? "Ativo" : process.status}
              </Pill>
            </div>
            <h2 className="text-3xl font-black text-primary tracking-tight">{process.number}</h2>
            <p className="text-on-surface-variant font-medium mt-1">{process.court}</p>
          </div>

          {!link && (
            <div className="flex items-center gap-3">
              <GoldButton icon="history_edu" onClick={() => setIsRequestModalOpen(true)}>
                Solicitar Perícia
              </GoldButton>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal: Detalhes e Documentos */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8">
            <h3 className="text-lg font-black text-primary mb-6 flex items-center gap-2">
              <Icon name="info" className="text-secondary" />
              Informações do Processo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Stat label="Tipo de Ação" value={process.type} />
              <Stat label="Fase Atual" value={process.stage} />
              <Stat label="Data de Abertura" value={new Date(process.created_at).toLocaleDateString()} />
              <Stat label="Última Movimentação" value={new Date(process.updated_at).toLocaleDateString()} />
            </div>
            
            {process.stage && (
              <div className="mt-8 p-4 bg-surface-2 rounded-xl border border-outline/50 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                  <Icon name="gavel" className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">Fase do Processo</p>
                  <p className="text-sm text-on-surface-variant mt-1">{process.stage} — Tribunal: {process.court}</p>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-8">
            <h3 className="text-lg font-black text-primary flex items-center gap-2 mb-6">
              <Icon name="folder" className="text-secondary" />
              Documentos e Provas
            </h3>
            <DocumentManager processId={_id!} />
          </Card>
        </div>

        {/* Coluna Lateral: Contador e Timeline */}
        <div className="space-y-8">
          <Card className="p-8">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 border-b border-outline/60 pb-4">Contador Responsavel</h3>
            <div className="flex flex-col items-center text-center">
              {linkLoading ? (
                <div className="w-8 h-8 rounded-full border-4 border-secondary/20 border-t-secondary animate-spin" />
              ) : link ? (
                <>
                  <Avatar initials={(linkAccountant?.name || "CT").substring(0, 2).toUpperCase()} size="lg" tone="gold" />
                  <h4 className="mt-4 text-lg font-black text-primary">{linkAccountant?.name || "Contador"}</h4>
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest">Contador Perito Judicial</p>

                  <div className="mt-6 w-full space-y-4">
                    <div className="p-4 rounded-xl bg-surface-1 border border-outline/60 text-left">
                      <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-1">Status do Vínculo</p>
                      <Pill tone="success" className="w-full justify-center py-2">
                        {LINK_STATUS_LABELS[link.status] || link.status}
                      </Pill>
                    </div>

                    <GoldButton className="w-full" icon="visibility" onClick={() => navigate(`/adv/vinculos/${link.id}`)}>
                      Ver Vínculo
                    </GoldButton>
                  </div>
                </>
              ) : (
                <>
                  <Avatar initials="--" size="lg" tone="gold" />
                  <h4 className="mt-4 text-lg font-black text-primary">Aguardando vinculação</h4>
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest">Nenhum perito designado</p>
                  <GoldButton className="w-full mt-6" icon="history_edu" onClick={() => setIsRequestModalOpen(true)}>
                    Solicitar Perícia
                  </GoldButton>
                </>
              )}
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 border-b border-outline/60 pb-4">Histórico de Atividades</h3>
            <div className="space-y-6">
              {timeline.length > 0 ? timeline.map((log, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i < timeline.length - 1 && <div className="absolute left-[11px] top-6 w-px h-10 bg-outline/60" />}
                  <div className="w-6 h-6 rounded-full bg-surface-2 border border-outline flex items-center justify-center shrink-0 z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary">{log.action}</p>
                    <p className="text-[10px] text-primary/40 uppercase font-medium">{log.user} • {log.time}</p>
                  </div>
                </div>
              )) : (
                <p className="text-xs font-bold text-primary/30 uppercase tracking-widest text-center py-4">
                  Nenhuma atividade registrada
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg shadow-2xl p-0 overflow-hidden">
            <div className="bg-primary p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">Solicitar Perícia</h3>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Escolha um perito para {process.number}</p>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4">
              {requestError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm font-bold text-rose-700">
                  {requestError}
                </div>
              )}

              {accountantsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 rounded-full border-4 border-secondary/20 border-t-secondary animate-spin" />
                </div>
              ) : accountants.length === 0 ? (
                <p className="text-sm font-bold text-primary/40 text-center py-8">Nenhum contador disponível no catálogo.</p>
              ) : (
                accountants.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedAccountantId(acc.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-4 transition-all ${
                      selectedAccountantId === acc.id ? "border-secondary bg-secondary/5" : "border-outline/30 hover:border-secondary/40"
                    }`}
                  >
                    <Avatar initials={acc.name.substring(0, 2).toUpperCase()} tone="navy" />
                    <div className="flex-1">
                      <p className="text-sm font-black text-primary">{acc.name}</p>
                      <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">{acc.city}, {acc.state}</p>
                    </div>
                    {selectedAccountantId === acc.id && <Icon name="check_circle" className="text-secondary" />}
                  </div>
                ))
              )}
            </div>

            <div className="p-8 bg-[#F9FAFB] flex gap-4">
              <GhostButton className="flex-1 py-4" onClick={() => setIsRequestModalOpen(false)}>Cancelar</GhostButton>
              <GoldButton
                className="flex-[2] py-4"
                disabled={!selectedAccountantId || requesting}
                icon={requesting ? "autorenew" : "check"}
                onClick={handleRequestPericia}
              >
                {requesting ? "Enviando..." : "Confirmar Solicitação"}
              </GoldButton>
            </div>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
