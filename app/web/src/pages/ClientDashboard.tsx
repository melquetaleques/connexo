import { useState, useEffect } from "react";
import { PageContainer, Card, Icon, SectionTitle, GoldButton, Pill } from "@/components/ui/connexo-primitives";
import { listMyProcesses, ClientProcess } from "@/services/client";
import { useNavigate } from "react-router-dom";

export function ClientDashboard() {
  const navigate = useNavigate();
  const [processes, setProcesses] = useState<ClientProcess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await listMyProcesses();
        setProcesses(data);
      } catch (error) {
        console.error("Erro ao carregar processos do cliente:", error);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-primary tracking-tight mb-2">Meus Processos</h1>
          <p className="text-primary/40 font-bold uppercase tracking-[0.2em] text-xs">Acompanhamento de Perícias e Prazos</p>
        </div>
        <GoldButton icon="search" onClick={() => navigate("/cli/catalogo")}>
          Buscar Novos Peritos
        </GoldButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Lista de Processos */}
        <div className="lg:col-span-2 space-y-6">
          <SectionTitle title="Atividades Recentes" />
          {processes.length > 0 ? (
            processes.map((p) => (
              <div 
                key={p.id} 
                className="block hover:no-underline transition-all cursor-pointer group"
                onClick={() => navigate(`/cli/processos/${p.id}`)}
              >
                <Card className="p-8 hover:border-secondary/40">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-surface-2 rounded-2xl flex items-center justify-center text-primary/40 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                      <Icon name="balance" className="text-2xl" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-primary mb-1">{p.number}</p>
                      <div className="flex items-center gap-2">
                        <Pill tone="navy">{p.type}</Pill>
                        <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">{p.court}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {p.accountant_name ? (
                      <div className="text-right hidden md:block">
                        <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest mb-1">Perito Vinculado</p>
                        <p className="text-sm font-bold text-primary">{p.accountant_name}</p>
                      </div>
                    ) : (
                      <Pill tone="gold" className="animate-pulse">Aguardando Perito</Pill>
                    )}
                    <Icon name="chevron_right" className="text-primary/20 group-hover:text-secondary transition-colors" />
                  </div>
                </div>
                </Card>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-surface-1 rounded-[32px] border-2 border-dashed border-outline/30">
              <Icon name="folder_open" className="text-4xl text-primary/10 mb-4" />
              <p className="text-sm font-bold text-primary/30 uppercase tracking-widest">Nenhum processo encontrado</p>
            </div>
          )}
        </div>

        {/* Lado Direito: Resumo e Ajuda */}
        <div className="lg:col-span-1 space-y-8">
          <SectionTitle title="Status Geral" />
          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary/60">Em Andamento</span>
                <span className="text-lg font-black text-primary">{processes.filter(p => p.stage !== 'Concluído').length}</span>
              </div>
              <div className="h-px bg-outline/30 w-full" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary/60">Aguardando Vínculo</span>
                <span className="text-lg font-black text-secondary">{processes.filter(p => !p.accountant_id).length}</span>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-primary text-white overflow-hidden relative">
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-4">Precisa de Ajuda?</h4>
              <p className="text-white/60 text-sm font-medium mb-8 leading-relaxed">
                Consulte nossa central de ajuda ou fale diretamente com seu advogado para dúvidas sobre o processo.
              </p>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                Falar com Suporte
              </button>
            </div>
            <Icon name="help_outline" className="absolute -bottom-4 -right-4 text-8xl text-white/5 rotate-12" />
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
