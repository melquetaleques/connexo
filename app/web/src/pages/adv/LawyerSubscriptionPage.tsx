import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, GoldButton, Icon, Badge, PageContainer, SectionTitle } from "@/components/ui/connexo-primitives";
import api from "@/services/api";

interface SubscriptionData {
  plan: string;
  status: string;
  expires_at: string | null;
  days_remaining: number;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const PLAN_LABELS: Record<string, string> = {
  trial: "Teste Grátis",
  basico: "Essencial",
  profissional: "Profissional",
};

const PLAN_FEATURES: Record<string, string[]> = {
  trial: ["Até 3 processos ativos", "1 contador vinculado", "Gestão básica de perícias", "Suporte por e-mail"],
  basico: ["Até 10 processos ativos", "Até 3 contadores vinculados", "Painel de indicadores", "Convites para equipe", "Suporte prioritário"],
  profissional: ["Processos ilimitados", "Contadores ilimitados", "Relatórios avançados", "Gestão documental completa", "Integração LGPD total", "Suporte dedicado 24h"],
};

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" }> = {
    ativo: { label: "Ativo", variant: "success" },
    expirado: { label: "Expirado", variant: "danger" },
    cancelado: { label: "Cancelado", variant: "warning" },
  };
  const c = config[status] ?? { label: status, variant: "info" };
  return <Badge variant={c.variant}>{c.label}</Badge>;
}

export function LawyerSubscriptionPage() {
  const navigate = useNavigate();
  const [sub, setSub] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/adv/subscription");
        setSub(res.data);
      } catch (err: any) {
        setError(err?.response?.data || "Erro ao carregar dados da assinatura.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Card className="p-10 text-center">
          <Icon name="error_outline" className="text-4xl text-rose-400 mb-4 block" />
          <p className="text-sm font-bold text-rose-600 mb-2">Erro ao carregar assinatura</p>
          <p className="text-xs text-on-surface-variant mb-6">{error}</p>
          <GoldButton onClick={() => window.location.reload()} icon="refresh">
            Tentar novamente
          </GoldButton>
        </Card>
      </PageContainer>
    );
  }

  if (!sub) {
    return (
      <PageContainer>
        <Card className="p-10 text-center">
          <Icon name="info" className="text-4xl text-primary/40 mb-4 block" />
          <p className="text-sm font-bold text-primary mb-2">Assinatura não encontrada</p>
          <p className="text-xs text-on-surface-variant">
            Entre em contato com o suporte para ativar seu plano.
          </p>
        </Card>
      </PageContainer>
    );
  }

  const isExpired = sub.status === "expirado";
  const planLabel = PLAN_LABELS[sub.plan] || sub.plan;
  const features = PLAN_FEATURES[sub.plan] || [];

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <SectionTitle subtitle="Acompanhe o status do seu plano e gerencie sua assinatura.">
          Plano & Cobrança
        </SectionTitle>

        {/* Current plan card */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-black text-primary">{planLabel}</h3>
                <StatusBadge status={sub.status} />
              </div>
              {sub.expires_at && (
                <p className="text-sm text-on-surface-variant font-medium">
                  {isExpired
                    ? `Expirado em ${formatDate(sub.expires_at)}`
                    : `Válido até ${formatDate(sub.expires_at)}`}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-primary">{sub.days_remaining}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {sub.days_remaining === 1 ? "dia restante" : "dias restantes"}
              </p>
            </div>
          </div>

          {/* Plan features */}
          {features.length > 0 && (
            <div className="border-t border-outline/60 pt-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-4">
                Recursos do Plano
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Icon name="check_circle" className="text-emerald-500 text-base shrink-0" />
                    <span className="text-sm font-medium text-primary">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expired banner inside card */}
          {isExpired && (
            <div className="mt-8 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <Icon name="warning_amber" className="text-amber-600 text-xl shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-extrabold text-amber-800 mb-1">Assinatura Expirada</p>
                <p className="text-xs font-medium text-amber-700">
                  Seu período de acesso expirou. Entre em contato com nossa equipe para renovar seu plano e continuar usando todos os recursos do Connexo.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Upgrade options */}
        <Card className="p-8">
          <h3 className="text-lg font-black text-primary mb-6">Precisa de mais recursos?</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-outline/60 hover:border-secondary/30 transition-all">
              <p className="text-sm font-black text-primary mb-1">Essencial</p>
              <p className="text-2xl font-black text-primary mb-2">R$ 297<span className="text-xs font-bold text-on-surface-variant">/mês</span></p>
              <ul className="space-y-2 mb-6">
                <li className="text-xs text-on-surface-variant">Até 10 processos ativos</li>
                <li className="text-xs text-on-surface-variant">Até 3 contadores</li>
              </ul>
              <GoldButton variant="ghost" className="w-full text-[10px] py-2.5" icon="sell">
                Contratar
              </GoldButton>
            </div>
            <div className="p-6 rounded-2xl border-2 border-secondary bg-secondary/5">
              <p className="text-sm font-black text-primary mb-1">Profissional</p>
              <p className="text-2xl font-black text-primary mb-2">R$ 597<span className="text-xs font-bold text-on-surface-variant">/mês</span></p>
              <ul className="space-y-2 mb-6">
                <li className="text-xs text-on-surface-variant">Processos ilimitados</li>
                <li className="text-xs text-on-surface-variant">Contadores ilimitados</li>
              </ul>
              <GoldButton className="w-full text-[10px] py-2.5" icon="sell">
                Contratar
              </GoldButton>
            </div>
          </div>
          <p className="mt-6 text-[10px] font-medium text-on-surface-variant text-center">
            A contratação de planos está disponível sob consulta. 
            Envie um email para {" "}
            <a href="mailto:comercial@connexo.com.br" className="text-secondary font-bold hover:underline">
              comercial@connexo.com.br
            </a>
          </p>
        </Card>
      </div>
    </PageContainer>
  );
}
