import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer, Card, Icon, PageHeader, StatusBadge, GhostButton, Pill } from "@/components/ui/connexo-primitives";
import { listAccountantProcesses, AccountantProcess } from "@/services/accountant";

export function AccountantProcessesPage() {
  const navigate = useNavigate();
  const [processes, setProcesses] = useState<AccountantProcess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await listAccountantProcesses();
        setProcesses(data);
      } catch (error) {
        console.error("Erro ao carregar processos:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Icon name="autorenew" className="text-4xl text-secondary animate-spin" />
      </div>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        kicker="Perícias ativas e solicitações pendentes"
        title="Processos Vinculados"
      />
      {processes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {processes.map((p) => (
            <div key={p.id} className="cursor-pointer group" onClick={() => navigate(`/acc/processos/${p.id}`)}>
            <Card className="p-8 hover:border-secondary/40 transition-all">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-lg font-black text-primary mb-1">{p.process_number}</p>
                  <div className="flex items-center gap-2">
                    <Pill tone="navy">{p.process_type ?? ""}</Pill>
                    <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">{String(p.court ?? "")}</span>
                  </div>
                </div>
                <StatusBadge status={p.status}>
                  {p.status ?? ""}
                </StatusBadge>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-outline/20">
                <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">Cliente: {p.client_name}</span>
                <GhostButton icon="chevron_right" className="text-xs">Ver Detalhes</GhostButton>
              </div>
            </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface-1 rounded-[32px] border-2 border-dashed border-outline/30">
          <Icon name="folder_open" className="text-4xl text-primary/10 mb-4" />
          <p className="text-sm font-bold text-primary/30 uppercase tracking-widest">Nenhum processo vinculado</p>
        </div>
      )}
    </PageContainer>
  );
}
