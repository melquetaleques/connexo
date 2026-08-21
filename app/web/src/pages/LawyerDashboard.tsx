import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Icon,
  PageContainer,
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

function prazoLabel(item: any): string {
  const raw = item?.prazo ?? item?.due ?? item?.deadline ?? item?.days;
  if (typeof raw === "string" && raw.trim()) return raw;
  if (typeof raw === "number") return `D-${raw}`;
  return "—";
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

  const firstName = user?.name.split(" ")[0] ?? "";
  const prazos = (data?.recent_activity ?? []).slice(0, 3);

  return (
    <PageContainer>
      <div className="relative z-10">
        <h1
          className="font-theme-display"
          style={{ margin: "0 0 8px", font: "800 38px / 1.14 Figtree, sans-serif", letterSpacing: "-0.03em", color: "rgb(59, 13, 22)" }}
        >
          Olá, {firstName}
        </h1>
        <p style={{ margin: "0 0 34px", font: '400 17px / 1.55 "Hanken Grotesk", sans-serif', color: "rgb(92, 74, 78)" }}>
          Você tem{" "}
          <span style={{ fontWeight: 600, color: "rgb(193, 30, 99)" }}>
            {data?.active_processes ?? 0} processos
          </span>{" "}
          ativos.
        </p>

        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3 cx-stagger">
          <StatCard
            label="Total de clientes"
            value={data?.total_clients ?? 0}
            icon="groups"
          />
          <StatCard
            label="Processos totais"
            value={data?.total_processes ?? 0}
            icon="folder"
          />
          <StatCard
            label="Peritos vinculados"
            value={0}
            icon="balance"
            highlight
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div>
            <h2 style={{ margin: "0 0 18px", font: "800 24px / 1.2 Figtree, sans-serif", letterSpacing: "-0.025em", color: "rgb(59, 13, 22)" }}>
              Próximos prazos
            </h2>
            <div className="bg-white overflow-hidden" style={{ borderRadius: 16 }}>
              <div
                className="grid gap-4 px-[22px] py-4"
                style={{ gridTemplateColumns: "1.5fr 1.2fr 0.6fr", font: '500 13px / 1 "Hanken Grotesk", sans-serif', color: "rgb(154, 144, 136)", borderBottom: "1px solid rgb(237, 234, 229)" }}
              >
                <span>Processo</span>
                <span>Ato</span>
                <span>Prazo</span>
              </div>
              {prazos.length === 0 ? (
                <p className="px-[22px] py-6" style={{ font: '400 15px / 1.5 "Hanken Grotesk", sans-serif', color: "rgb(124, 114, 109)" }}>
                  Nenhum prazo listado neste momento.
                </p>
              ) : (
                prazos.map((item, i) => (
                  <div
                    key={item?.id ?? i}
                    className="grid gap-4 px-[22px] py-[18px] items-center"
                    style={{
                      gridTemplateColumns: "1.5fr 1.2fr 0.6fr",
                      borderBottom: i === prazos.length - 1 ? "none" : "1px solid rgb(244, 241, 236)",
                    }}
                  >
                    <span style={{ font: '600 15px / 1 "Hanken Grotesk", sans-serif', color: "rgb(28, 27, 26)" }}>
                      {item?.process_number ?? item?.processo ?? item?.title ?? "—"}
                    </span>
                    <span style={{ font: '400 15px / 1 "Hanken Grotesk", sans-serif', color: "rgb(92, 74, 78)" }}>
                      {item?.ato ?? item?.action ?? item?.description ?? item?.type ?? "Andamento"}
                    </span>
                    <span
                      style={{
                        padding: "5px 11px",
                        borderRadius: 6,
                        background: i === 0 ? "rgb(253, 238, 244)" : "rgb(243, 241, 237)",
                        font: '600 13px / 1 "Hanken Grotesk", sans-serif',
                        color: i === 0 ? "rgb(193, 30, 99)" : "rgb(92, 74, 78)",
                        justifySelf: "start",
                      }}
                    >
                      {prazoLabel(item)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <h2 style={{ margin: "34px 0 18px", font: "800 24px / 1.2 Figtree, sans-serif", letterSpacing: "-0.025em", color: "rgb(59, 13, 22)" }}>
              Ações rápidas
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="cursor-pointer" onClick={() => navigate("/adv/clientes")}>
                <Card className="p-[22px]">
                  <span
                    className="flex items-center justify-center mb-[22px]"
                    style={{ width: 36, height: 36, borderRadius: 10, background: "rgb(237, 240, 253)" }}
                  >
                    <Icon name="group" className="text-base" style={{ color: "rgb(76, 99, 199)" }} />
                  </span>
                  <div style={{ font: '600 16px / 1.3 "Hanken Grotesk", sans-serif', color: "rgb(28, 27, 26)", marginBottom: 6 }}>
                    Novo cliente
                  </div>
                  <div style={{ font: '400 14px / 1.5 "Hanken Grotesk", sans-serif', color: "rgb(124, 114, 109)" }}>
                    Cadastre um cliente e vincule seus processos
                  </div>
                </Card>
              </div>
              <div className="cursor-pointer" onClick={() => navigate("/public")}>
                <Card className="p-[22px]">
                  <span
                    className="flex items-center justify-center mb-[22px]"
                    style={{ width: 36, height: 36, borderRadius: 10, background: "rgb(253, 242, 228)" }}
                  >
                    <Icon name="search" className="text-base" style={{ color: "rgb(176, 122, 34)" }} />
                  </span>
                  <div style={{ font: '600 16px / 1.3 "Hanken Grotesk", sans-serif', color: "rgb(28, 27, 26)", marginBottom: 6 }}>
                    Buscar perito
                  </div>
                  <div style={{ font: '400 14px / 1.5 "Hanken Grotesk", sans-serif', color: "rgb(124, 114, 109)" }}>
                    Encontre peritos contábeis com CRC ativo
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ margin: "0 0 18px", font: "800 24px / 1.2 Figtree, sans-serif", letterSpacing: "-0.025em", color: "rgb(59, 13, 22)" }}>
              Peritos vinculados
            </h2>
            <Card className="p-[22px] mb-4">
              <p style={{ margin: 0, font: '400 15px / 1.5 "Hanken Grotesk", sans-serif', color: "rgb(124, 114, 109)" }}>
                Os peritos vinculados a este escritório aparecem aqui quando houver vínculo ativo.
              </p>
            </Card>
            <div
              className="relative overflow-hidden"
              style={{ background: "rgb(74, 15, 27)", borderRadius: 16, padding: 24 }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(85% 70% at 92% 0%, rgba(255, 77, 141, 0.28), transparent 66%)",
                }}
              />
              <div className="relative">
                <div style={{ font: "800 20px / 1.25 Figtree, sans-serif", letterSpacing: "-0.02em", color: "rgb(255, 255, 255)", marginBottom: 10 }}>
                  Vitrine de peritos
                </div>
                <p style={{ margin: "0 0 20px", font: '400 15px / 1.55 "Hanken Grotesk", sans-serif', color: "rgba(255, 255, 255, 0.7)" }}>
                  Peritos com CRC ativo, filtrados por especialidade e comarca.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/public")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: 40,
                    padding: "0 18px",
                    borderRadius: 8,
                    background: "rgb(255, 255, 255)",
                    color: "rgb(74, 15, 27)",
                    font: '700 14px / 1 "Hanken Grotesk", sans-serif',
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Explorar vitrine →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
