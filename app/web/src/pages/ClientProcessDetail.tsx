import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageContainer, Card, Icon, SectionTitle, GhostButton, GoldButton, Pill, Avatar } from "@/components/ui/connexo-primitives";
import { listMyProcesses, ClientProcess } from "@/services/client";
import { DocumentManager } from "@/components/shared/DocumentManager";
import { apiErrorMessage } from "@/lib/utils";

export function ClientProcessDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [process, setProcess] = useState<ClientProcess | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await listMyProcesses();
        const found = data.find(p => p.id === id || p.link_id === id);
        setProcess(found || null);
      } catch (err) {
        setError(apiErrorMessage(err, "Erro ao carregar detalhe do processo."));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Icon name="autorenew" className="text-4xl text-secondary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <PageContainer className="text-center py-20">
        <h2 className="text-2xl font-black text-primary mb-4">Não foi possível carregar o processo</h2>
        <p className="text-sm font-bold text-rose-600 mb-6">{error}</p>
        <GhostButton onClick={() => navigate("/cli/processos")}>Voltar para a Lista</GhostButton>
      </PageContainer>
    );
  }

  if (!process) {
    return (
      <PageContainer className="text-center py-20">
        <h2 className="text-2xl font-black text-primary mb-4">Processo não encontrado</h2>
        <GhostButton onClick={() => navigate("/cli/processos")}>Voltar para a Lista</GhostButton>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <GhostButton icon="arrow_back" onClick={() => navigate("/cli/processos")} className="mb-8">
        Voltar para Meus Processos
      </GhostButton>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Informações Principais */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl font-black text-primary tracking-tight mb-2">{process.number}</h1>
                <div className="flex items-center gap-3">
                  <Pill tone="gold" className="text-xs">{process.stage}</Pill>
                  <span className="text-sm font-bold text-primary/40 uppercase tracking-widest">{process.court}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-8 border-l-4 border-l-primary">
                <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest mb-1">Tipo de Processo</p>
                <p className="text-lg font-black text-primary">{process.type}</p>
              </Card>
              <Card className="p-8 border-l-4 border-l-secondary">
                <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest mb-1">Advogado Responsável</p>
                <p className="text-lg font-black text-primary">{process.lawyer_name}</p>
              </Card>
            </div>
          </section>

          <section>
            <SectionTitle title="Documentos da Perícia" />
            <DocumentManager processId={process.id} />
          </section>
        </div>

        {/* Perito Vinculado */}
        <div className="lg:col-span-1">
          <SectionTitle title="Perito do Caso" />
          {process.accountant_id ? (
            <Card className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <Avatar initials={process.accountant_name?.[0] || "P"} size="lg" tone="gold" />
              </div>
              <h3 className="text-xl font-black text-primary mb-2">{process.accountant_name}</h3>
              <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest mb-8">Contador Perito Judicial</p>
              
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="text-center">
                  <p className="text-lg font-black text-primary">4.9</p>
                  <div className="flex text-secondary justify-center text-[8px]">
                    <Icon name="star" fill={true} />
                    <Icon name="star" fill={true} />
                    <Icon name="star" fill={true} />
                    <Icon name="star" fill={true} />
                    <Icon name="star" fill={true} />
                  </div>
                </div>
              </div>

              <GhostButton icon="mail" className="w-full py-4 text-xs" disabled title="Mensagens em desenvolvimento">Enviar Mensagem</GhostButton>
            </Card>
          ) : (
            <Card className="p-10 text-center bg-secondary/5 border-2 border-dashed border-secondary/30">
              <Icon name="person_search" className="text-4xl text-secondary mb-4 opacity-50" />
              <p className="text-sm font-bold text-primary mb-6">Nenhum perito vinculado a este processo ainda.</p>
              <GoldButton className="w-full" onClick={() => navigate("/cli/catalogo")}>Escolher Perito</GoldButton>
            </Card>
          )}

          <div className="mt-12">
            <SectionTitle title="Linha do Tempo" />
            <div className="space-y-8 pl-4 border-l-2 border-outline/30 ml-4">
              <TimelineItem
                date={new Date(process.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                title="Processo Registrado"
                desc="Seu advogado cadastrou o processo na plataforma."
                active={true}
              />
              {process.accountant_id ? (
                <TimelineItem
                  date={new Date(process.updated_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                  title="Perito Vinculado"
                  desc={`${process.accountant_name} vinculado ao processo.`}
                  active={true}
                />
              ) : (
                <TimelineItem
                  date="Pendente"
                  title="Vinculo com Perito"
                  desc="Aguardando escolha e aceite do contador perito."
                  active={false}
                />
              )}
              {process.accountant_id && (
                <TimelineItem
                  date="Em andamento"
                  title="Andamento da Pericia"
                  desc="Documentos sendo analisados pelo perito contabil."
                  active={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function TimelineItem({ date, title, desc, active }: { date: string, title: string, desc: string, active: boolean }) {
  return (
    <div className="relative">
      <div className={`absolute -left-[25px] top-1 w-4 h-4 rounded-full border-4 border-white ${active ? 'bg-secondary ring-4 ring-secondary/20' : 'bg-outline/50'}`} />
      <div>
        <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest mb-1">{date}</p>
        <p className={`text-sm font-black ${active ? 'text-primary' : 'text-primary/40'} mb-1`}>{title}</p>
        <p className="text-xs text-primary/40 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}
