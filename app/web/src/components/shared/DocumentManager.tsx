import { useState, useEffect, useRef } from "react";
import { Card, Icon, GoldButton, GhostButton } from "@/components/ui/connexo-primitives";
import { listDocumentsByProcess, uploadDocument, toggleDocumentVisibility, Document } from "@/services/documents";
import { apiErrorMessage } from "@/lib/utils";

interface DocumentManagerProps {
  processId: string;
  readOnly?: boolean;
}

export function DocumentManager({ processId, readOnly = false }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocs();
  }, [processId]);

  async function loadDocs() {
    try {
      const data = await listDocumentsByProcess(processId);
      setDocuments(data);
    } catch (error) {
      console.error("Erro ao carregar documentos:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      await uploadDocument(processId, file);
      await loadDocs();
      setSuccess("Documento enviado com sucesso.");
    } catch (err) {
      setError(apiErrorMessage(err, "Erro no upload do documento."));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleToggleVisibility = async (docId: string, currentVisible: boolean) => {
    try {
      await toggleDocumentVisibility(docId, !currentVisible);
      loadDocs();
    } catch (error) {
      console.error("Erro ao mudar visibilidade:", error);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2].map(i => <div key={i} className="h-20 bg-surface-2 rounded-2xl" />)}
    </div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 text-xs font-bold">{error}</div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 text-xs font-bold">{success}</div>
      )}
      {!readOnly && (
        <div className="flex justify-between items-center bg-surface-1 p-6 rounded-[24px] border-2 border-dashed border-outline/30">
          <div>
            <p className="text-sm font-black text-primary mb-1">Adicionar novo arquivo</p>
            <p className="text-xs text-primary/40 font-bold uppercase tracking-widest">PDF, PNG ou JPG (Max 10MB)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
          <GoldButton icon={uploading ? "autorenew" : "cloud_upload"} disabled={uploading} onClick={handleFileSelect}>
            {uploading ? "Enviando..." : "Upload"}
          </GoldButton>
        </div>
      )}

      {documents.length > 0 ? (
        <div className="space-y-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-6 flex items-center justify-between group hover:border-secondary/40 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-2 rounded-xl flex items-center justify-center text-primary/40 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                  <Icon name="description" className="text-xl" />
                </div>
                <div>
                  <p className="text-sm font-black text-primary mb-1">{doc.name}</p>
                  <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">
                    {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "—"} • PDF
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {!readOnly && (
                  <button 
                    onClick={() => handleToggleVisibility(doc.id, !!doc.visible_to_accountant)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                      doc.visible_to_accountant 
                      ? 'bg-emerald-500/10 text-emerald-600' 
                      : 'bg-primary/5 text-primary/30'
                    }`}
                  >
                    <Icon name={doc.visible_to_accountant ? "visibility" : "visibility_off"} className="text-sm" />
                    {doc.visible_to_accountant ? "Visível ao Perito" : "Privado"}
                  </button>
                )}
                <a href={doc.url} target="_blank" rel="noreferrer">
                  <GhostButton icon="download" className="w-10 h-10 p-0 flex items-center justify-center">
                    <span className="sr-only">Baixar</span>
                  </GhostButton>
                </a>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-surface-1 rounded-[32px]">
          <Icon name="folder_off" className="text-3xl text-primary/10 mb-2" />
          <p className="text-xs font-bold text-primary/30 uppercase tracking-widest">Nenhum documento anexado</p>
        </div>
      )}
    </div>
  );
}
