import { useParams, Link } from "react-router-dom";
import {
  Card,
  GoldButton,
  Icon,
  PageContainer,
  Pill,
  StatusDot,
  SectionTitle,
  Stat,
  Avatar,
  StripePlaceholder
} from "@/components/ui/connexo-primitives";
import type { Process } from "@/types";

// Mock data para visualização enquanto o backend não é integrado no Plan 1.3
const MOCK_PROCESS: Process = {
  id: "1",
  lawyer_id: "L1",
  client_id: "C1",
  number: "5001234-56.2024.8.26.0100",
  type: "Perícia Contábil",
  court: "10ª Vara Cível de São Paulo",
  stage: "Nomeação de Perito",
  status: "active",
  created_at: "2024-05-01T10:00:00Z",
  updated_at: "2024-05-04T15:30:00Z",
};

export function ProcessPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <PageContainer>
      <div className="mb-8">
        <Link to="/adv/clientes" className="flex items-center gap-2 text-primary/40 hover:text-primary transition-colors mb-6 group">
          <Icon name="arrow_back" className="text-xl" />
          <span className="text-xs font-bold uppercase tracking-widest">Voltar para Clientes</span>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Pill tone="gold" className="px-4 py-1">Processo Judicial</Pill>
              <Pill tone="success">
                <StatusDot tone="success" /> Ativo
              </Pill>
            </div>
            <h2 className="text-3xl font-black text-primary tracking-tight">{MOCK_PROCESS.number}</h2>
            <p className="text-on-surface-variant font-medium mt-1">{MOCK_PROCESS.court}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <GhostButton icon="share">Compartilhar</GhostButton>
            <GoldButton icon="history_edu">Solicitar Perícia</GoldButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal: Detalhes e Documentos */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8">
            <h3 className="text-lg font-black text-primary mb-6 flex items-center gap-2">
              <Icon name="info" className="text-secondary" />
              Informações do Processo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Stat label="Tipo de Ação" value={MOCK_PROCESS.type} />
              <Stat label="Fase Atual" value={MOCK_PROCESS.stage} />
              <Stat label="Data de Abertura" value={new Date(MOCK_PROCESS.created_at).toLocaleDateString()} />
              <Stat label="Última Movimentação" value={new Date(MOCK_PROCESS.updated_at).toLocaleDateString()} />
            </div>
            
            <div className="mt-8 p-4 bg-surface-2 rounded-xl border border-outline/50 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                <Icon name="gavel" className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest">Observação do Juízo</p>
                <p className="text-sm text-on-surface-variant mt-1">Determinado o início da perícia contábil para apuração de haveres. Prazo de 15 dias para indicação de assistente técnico.</p>
              </div>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="p-8 border-b border-outline/60 flex items-center justify-between">
              <h3 className="text-lg font-black text-primary flex items-center gap-2">
                <Icon name="folder" className="text-secondary" />
                Documentos e Provas
              </h3>
              <GhostButton icon="upload" className="text-xs">Subir Arquivo</GhostButton>
            </div>
            
            <div className="divide-y divide-outline/40">
              {[
                { name: "Petição Inicial.pdf", size: "2.4 MB", date: "01/05/2024", type: "PDF" },
                { name: "Planilha de Cálculos.xlsx", size: "1.1 MB", date: "02/05/2024", type: "XLSX" },
                { name: "Extratos Bancários.zip", size: "15.8 MB", date: "03/05/2024", type: "ZIP" },
              ].map((doc, i) => (
                <div key={i} className="px-8 py-4 flex items-center justify-between group hover:bg-surface-2/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-white border border-outline flex items-center justify-center">
                      <Icon name="description" className="text-primary/40" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">{doc.name}</p>
                      <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">{doc.size} • {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-primary/5 rounded-full text-primary/60 hover:text-primary"><Icon name="visibility" /></button>
                    <button className="p-2 hover:bg-primary/5 rounded-full text-primary/60 hover:text-primary"><Icon name="download" /></button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-8 bg-surface-2/30 text-center">
              <p className="text-xs font-bold text-primary/30 uppercase tracking-[0.3em]">Fim da Lista de Arquivos</p>
            </div>
          </Card>
        </div>

        {/* Coluna Lateral: Contador e Timeline */}
        <div className="space-y-8">
          <Card className="p-8">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 border-b border-outline/60 pb-4">Contador Responsável</h3>
            
            <div className="flex flex-col items-center text-center">
              <Avatar initials="RC" size="lg" tone="gold" />
              <h4 className="mt-4 text-lg font-black text-primary">Ricardo Camargo</h4>
              <p className="text-xs font-bold text-secondary uppercase tracking-widest">Perito Contábil • CRC/SP</p>
              
              <div className="mt-6 w-full space-y-4">
                <div className="p-4 rounded-xl bg-surface-1 border border-outline/60 text-left">
                  <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-1">Status do Vínculo</p>
                  <Pill tone="success" className="w-full justify-center py-2">Aceito & Ativo</Pill>
                </div>
                
                <GoldButton className="w-full" icon="chat">Enviar Mensagem</GoldButton>
                <GhostButton className="w-full" icon="person_search">Mudar Contador</GhostButton>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 border-b border-outline/60 pb-4">Histórico de Atividades</h3>
            <div className="space-y-6">
              {[
                { action: "Documento enviado", time: "Há 2 horas", user: "Você" },
                { action: "Vínculo aceito", time: "Ontem", user: "Ricardo C." },
                { action: "Perícia solicitada", time: "2 dias atrás", user: "Você" },
                { action: "Processo cadastrado", time: "3 dias atrás", user: "Sistema" },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i < 3 && <div className="absolute left-[11px] top-6 w-px h-10 bg-outline/60" />}
                  <div className="w-6 h-6 rounded-full bg-surface-2 border border-outline flex items-center justify-center shrink-0 z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-primary">{log.action}</p>
                    <p className="text-[10px] text-primary/40 uppercase font-medium">{log.user} • {log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
