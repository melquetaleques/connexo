import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import {
  Card,
  GhostButton,
  GoldButton,
  Icon,
  PageContainer,
  Pill,
  SectionTitle,
} from "@/components/ui/connexo-primitives";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";

const ACCENT = "#C59D5C";

// Fallback data para visualização enquanto o backend não envia todos os dados
const NEXT_DEADLINES = [
  { d: "12 mai", l: "Entrega do laudo — Santa Inês", danger: true },
  { d: "15 mai", l: "Audiência — Helena & Filhos", danger: false },
] as const;

function KpiCard({
  label,
  value,
  delta,
  icon,
  tone = "neutral",
  accent,
}: {
  label: string;
  value: number | string;
  delta: string;
  icon: string;
  tone?: "neutral" | "warning";
  accent: string;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-on-surface-variant">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-primary">{value}</p>
          <p className={`mt-2 text-xs font-semibold ${tone === "warning" ? "text-rose-600" : "text-emerald-600"}`}>
            {delta}
          </p>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: `${accent}15` }}
        >
          <Icon name={icon} className="text-xl" style={{ color: accent }} />
        </div>
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const populated = useMemo(() => params.get("empty") !== "1", [params]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await api.get("/adv/dashboard");
        setDashboardData(res.data);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary/20 border-t-secondary" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/40">Sincronizando Painel...</p>
        </div>
      </PageContainer>
    );
  }

  // Se não houver dados ou ?empty=1, mostra o empty state
  if (!populated || !dashboardData) {
    return (
      <PageContainer>
        <Card className="py-24 text-center border-dashed border-2">
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{ background: `${ACCENT}1A` }}
          >
            <Icon name="rocket_launch" className="text-4xl animate-pulse" style={{ color: ACCENT }} />
          </div>
          <h2 className="mb-3 text-3xl font-black tracking-tight text-primary">Início de uma nova jornada</h2>
          <p className="text-on-surface-variant mx-auto mb-8 max-w-md font-medium">
            Seu painel ainda está vazio. Cadastre seu primeiro cliente para começar a vincular processos e contratar perícias contábeis especializadas.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <GoldButton icon="add" onClick={() => navigate("/adv/clientes")}>
              Cadastrar Primeiro Cliente
            </GoldButton>
            <GhostButton icon="help_outline">Ver Tutorial</GhostButton>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="relative z-10">
        <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
              Relatório Geral
            </p>
            <h1 className="text-primary text-4xl font-black leading-[1.1] tracking-tight md:text-5xl">
              Olá, {user?.name.split(" ")[0] || "Doutor(a)"}. <br />
              <span className="text-secondary italic">{dashboardData.activeProcesses || 0} processos</span> ativos sob sua gestão.
            </h1>
          </div>
          
          <Card className="min-w-[280px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-on-surface-variant">
              Faturamento do Período
            </p>
            <p className="text-primary mt-1 text-3xl font-black tracking-tight">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dashboardData.feesTotal || 0)}
            </p>
            <span className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              <Icon name="trending_up" className="text-sm" />
              +14% em relação ao mês anterior
            </span>
          </Card>
        </div>

        <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            label="Processos Ativos"
            value={dashboardData.activeProcesses || 0}
            delta="+3 novos hoje"
            icon="folder_managed"
            accent={ACCENT}
          />
          <KpiCard
            label="Clientes Base"
            value={dashboardData.totalClients || 0}
            delta="Todos ativos"
            icon="group"
            accent={ACCENT}
          />
          <KpiCard
            label="Perícias em Curso"
            value={dashboardData.pendingExpertise || 0}
            delta="2 aguardando laudo"
            tone="warning"
            icon="history_edu"
            accent={ACCENT}
          />
          <KpiCard
            label="Novos Vínculos"
            value={dashboardData.newRequests || 0}
            delta="Solicitações"
            icon="handshake"
            accent={ACCENT}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-on-surface-variant mb-1 text-[10px] font-bold uppercase tracking-[0.25em]">Tendência</p>
                  <h3 className="text-primary text-xl font-black tracking-tight">Volume Processual</h3>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/40">
                    <div className="w-2 h-2 rounded-full bg-secondary" /> Processos
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/40">
                    <div className="w-2 h-2 rounded-full bg-primary" /> Perícias
                  </div>
                </div>
              </div>
              <ActivityChart data={dashboardData.monthlyActivity || []} accent={ACCENT} />
            </Card>

            <div className="space-y-6">
              <SectionTitle 
                title="Movimentações Recentes" 
                kicker="Timeline"
                action={<GhostButton icon="arrow_forward" onClick={() => navigate("/adv/clientes")}>Ver Tudo</GhostButton>}
              />
              <Card padded={false} className="divide-y divide-outline/40">
                {(dashboardData.recentUpdates || []).map((update: any) => (
                  <div key={update.id} className="p-5 flex items-center gap-4 hover:bg-surface-2/40 transition-colors group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center text-secondary">
                      <Icon name={update.icon || "update"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-primary group-hover:text-secondary transition-colors truncate">{update.title}</p>
                      <p className="text-xs text-primary/40 font-medium">{update.description}</p>
                    </div>
                    <span className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">{update.time}</span>
                    <Icon name="chevron_right" className="text-primary/10 group-hover:text-secondary" />
                  </div>
                ))}
              </Card>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="p-0 overflow-hidden">
              <div className="bg-primary p-6 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-1">Atenção</p>
                <h3 className="text-lg font-black tracking-tight">Próximos Prazos</h3>
              </div>
              <div className="p-6 space-y-6">
                {NEXT_DEADLINES.map((deadline, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border",
                      deadline.danger ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-surface-2 border-outline/60 text-primary"
                    )}>
                      <span className="text-[10px] font-black uppercase leading-none">{deadline.d.split(" ")[1]}</span>
                      <span className="text-lg font-black leading-none mt-0.5">{deadline.d.split(" ")[0]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-primary leading-tight">{deadline.l}</p>
                      <p className={cn("text-[10px] font-bold uppercase tracking-wider mt-1", deadline.danger ? "text-rose-400" : "text-primary/30")}>
                        {deadline.danger ? "Prazo Crítico" : "No Prazo"}
                      </p>
                    </div>
                  </div>
                ))}
                <GoldButton className="w-full mt-4" icon="calendar_month">Ver Agenda Completa</GoldButton>
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-4">Suporte Premium</h3>
              <p className="text-sm font-bold text-primary mb-4">Precisa de um parecer contábil urgente para este processo?</p>
              <div className="p-4 rounded-xl bg-surface-2 border border-outline/60 mb-6">
                <p className="text-xs font-medium text-primary/60 italic">"Nossos peritos estão disponíveis 24/7 para casos de liminares e urgências."</p>
              </div>
              <GoldButton className="w-full" icon="support_agent">Falar com Consultor</GoldButton>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
