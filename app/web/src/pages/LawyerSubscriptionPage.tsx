import { Card, Icon, PageContainer, Pill, SectionTitle } from "@/components/ui/connexo-primitives";

const ACCENT = "#C59D5C";

export function LawyerSubscriptionPage() {
  return (
    <PageContainer>
      <div className="max-w-3xl">
        <div className="mb-10">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
            Plano e Cobranca
          </p>
          <h1 className="text-4xl font-black text-primary tracking-tight">Assinatura</h1>
        </div>

        <Card className="p-8 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <Pill tone="gold" className="mb-3">Plano Premium</Pill>
              <p className="text-2xl font-black text-primary mb-2">R$ 197,90<span className="text-sm font-bold text-primary/40">/mes</span></p>
              <p className="text-sm text-primary/40 font-medium">Acesso completo a todas as funcionalidades da plataforma.</p>
            </div>
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center">
              <Icon name="workspace_premium" className="text-3xl" style={{ color: ACCENT }} />
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <SectionTitle title="Beneficios do Plano" />
          <Card className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Processos ilimitados",
                "Clientes ilimitados",
                "Catalogo de peritos contabeis",
                "Gestao documental completa",
                "Notificacoes em tempo real",
                "Suporte prioritario 24/7",
                "Vinculacao com contadores parceiros",
                "Perfil publico personalizado",
              ].map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <Icon name="check_circle" className="text-emerald-500 text-lg" />
                  <span className="text-sm font-bold text-primary">{b}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="p-8">
            <SectionTitle title="Historico de Faturamento" />
            <div className="text-center py-8">
              <Icon name="receipt_long" className="text-3xl text-primary/10 mb-3" />
              <p className="text-sm font-bold text-primary/30 uppercase tracking-widest">
                Nenhuma fatura disponivel
              </p>
              <p className="text-xs text-primary/20 mt-1">
                As faturas aparecerao aqui apos o primeiro ciclo de cobranca.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
