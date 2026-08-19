import { useState, useEffect } from "react";
import { Card, GoldButton, GhostButton, Icon, Pill } from "@/components/ui/connexo-primitives";
import { listMyProcesses, bindAccountantToProcess, ClientProcess } from "@/services/client";
import { apiErrorMessage } from "@/lib/utils";

interface BindProcessModalProps {
  accountant: { id: string; name: string };
  onClose: () => void;
  onSuccess: () => void;
}

export function BindProcessModal({ accountant, onClose, onSuccess }: BindProcessModalProps) {
  const [processes, setProcesses] = useState<ClientProcess[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await listMyProcesses();
        // Filtrar apenas processos que ainda NÃO têm contador vinculado
        setProcesses(data.filter(p => !p.accountant_id));
      } catch (error) {
        console.error("Erro ao carregar processos:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleConfirm = async () => {
    if (!selectedId) return;
    setSubmitting(true);
    setError(null);
    try {
      await bindAccountantToProcess(selectedId, accountant.id);
      onSuccess();
    } catch (err) {
      console.error("Erro ao vincular contador:", err);
      setError(apiErrorMessage(err, "Erro ao realizar o vínculo. Tente novamente."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Modal */}
      <Card className="relative z-10 w-full max-w-xl bg-white shadow-2xl rounded-[32px] overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-outline/30 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-primary tracking-tight">Vincular Perito ao Processo</h3>
            <p className="text-sm text-primary/40 font-bold uppercase tracking-widest mt-1">
              Contratando: <span className="text-secondary">{accountant.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-surface-2 flex items-center justify-center transition-colors">
            <Icon name="close" className="text-xl" />
          </button>
        </div>

        <div className="p-8 max-h-[60vh] overflow-y-auto">
          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 text-xs font-bold">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Icon name="autorenew" className="text-3xl text-secondary animate-spin mb-3" />
              <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest">Buscando seus processos...</p>
            </div>
          ) : processes.length > 0 ? (
            <div className="space-y-4">
              <p className="text-xs font-bold text-primary/60 uppercase tracking-wider mb-2">Selecione o processo para este perito:</p>
              {processes.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    selectedId === p.id 
                    ? "border-secondary bg-secondary/5 shadow-md" 
                    : "border-outline/30 hover:border-secondary/40 bg-white"
                  }`}
                >
                  <div>
                    <p className="text-sm font-black text-primary mb-1">{p.number}</p>
                    <div className="flex items-center gap-2">
                      <Pill tone="navy" className="text-[9px]">{p.type}</Pill>
                      <span className="text-[10px] text-primary/40 font-bold uppercase tracking-widest">{p.court}</span>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedId === p.id ? "bg-secondary border-secondary" : "border-outline/50"
                  }`}>
                    {selectedId === p.id && <Icon name="check" className="text-white text-[14px] font-black" />}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-surface-2 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="assignment_late" className="text-2xl text-primary/20" />
              </div>
              <p className="text-sm font-bold text-primary/60">Você não possui processos disponíveis para vínculo no momento.</p>
            </div>
          )}
        </div>

        <div className="p-8 bg-[#F9FAFB] flex gap-4">
          <GhostButton className="flex-1 py-4" onClick={onClose}>Cancelar</GhostButton>
          <GoldButton 
            className="flex-[2] py-4" 
            disabled={!selectedId || submitting}
            icon={submitting ? "autorenew" : "check"}
            onClick={handleConfirm}
          >
            {submitting ? "Processando..." : "Confirmar Vínculo"}
          </GoldButton>
        </div>
      </Card>
    </div>
  );
}
