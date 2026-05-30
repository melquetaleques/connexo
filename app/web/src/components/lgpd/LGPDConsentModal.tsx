import { useState } from "react";
import {
  Card,
  GoldButton,
  GhostButton,
  Icon,
} from "@/components/ui/connexo-primitives";
import { registerConsent } from "@/services/documents";

interface LGPDConsentModalProps {
  open: boolean;
  onClose: () => void;
  onConsent: (linkId: string) => void;
  accountantName?: string;
  linkId: string;
}

/**
 * LGPDConsentModal — Modal de consentimento LGPD que o cliente deve aceitar
 * antes de confirmar o vínculo com o contador.
 * Exibe o texto fixo, checkbox obrigatório e registra o consentimento via API.
 */
export function LGPDConsentModal({
  open,
  onClose,
  onConsent,
  accountantName = "Contador",
  linkId,
}: LGPDConsentModalProps) {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleConfirm = async () => {
    if (!accepted) return;
    setLoading(true);
    setError(null);
    try {
      await registerConsent(linkId);
      onConsent(linkId);
    } catch (err: any) {
      const msg =
        err.response?.data || "Erro ao registrar consentimento. Tente novamente.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4">
        <Card className="p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Icon name="gavel" className="text-amber-600 text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-black text-primary">
                Autorização de Acesso a Dados
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">
                Lei Geral de Proteção de Dados (LGPD)
              </p>
            </div>
          </div>

          {/* Consent text */}
          <div className="bg-surface-2 rounded-xl p-5 mb-6 border border-outline/20">
            <p className="text-sm font-medium text-primary/80 leading-relaxed">
              Ao prosseguir, autorizo{" "}
              <strong className="text-primary">{accountantName}</strong> a
              acessar meus documentos neste processo para fins contábeis,
              conforme termos de uso e política de privacidade do Connexo.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-lg border border-rose-200/60 bg-rose-50 px-4 py-3 text-rose-700 text-xs font-bold">
              {error}
            </div>
          )}

          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded-md border-2 border-outline/40 bg-white transition-all peer-checked:bg-secondary peer-checked:border-secondary peer-focus:ring-2 peer-focus:ring-secondary/30 flex items-center justify-center">
                {accepted && (
                  <Icon name="check" className="text-white text-sm" />
                )}
              </div>
            </div>
            <span className="text-xs font-bold text-primary/60 group-hover:text-primary transition-colors pt-0.5">
              Li e aceito os termos de autorização de acesso aos meus
              documentos.
            </span>
          </label>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-8">
            <GhostButton
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Voltar
            </GhostButton>
            <GoldButton
              onClick={handleConfirm}
              disabled={!accepted || loading}
              icon={loading ? "autorenew" : "check_circle"}
              className={`flex-1 ${loading ? "animate-pulse" : ""}`}
            >
              {loading ? "Registrando..." : "Confirmar e Vincular"}
            </GoldButton>
          </div>

          {/* Footer info */}
          <p className="text-[9px] font-medium text-primary/30 text-center mt-6 leading-relaxed">
            Este consentimento é registrado e armazenado para fins de
            conformidade com a LGPD. Você pode revogar o acesso a qualquer
            momento através do seu advogado.
          </p>
        </Card>
      </div>
    </div>
  );
}
