import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  Icon,
  PageContainer,
  Pill,
  StatusDot,
  Avatar,
  GoldButton,
} from "@/components/ui/connexo-primitives";
import api from "@/services/api";
import { createReview, checkReviewStatus } from "@/services/accountant";
import type { ReviewData } from "@/services/accountant";

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

export function ClientProcessDetail() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [events, setEvents] = useState<ProcessEvent[]>([]);
  const [accountant, setAccountant] = useState<UserData | null>(null);

  // Review state
  const [existingReview, setExistingReview] = useState<ReviewData | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await api.get(`/cli/links/${id}`);
        const data = res.data;
        setLinkData(data.link);
        setDeliverables(data.deliverables || []);
        setEvents(data.process_events || []);
        setAccountant(data.accountant || null);

        // Check if there's an existing review for concluded links
        if (data.link?.status === "concluido") {
          try {
            setReviewLoading(true);
            const reviewStatus = await checkReviewStatus(id);
            setExistingReview(reviewStatus.review);
            if (reviewStatus.has_review) {
              setRating(reviewStatus.review?.rating || 0);
              setComment(reviewStatus.review?.comment || "");
            }
          } catch {
            // Non-critical — review check may fail silently
          } finally {
            setReviewLoading(false);
          }
        }
      } catch (err: any) {
        setError(err.response?.data || "Erro ao carregar dados do vínculo");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary/20 border-t-secondary" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/40">Carregando Detalhes do Serviço...</p>
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

  return (
    <PageContainer>
      <Link to="/cli/processos" className="flex items-center gap-2 text-primary/40 hover:text-primary transition-colors mb-6 group">
        <Icon name="arrow_back" className="text-xl" />
        <span className="text-xs font-bold uppercase tracking-widest">Voltar para Processos</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-primary tracking-tight">
            Acompanhamento do Serviço
          </h2>
          <p className="text-on-surface-variant font-medium mt-1">
            Status atual do vínculo com seu contador
          </p>
        </div>
        <Pill tone={STATUS_TONES[statusKey] || "neutral"}>
          <StatusDot tone={STATUS_TONES[statusKey] || "neutral"} /> {STATUS_LABELS[statusKey] || statusKey}
        </Pill>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Deliverables (read-only) */}
          <Card className="p-0 overflow-hidden">
            <div className="p-8 border-b border-outline/60">
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
                  <div key={d.id} className="p-8 space-y-3">
                    <div className="flex items-center gap-3">
                      <Pill tone={d.status === "aprovado" ? "success" : d.status === "revisao_solicitada" ? "warning" : "neutral"}>
                        {d.status === "aprovado" ? "Aprovado" : d.status === "revisao_solicitada" ? "Revisão" : "Entregue"}
                      </Pill>
                      <span className="text-[10px] text-primary/40 font-bold uppercase tracking-wider">
                        {new Date(d.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                    {d.content_text && (
                      <p className="text-sm text-on-surface-variant">{d.content_text}</p>
                    )}
                    {d.file_name && (
                      <div className="flex items-center gap-2 text-sm text-primary/60">
                        <Icon name="description" />
                        <span className="font-medium">{d.file_name}</span>
                      </div>
                    )}
                    {d.review_comment && (
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                        <p className="text-[10px] font-bold uppercase text-amber-700 mb-1">Comentário</p>
                        <p className="text-sm text-amber-800">{d.review_comment}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Timeline */}
          <Card className="p-8">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 border-b border-outline/60 pb-4 flex items-center gap-2">
              <Icon name="history" className="text-secondary" />
              Timeline do Serviço
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
                        {new Date(ev.created_at).toLocaleString()}
                      </p>
                      {ev.metadata && (
                        <p className="text-[10px] text-primary/30 mt-1">
                          De <strong>{ev.metadata.from_status}</strong> para <strong>{ev.metadata.to_status}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
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
              <div className="mt-6 w-full p-4 rounded-xl bg-surface-1 border border-outline/60">
                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-2">Status do Serviço</p>
                <Pill tone={STATUS_TONES[statusKey] || "neutral"} className="w-full justify-center py-2">
                  {STATUS_LABELS[statusKey] || statusKey}
                </Pill>
              </div>
            </div>
          </Card>

          {/* Review section — only when concluded */}
          {statusKey === "concluido" && (
            <ReviewCard
              existingReview={existingReview}
              reviewLoading={reviewLoading}
              reviewError={reviewError}
              reviewSuccess={reviewSuccess}
              rating={rating}
              comment={comment}
              submitting={submitting}
              setRating={setRating}
              setComment={setComment}
              setReviewError={setReviewError}
              setReviewSuccess={setReviewSuccess}
              setSubmitting={setSubmitting}
              setExistingReview={setExistingReview}
              linkId={id!}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}

// ---------------------------------------------------------------------------
// ReviewCard — Formulário de avaliação para vínculos concluídos
// ---------------------------------------------------------------------------

interface ReviewCardProps {
  existingReview: ReviewData | null;
  reviewLoading: boolean;
  reviewError: string | null;
  reviewSuccess: boolean;
  rating: number;
  comment: string;
  submitting: boolean;
  setRating: (v: number) => void;
  setComment: (v: string) => void;
  setReviewError: (v: string | null) => void;
  setReviewSuccess: (v: boolean) => void;
  setSubmitting: (v: boolean) => void;
  setExistingReview: (v: ReviewData | null) => void;
  linkId: string;
}

function ReviewCard({
  existingReview,
  reviewLoading,
  reviewError,
  reviewSuccess,
  rating,
  comment,
  submitting,
  setRating,
  setComment,
  setReviewError,
  setReviewSuccess,
  setSubmitting,
  setExistingReview,
  linkId,
}: ReviewCardProps) {
  // Auto-dismiss success banner after 6 seconds
  useEffect(() => {
    if (reviewSuccess) {
      const timer = setTimeout(() => setReviewSuccess(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [reviewSuccess, setReviewSuccess]);

  // Show spinner while checking review status
  if (reviewLoading && !existingReview) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center py-6 gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-secondary/20 border-t-secondary" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
            Verificando avaliação...
          </p>
        </div>
      </Card>
    );
  }

  // Already reviewed — show existing review
  if (existingReview) {
    return (
      <Card className="p-8">
        <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 border-b border-outline/60 pb-4 flex items-center gap-2">
          <Icon name="star" className="text-amber-500" />
          Sua Avaliação
        </h3>
        <div className="space-y-3">
          {/* Stars */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Icon
                key={s}
                name={s <= existingReview.rating ? "star" : "star_outline"}
                className={
                  s <= existingReview.rating
                    ? "text-amber-500 text-lg"
                    : "text-primary/20 text-lg"
                }
              />
            ))}
          </div>
          {/* Comment */}
          {existingReview.comment && (
            <p className="text-sm font-medium text-primary/80">
              {existingReview.comment}
            </p>
          )}
          {/* Date */}
          <p className="text-[10px] font-bold text-primary/30 uppercase tracking-wider">
            {new Date(existingReview.submitted_at).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </Card>
    );
  }

  // --- Formulário de avaliação ---
  const handleSubmit = async () => {
    if (rating < 1) {
      setReviewError("Selecione pelo menos 1 estrela.");
      return;
    }
    setReviewError(null);
    setSubmitting(true);
    try {
      const result = await createReview({
        link_id: linkId,
        rating,
        comment,
      });
      setExistingReview(result.review);
      setReviewSuccess(true);
    } catch (err: any) {
      const msg =
        err.response?.data || "Erro ao enviar avaliação. Tente novamente.";
      setReviewError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-8">
      <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 border-b border-outline/60 pb-4 flex items-center gap-2">
        <Icon name="star" className="text-amber-500" />
        Avaliar Serviço
      </h3>

      {/* Loading spinner while submitting */}
      {submitting && (
        <div className="flex items-center justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-secondary/20 border-t-secondary" />
        </div>
      )}

      {/* Error banner */}
      {reviewError && !submitting && (
        <div className="rounded-lg border border-rose-200/60 bg-rose-50 px-4 py-3 text-rose-700 text-xs font-bold mb-4">
          {reviewError}
        </div>
      )}

      {/* Success banner */}
      {reviewSuccess && !submitting && (
        <div className="rounded-lg border border-emerald-200/60 bg-emerald-50 px-4 py-3 text-emerald-700 text-xs font-bold mb-4">
          Avaliação enviada com sucesso! Obrigado pelo seu feedback.
        </div>
      )}

      {/* Form (hidden while submitting) */}
      {!submitting && !reviewSuccess && (
        <div className="space-y-5">
          {/* Star selector */}
          <div>
            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-2">
              Nota
            </p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  disabled={submitting}
                >
                  <Icon
                    name={s <= rating ? "star" : "star_outline"}
                    className={
                      s <= rating
                        ? "text-amber-500 text-2xl"
                        : "text-primary/20 text-2xl hover:text-amber-400/60"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment (optional) */}
          <div>
            <label className="block text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-2">
              Comentário <span className="text-primary/20">(opcional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte sua experiência com este contador..."
              rows={3}
              maxLength={500}
              className="w-full rounded-xl border border-outline/30 bg-surface-2 p-3 text-sm font-medium text-primary placeholder:text-primary/20 focus:outline-none focus:ring-2 focus:ring-secondary/40 resize-none"
              disabled={submitting}
            />
            <p className="text-[10px] text-primary/20 text-right mt-1">
              {comment.length}/500
            </p>
          </div>

          {/* Submit button */}
          <GoldButton
            onClick={handleSubmit}
            disabled={rating < 1 || submitting}
            icon="send"
            className="w-full"
          >
            Enviar Avaliação
          </GoldButton>
        </div>
      )}
    </Card>
  );
}
