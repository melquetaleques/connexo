import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Icon,
  PageContainer,
  SectionTitle,
  GhostButton,
  Pill,
} from "@/components/ui/connexo-primitives";
import { StatCard } from "@/components/dashboard/StatCard";
import api from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

interface DashboardData {
  total_clients: number;
  total_processes: number;
  active_processes: number;
  recent_activity: any[];
}

export function LawyerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<DashboardData>("/adv/dashboard");
        setData(res.data);
      } catch (err) {
        console.error("Erro ao carregar dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary border-t-transparent" />
            <p className="text-sm font-medium text-on-surface-variant">Carregando painel...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="relative z-10">
        <div className="mb-10">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
            Painel do Advogado
          </p>
          <h1 className="text-ink text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl font-theme-display">
            Olá, {user?.name.split(" ")[0]}. <br />
            Você tem <span className="text-secondary">{data?.active_processes ?? 0} processos</span> ativos.
          </h1>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3 cx-stagger">
          <StatCard
            label="Total de Clientes"
            value={data?.total_clients ?? 0}
            icon="groups"
          />
          <StatCard
            label="Processos Totais"
            value={data?.total_processes ?? 0}
            icon="folder"
          />
          <StatCard
            label="Peritos Vinculados"
            value={0}
            icon="engineering"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SectionTitle 
              title="Ações Rápidas" 
              kicker="Atalhos"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="cursor-pointer group" onClick={() => navigate("/adv/clientes")}>
                <Card className="hover:border-secondary transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-surface-2 group-hover:bg-secondary/10">
                      <Icon name="person_add" className="text-xl group-hover:text-secondary" />
                    </div>
                    <div>
                      <p className="font-bold text-primary">Novo Cliente</p>
                      <p className="text-xs text-on-surface-variant">Cadastre um novo cliente e seus processos</p>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="cursor-pointer group" onClick={() => navigate("/public")}>
                <Card className="hover:border-secondary transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-surface-2 group-hover:bg-secondary/10">
                      <Icon name="search" className="text-xl group-hover:text-secondary" />
                    </div>
                    <div>
                      <p className="font-bold text-primary">Buscar Contador</p>
                      <p className="text-xs text-on-surface-variant">Encontre peritos contábeis para seus casos</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <div>
            <SectionTitle title="Status da Conta" kicker="Assinatura" />
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Pill tone="emerald">Plano Premium</Pill>
                <span className="text-[10px] font-bold text-on-surface-variant">ATIVO</span>
              </div>
              <p className="text-sm text-on-surface-variant mb-6">
                Sua assinatura renova automaticamente em 15 de Junho de 2026.
              </p>
              <GhostButton className="w-full justify-center" icon="credit_card" onClick={() => navigate("/adv/assinatura")}>Gerenciar Assinatura</GhostButton>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
