import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer, Card, Icon } from "@/components/ui/connexo-primitives";
import { StatCard } from "@/components/dashboard/StatCard";
import { getAccountantDashboard, AccountantDashboardData, acceptLinkRequest, rejectLinkRequest } from "@/services/accountant";
import { apiErrorMessage } from "@/lib/utils";

export function AccountantDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<AccountantDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

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
    setActionError(null);
    try {
      if (action === 'accept') {
        await acceptLinkRequest(id);
      } else {
        await rejectLinkRequest(id);
      }
      const updatedData = await getAccountantDashboard();
      setData(updatedData);
    } catch (err) {
      setActionError(apiErrorMessage(err, `Erro ao ${action === "accept" ? "aceitar" : "recusar"} a solicitação.`));
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
      <h1
        className="font-theme-display"
        style={{ margin: "0 0 8px", font: "800 38px / 1.14 Figtree, sans-serif", letterSpacing: "-0.03em", color: "rgb(59, 13, 22)" }}
      >
        Painel do perito
      </h1>
      <p style={{ margin: "0 0 34px", font: '400 17px / 1.55 "Hanken Grotesk", sans-serif', color: "rgb(92, 74, 78)" }}>
        Gestão de processos, vínculos e entregas.
      </p>
      {actionError && (
        <div className="mb-8 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 text-xs font-bold">
          {actionError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 cx-stagger">
        <StatCard
          label="Solicitações pendentes"
          value={data?.stats.pending_links || 0}
          icon="notification_important"
          highlight
        />
        <StatCard
          label="Processos ativos"
          value={data?.stats.active_processes || 0}
          icon="gavel"
        />
        <StatCard
          label="Perícias concluídas"
          value={data?.stats.completed_cases || 0}
          icon="check_circle"
        />
        <StatCard
          label="Avaliação média"
          value={(data?.stats.rating || 0).toFixed(1)}
          icon="star"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-6">
        <div>
          <h2 style={{ margin: "0 0 18px", font: "800 24px / 1.2 Figtree, sans-serif", letterSpacing: "-0.025em", color: "rgb(59, 13, 22)" }}>
            Novas solicitações de vínculo
          </h2>
          {data && data.pending_requests.length > 0 ? (
            <div className="flex flex-col gap-4">
              {data.pending_requests.map((req) => (
                <Card key={req.id} className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3.5">
                    <div>
                      <div style={{ font: "700 18px / 1.3 Figtree, sans-serif", letterSpacing: "-0.02em", color: "rgb(28, 27, 26)", marginBottom: 6 }}>
                        {req.client_name}
                      </div>
                      <div style={{ font: '400 14px / 1.4 "Hanken Grotesk", sans-serif', color: "rgb(124, 114, 109)" }}>
                        {req.process_number}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        background: "rgb(253, 238, 244)",
                        font: '600 13px / 1 "Hanken Grotesk", sans-serif',
                        color: "rgb(193, 30, 99)",
                        flex: "0 0 auto",
                      }}
                    >
                      {req.process_type || "Pendente"}
                    </span>
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleAction(req.id, "accept")}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        height: 42,
                        padding: "0 20px",
                        borderRadius: 8,
                        background: "rgb(28, 27, 26)",
                        font: '700 14px / 1 "Hanken Grotesk", sans-serif',
                        color: "rgb(255, 255, 255)",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Aceitar vínculo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(req.id, "reject")}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        height: 42,
                        padding: "0 20px",
                        borderRadius: 8,
                        background: "transparent",
                        border: "1px solid rgb(228, 224, 218)",
                        font: '600 14px / 1 "Hanken Grotesk", sans-serif',
                        color: "rgb(92, 74, 78)",
                        cursor: "pointer",
                      }}
                    >
                      Recusar
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-10 text-center">
              <Icon name="inbox" className="text-4xl text-primary/10 mb-4" />
              <p className="text-sm font-medium text-on-surface-variant">Nenhuma solicitação pendente</p>
            </Card>
          )}
        </div>

        <div>
          <h2 style={{ margin: "0 0 18px", font: "800 24px / 1.2 Figtree, sans-serif", letterSpacing: "-0.025em", color: "rgb(59, 13, 22)" }}>
            Laudo em andamento
          </h2>
          <Card className="p-6 mb-4">
            <div style={{ font: '700 16px / 1.3 "Hanken Grotesk", sans-serif', color: "rgb(28, 27, 26)", marginBottom: 16 }}>
              {data?.stats.active_processes
                ? `${data.stats.active_processes} processos ativos`
                : "Nenhum laudo em andamento"}
            </div>
            <button
              type="button"
              onClick={() => navigate("/acc/processos")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: 44,
                borderRadius: 8,
                background: "rgb(28, 27, 26)",
                font: '700 14px / 1 "Hanken Grotesk", sans-serif',
                color: "rgb(255, 255, 255)",
                border: "none",
                cursor: "pointer",
              }}
            >
              Continuar laudo →
            </button>
          </Card>
          <Card className="p-6">
            <div style={{ font: '400 15px / 1 "Hanken Grotesk", sans-serif', color: "rgb(124, 114, 109)", marginBottom: 18 }}>
              Atalhos
            </div>
            <div className="flex flex-col gap-3">
              <button type="button" onClick={() => navigate("/acc/servicos")} className="flex items-center gap-2.5 text-left bg-transparent border-0 p-0 cursor-pointer" style={{ font: '600 15px / 1 "Hanken Grotesk", sans-serif', color: "rgb(28, 27, 26)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: "rgb(255, 77, 141)" }} />
                Modelos de laudo
              </button>
              <button type="button" onClick={() => navigate("/acc/perfil")} className="flex items-center gap-2.5 text-left bg-transparent border-0 p-0 cursor-pointer" style={{ font: '600 15px / 1 "Hanken Grotesk", sans-serif', color: "rgb(28, 27, 26)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: "rgb(76, 99, 199)" }} />
                Editar meu perfil
              </button>
              <button type="button" onClick={() => navigate("/acc/perfil")} className="flex items-center gap-2.5 text-left bg-transparent border-0 p-0 cursor-pointer" style={{ font: '600 15px / 1 "Hanken Grotesk", sans-serif', color: "rgb(28, 27, 26)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: "rgb(30, 143, 107)" }} />
                Ver perfil público
              </button>
              <button type="button" onClick={() => navigate("/acc/configuracoes")} className="flex items-center gap-2.5 text-left bg-transparent border-0 p-0 cursor-pointer" style={{ font: '600 15px / 1 "Hanken Grotesk", sans-serif', color: "rgb(28, 27, 26)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: "rgb(176, 122, 34)" }} />
                Configurações
              </button>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
