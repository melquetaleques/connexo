import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer, Card, Icon, GhostButton, SectionTitle } from "@/components/ui/connexo-primitives";
import { listDocumentsByProcess } from "@/services/documents";
import api from "@/services/api";
import type { Process } from "@/types";

interface DocGroup {
  processNumber: string;
  processId: string;
  documents: { id: string; name: string; created_at: string; type: string }[];
}

export function ClientDocumentsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<DocGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data: processes } = await api.get<Process[]>("/cli/processes");
        const results: DocGroup[] = [];
        for (const p of processes) {
          try {
            const docs = await listDocumentsByProcess(p.id);
            if (docs.length > 0) {
              results.push({
                processNumber: p.number,
                processId: p.id,
                documents: docs.map(d => ({ id: d.id, name: d.name, created_at: d.created_at, type: d.type })),
              });
            }
          } catch { /* processo sem documentos */ }
        }
        setGroups(results);
      } catch (error) {
        console.error("Erro ao carregar documentos:", error);
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
      <div className="mb-12">
        <h1 className="text-4xl font-black text-primary tracking-tight mb-2">Meus Documentos</h1>
        <p className="text-primary/40 font-bold uppercase tracking-[0.2em] text-xs">Documentos anexados aos seus processos</p>
      </div>

      {groups.length > 0 ? (
        <div className="space-y-8">
          {groups.map((g) => (
            <div key={g.processId}>
              <SectionTitle title={g.processNumber} />
              <div className="space-y-3">
                {g.documents.map((doc) => (
                  <Card key={doc.id} className="p-5 flex items-center justify-between hover:border-secondary/40 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-surface-2 rounded-xl flex items-center justify-center">
                        <Icon name="description" className="text-lg text-primary/40" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">{doc.name}</p>
                        <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">
                          {new Date(doc.created_at).toLocaleDateString()} • {doc.type || "PDF"}
                        </p>
                      </div>
                    </div>
                    <GhostButton
                      icon="chevron_right"
                      className="text-xs"
                      onClick={() => navigate(`/cli/processos/${g.processId}`)}
                    >
                      Ver Processo
                    </GhostButton>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface-1 rounded-[32px] border-2 border-dashed border-outline/30">
          <Icon name="folder_open" className="text-4xl text-primary/10 mb-4" />
          <p className="text-sm font-bold text-primary/30 uppercase tracking-widest">Nenhum documento encontrado</p>
        </div>
      )}
    </PageContainer>
  );
}
