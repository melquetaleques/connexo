import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  GoldButton,
  Icon,
  PageContainer,
  Pill,
  StatusDot,
} from "@/components/ui/connexo-primitives";
import { listProcesses } from "@/services/processes";
import type { Process } from "@/types";

export function LawyerProcessesPage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listProcesses()
      .then(setProcesses)
      .catch(() => console.error("Erro ao carregar processos"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Icon name="autorenew" className="text-4xl text-secondary animate-spin" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
            Gestao Processual
          </p>
          <h2 className="text-3xl font-black text-primary tracking-tight">Processos</h2>
        </div>
        <Link to="/adv/clientes">
          <GoldButton icon="add">Novo Processo</GoldButton>
        </Link>
      </div>

      {processes.length === 0 ? (
        <Card className="py-24 text-center border-dashed border-2">
          <Icon name="balance" className="text-4xl text-primary/10 mb-4" />
          <p className="text-lg font-black text-primary mb-2">Nenhum processo cadastrado</p>
          <p className="text-sm text-primary/40 font-medium mb-6">
            Cadastre clientes e vincule processos judiciais para contratar pericias contabeis.
          </p>
          <Link to="/adv/clientes">
            <GoldButton icon="add">Cadastrar Primeiro Cliente</GoldButton>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {processes.map((p) => (
            <Link key={p.id} to={`/adv/processos/${p.id}`}>
              <Card className="p-6 flex items-center justify-between hover:border-secondary/40 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-2 rounded-xl flex items-center justify-center text-primary/40">
                    <Icon name="balance" className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-primary">{p.number}</p>
                    <p className="text-xs text-primary/40 font-medium">{p.court}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Pill tone={p.status === "active" || p.status === "ativo" ? "success" : "neutral"}>
                    <StatusDot tone={p.status === "active" || p.status === "ativo" ? "success" : "neutral"} />
                    {p.status}
                  </Pill>
                  <Icon name="chevron_right" className="text-primary/20" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
