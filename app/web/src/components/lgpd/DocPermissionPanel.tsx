import { useState, useEffect } from "react";
import {
  Card,
  GhostButton,
  GoldButton,
  Icon,
  Pill,
} from "@/components/ui/connexo-primitives";
import {
  listDocPermissionsByLink,
  toggleDocPermission,
} from "@/services/documents";

interface DocPermissionPanelProps {
  linkId: string;
  documents?: { id: string; name: string }[];
}

/**
 * DocPermissionPanel — Painel de permissões de documentos para o advogado.
 * Exibe uma lista de documentos do processo com toggle de visibilidade ao contador.
 */
export function DocPermissionPanel({
  linkId,
  documents = [],
}: DocPermissionPanelProps) {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!linkId) return;
    (async () => {
      setLoading(true);
      try {
        const data = await listDocPermissionsByLink(linkId);
        const permMap: Record<string, boolean> = {};
        data.permissions.forEach((p) => {
          permMap[p.document_id] = true;
        });
        setPermissions(permMap);
      } catch (err: any) {
        console.error("Erro ao carregar permissões", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [linkId]);

  const handleToggle = async (documentId: string) => {
    setToggling((prev) => ({ ...prev, [documentId]: true }));
    setError(null);
    try {
      const result = await toggleDocPermission(documentId, linkId);
      setPermissions((prev) => ({ ...prev, [documentId]: result.granted }));
    } catch (err: any) {
      setError(err.response?.data || "Erro ao alterar permissão");
    } finally {
      setToggling((prev) => ({ ...prev, [documentId]: false }));
    }
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center gap-3 py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-secondary/20 border-t-secondary" />
          <p className="text-xs font-bold uppercase tracking-widest text-primary/40">
            Carregando permissões...
          </p>
        </div>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card className="p-8">
        <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 border-b border-outline/60 pb-4 flex items-center gap-2">
          <Icon name="visibility" className="text-secondary" />
          Permissões de Documentos
        </h3>
        <div className="rounded-xl border-2 border-dashed border-outline/30 bg-surface-2 p-8 text-center">
          <Icon name="folder_off" className="text-3xl text-primary/20 mb-3" />
          <p className="text-xs font-bold text-primary/30 uppercase tracking-widest">
            Nenhum documento neste processo
          </p>
          <p className="text-[10px] font-medium text-primary/20 mt-2">
            Os documentos aparecerão aqui após o upload.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-6 border-b border-outline/60 pb-4 flex items-center gap-2">
        <Icon name="visibility" className="text-secondary" />
        Permissões de Documentos
      </h3>

      {error && (
        <div className="mb-4 rounded-lg border border-rose-200/60 bg-rose-50 px-4 py-3 text-rose-700 text-xs font-bold">
          {error}
        </div>
      )}

      <div className="divide-y divide-outline/40">
        {documents.map((doc) => {
          const isVisible = permissions[doc.id] || false;
          const isToggling = toggling[doc.id] || false;
          return (
            <div
              key={doc.id}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  name={isVisible ? "visibility" : "visibility_off"}
                  className={
                    isVisible ? "text-secondary text-lg" : "text-primary/20 text-lg"
                  }
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-primary truncate">
                    {doc.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Pill
                  tone={isVisible ? "success" : "neutral"}
                  className="text-[10px]"
                >
                  {isVisible ? "Visível" : "Oculto"}
                </Pill>
                <button
                  onClick={() => handleToggle(doc.id)}
                  disabled={isToggling}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/30 ${
                    isVisible
                      ? "bg-secondary"
                      : "bg-outline/40"
                  } ${isToggling ? "opacity-50" : ""}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isVisible ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[9px] font-medium text-primary/30 mt-6 leading-relaxed border-t border-outline/40 pt-4">
        Por padrão, documentos <strong>não</strong> são visíveis ao contador.
        Use os toggles acima para conceder ou revogar acesso individualmente.
      </p>
    </Card>
  );
}
