import { useState } from "react";
import {
  Card,
  GoldButton,
  GhostButton,
  Icon,
  Field,
} from "@/components/ui/connexo-primitives";
import { requestDocument } from "@/services/documents";

interface SolicitarDocModalProps {
  open: boolean;
  onClose: () => void;
  processId: string;
  clientId: string;
  clientName?: string;
}

/**
 * SolicitarDocModal — Modal para advogado solicitar um documento ao cliente.
 */
export function SolicitarDocModal({
  open,
  onClose,
  processId,
  clientId,
  clientName = "Cliente",
}: SolicitarDocModalProps) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await requestDocument(processId, {
        description: description.trim(),
        client_id: clientId,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setDescription("");
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      const msg =
        err.response?.data || "Erro ao solicitar documento. Tente novamente.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4">
        <Card className="p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Icon name="description" className="text-secondary text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-black text-primary">
                Solicitar Documento
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">
                Para: {clientName}
              </p>
            </div>
          </div>

          {/* Success */}
          {success && (
            <div className="mb-4 rounded-lg border border-emerald-200/60 bg-emerald-50 px-4 py-3 text-emerald-700 text-xs font-bold">
              Solicitação enviada com sucesso!
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg border border-rose-200/60 bg-rose-50 px-4 py-3 text-rose-700 text-xs font-bold">
              {error}
            </div>
          )}

          {/* Form */}
          {!success && (
            <div className="space-y-5">
              <Field
                label="Descrição do Documento"
                placeholder="Ex: Cópia autenticada do contrato social, extratos bancários dos últimos 3 meses..."
                value={description}
                onChange={(e: any) => setDescription(e.target.value)}
                as="textarea"
                rows={4}
              />

              <div className="flex items-center gap-3 pt-2">
                <GhostButton
                  onClick={() => {
                    onClose();
                    setDescription("");
                    setError(null);
                  }}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancelar
                </GhostButton>
                <GoldButton
                  onClick={handleSubmit}
                  disabled={!description.trim() || loading}
                  icon={loading ? "autorenew" : "send"}
                  className={`flex-1 ${loading ? "animate-pulse" : ""}`}
                >
                  {loading ? "Enviando..." : "Solicitar"}
                </GoldButton>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
