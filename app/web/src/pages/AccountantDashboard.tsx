import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer, Card, Icon, SectionTitle, GoldButton, GhostButton, Pill, Avatar } from "@/components/ui/connexo-primitives";
import { getAccountantDashboard, AccountantDashboardData, acceptLinkRequest, rejectLinkRequest } from "@/services/accountant";

export function AccountantDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<AccountantDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const dashboardData = await getAccountantDashboard();
        setData(dashboardData);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAction = async (id: string, action: 'accept' | 'reject') => {
    try {
      if (action === 'accept') {
        await acceptLinkRequest(id);
      } else {
        await rejectLinkRequest(id);
      }
      // Recarregar dados
      const updatedData = await getAccountantDashboard();
      setData(updatedData);
    } catch (error) {
      console.error(`Erro ao ${action} solicitação:`, error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Icon name="autorenew" className="text-4xl text-secondary animate-spin" />
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="mb-12">
        <h1 className="text-4xl font-black text-primary tracking-tight mb-2">Painel do Perito</h1>
        <p className="text-primary/40 font-bold uppercase tracking-[0.2em] text-xs">Gestão de Processos e Vínculos</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          label="Solicitações Pendentes" 
          value={data?.stats.pending_links || 0} 
          icon="notification_important" 
          highlight={true}
        />
        <StatCard 
          label="Processos Ativos" 
          value={data?.stats.active_processes || 0} 
          icon="gavel" 
        />
        <StatCard 
          label="Perícias Concluídas" 
          value={data?.stats.completed_cases || 0} 
          icon="check_circle" 
        />
        <StatCard 
          label="Avaliação Média" 
          value={(data?.stats.rating || 0).toFixed(1)} 
          icon="star" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Solicitações Pendentes */}
        <div className="lg:col-span-2">
          <SectionTitle title="Novas Solicitações de Vínculo" />
          {data && data.pending_requests.length > 0 ? (
            <div className="space-y-4">
              {data.pending_requests.map((req) => (
                <Card key={req.id} className="p-6 flex items-center justify-between border-l-4 border-l-secondary">
                  <div className="flex items-center gap-6">
                    <Avatar initials={req.client_name[0]} tone="navy" />
                    <div>
                      <p className="text-lg font-black text-primary mb-1">{req.process_number}</p>
                      <div className="flex items-center gap-2">
                        <Pill tone="gold">{req.process_type}</Pill>
                        <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">{req.client_name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <GhostButton 
                      icon="close" 
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => handleAction(req.id, 'reject')}
                    >
                      Recusar
                    </GhostButton>
                    <GoldButton 
                      icon="check" 
                      onClick={() => handleAction(req.id, 'accept')}
                    >
                      Aceitar
                    </GoldButton>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-surface-1 rounded-[32px] border-2 border-dashed border-outline/30">
              <Icon name="inbox" className="text-4xl text-primary/10 mb-4" />
              <p className="text-sm font-bold text-primary/30 uppercase tracking-widest">Nenhuma solicitação pendente</p>
            </div>
          )}
        </div>

        {/* Atalhos Rápidos */}
        <div className="lg:col-span-1">
          <SectionTitle title="Ações Rápidas" />
          <Card className="p-8 space-y-4">
            <GoldButton className="w-full justify-start py-6" icon="person" onClick={() => navigate("/acc/perfil")}>
              Editar Meu Perfil
            </GoldButton>
            <GhostButton className="w-full justify-start py-6" icon="visibility" onClick={() => navigate("/acc/perfil")}>
              Ver Perfil Público
            </GhostButton>
            <GhostButton className="w-full justify-start py-6" icon="description" onClick={() => navigate("/acc/servicos")}>
              Modelos de Laudo
            </GhostButton>
            <GhostButton className="w-full justify-start py-6" icon="settings" onClick={() => navigate("/acc/configuracoes")}>
              Configurações
            </GhostButton>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

function StatCard({ label, value, icon, highlight = false }: { label: string, value: string | number, icon: string, highlight?: boolean }) {
  return (
    <Card className={`p-8 border-b-4 ${highlight ? 'border-b-secondary' : 'border-b-primary/10'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${highlight ? 'bg-secondary/10 text-secondary' : 'bg-surface-2 text-primary/40'}`}>
          <Icon name={icon} className="text-2xl" />
        </div>
      </div>
      <p className="text-3xl font-black text-primary mb-1 tracking-tight">{value}</p>
      <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.15em]">{label}</p>
    </Card>
  );
}
