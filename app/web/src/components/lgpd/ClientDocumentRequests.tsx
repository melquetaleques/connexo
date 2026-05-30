import { useState, useEffect } from "react";
import {
  Card,
  GoldButton,
  GhostButton,
  Icon,
  Pill,
} from "@/components/ui/connexo-primitives";
import { listClientDocumentRequests } from "@/services/documents";
import type { DocumentRequest } from "@/services/documents";

/**
 * ClientDocumentRequests — Lista de solicitações de documento para o cliente.
 * Exibe solicitações pendentes do advogado com botão para enviar documento.
 */
export function ClientDocumentRequests() {
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listClientDocumentRequests();
      setRequests(data.requests || []);
    } catch (err: any) {
      setError(
        err.response?.data || "Erro ao carregar solicitações de documentos",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const statusLabel = (status: string) => {
    switch (status) {
      case "pendente":
        return { label: "Pendente", tone: "warning" as const };
      case "atendido":
        return { label: "Atendido", tone: "success" as const };
      case "cancelado":
        return { label: "Cancelado", tone: "neutral" as const };
      default:
        return { label: status, tone: "neutral" as const };
    }
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center gap-3 py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-secondary/20 border-t-secondary" />
          <p className="text-xs font-bold uppercase tracking-widest text-primary/40">
            Carregando solicitações...
          </p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="rounded-lg border border-rose-200/60 bg-rose-50 px-4 py-3 text-rose-700 text-xs font-bold">
          {error}
        </div>
        <GhostButton onClick={loadRequests} className="mt-4">
          Tentar Novamente
        </GhostButton>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="p-8">
        <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 border-b border-outline/60 pb-4 flex items-center gap-2">
          <Icon name="description" className="text-secondary" />
          Solicitações de Documentos
        </h3>
        <div className="rounded-xl border-2 border-dashed border-outline/30 bg-surface-2 p-8 text-center">
          <Icon name="inbox" className="text-4xl text-primary/20 mb-3" />
          <p className="text-xs font-bold text-primary/30 uppercase tracking-widest">
            Nenhuma solicitação pendente
          </p>
          <p className="text-[10px] font-medium text-primary/20 mt-2">
            Quando seu advogado solicitar documentos, eles aparecerão aqui.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 border-b border-outline/60 pb-4 flex items-center gap-2">
        <Icon name="description" className="text-secondary" />
        Solicitações de Documentos
      </h3>

      <div className="space-y-4">
        {requests.map((req) => {
          const sl = statusLabel(req.status);
          return (
            <div
              key={req.id}
              className={`rounded-xl border p-5 transition-all ${
                req.status === "pendente"
                  ? "border-amber-200 bg-amber-50/50"
                  : "border-outline/30 bg-surface-2"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-primary mb-1">
                    {req.description}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-primary/40 uppercase tracking-wider">
                    <Pill tone={sl.tone} className="text-[9px] px-2 py-0.5">
                      {sl.label}
                    </Pill>
                    <span>
                      {new Date(req.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>

                {req.status === "pendente" && (
                  <GoldButton
                    icon="upload_file"
                    className="text-xs py-2 px-3 shrink-0"
                    onClick={() => {
                      // Navega para o upload de documento
                      // Idealmente redireciona para a página do processo com modal de upload
                      alert(
                        "Faça o upload do documento na página do processo.",
                      );
                    }}
                  >
                    Enviar Documento
                  </GoldButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
