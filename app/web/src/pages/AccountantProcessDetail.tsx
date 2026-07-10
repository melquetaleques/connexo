import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageContainer, Card, Icon, SectionTitle, GhostButton, Pill } from "@/components/ui/connexo-primitives";
import { DocumentManager } from "@/components/shared/DocumentManager";
import { getAccountantProcess, type AccountantProcessDetail } from "@/services/accountant";

export function AccountantProcessDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [process, setProcess] = useState<AccountantProcessDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getAccountantProcess(id)
      .then(setProcess)
      .catch((err) => console.error("Erro ao carregar processo:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Icon name="autorenew" className="text-4xl text-secondary animate-spin" />
      </div>
    );
  }

  if (!process) {
    return (
      <PageContainer className="text-center py-20">
        <h2 className="text-2xl font-black text-primary mb-4">Processo nao encontrado</h2>
        <GhostButton onClick={() => navigate("/acc/processos")}>Voltar para a Lista</GhostButton>
      </PageContainer>
    );
  }

  const statusTone = process.status === "ativo" ? "success" : process.status === "recusado" ? "error" : "gold";

  return (
    <PageContainer>
      <GhostButton icon="arrow_back" onClick={() => navigate("/acc/processos")} className="mb-8">
        Voltar para Pericias Ativas
      </GhostButton>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl font-black text-primary tracking-tight mb-2">{process.process_number}</h1>
                <div className="flex items-center gap-3">
                  <Pill tone="gold" className="text-xs">{process.process_type}</Pill>
                  <span className="text-sm font-bold text-primary/40 uppercase tracking-widest">{process.court}</span>
                </div>
              </div>
              <Pill tone={statusTone} className="text-sm px-4 py-2">{process.status}</Pill>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-8 border-l-4 border-l-primary">
                <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest mb-1">Cliente</p>
                <p className="text-lg font-black text-primary">{process.client_name}</p>
              </Card>
              <Card className="p-8 border-l-4 border-l-secondary">
                <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest mb-1">Etapa</p>
                <p className="text-lg font-black text-primary">{process.stage}</p>
              </Card>
            </div>
          </section>

          <section>
            <SectionTitle title="Documentos do Processo" />
            <DocumentManager processId={process.process_id} />
          </section>
        </div>

        <div className="lg:col-span-1">
          <SectionTitle title="Detalhes do Vinculo" />
          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest mb-1">Status do Vinculo</p>
                <Pill tone={statusTone}>{process.status}</Pill>
              </div>
              <div>
                <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest mb-1">Aberto em</p>
                <p className="text-sm font-bold text-primary">
                  {new Date(process.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
