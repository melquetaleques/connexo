import { useEffect, useState } from "react";
import {
  Card,
  GhostButton,
  GoldButton,
  Icon,
  PageContainer,
  SectionTitle,
  Field,
  Avatar,
  Pill
} from "@/components/ui/connexo-primitives";
import api from "@/services/api";

interface UserMember {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export function UsersPage() {
  const [members, setMembers] = useState<UserMember[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    permission: "viewer",
  });

  const loadMembers = async () => {
    try {
      setLoadingList(true);
      const res = await api.get<UserMember[]>("/adv/usuarios");
      setMembers(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar membros", err);
      // Fallback local
      setMembers([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // Auto dismiss success msg after 6s
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleInputChange = (field: string, value: string) => {
    setError(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name || !formData.permission) {
      setError("Erro ao convidar. Verifique os campos e tente novamente.");
      return;
    }

    setLoadingSubmit(true);
    setError(null);

    try {
      const payload = {
        email: formData.email,
        name: formData.name,
        permission: formData.permission,
      };

      await api.post("/adv/usuarios/invite", payload);

      setSuccessMsg(`Convite enviado para ${formData.email}. O link expira em 72 horas.`);
      
      setFormData({
        email: "",
        name: "",
        permission: "viewer",
      });
      setInviting(false);
      loadMembers();
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 409) {
        setError("Este e-mail já é membro do escritório.");
      } else if (err.response?.status === 429) {
        setError("Muitos convites enviados. Aguarde antes de tentar novamente.");
      } else if (err.response) {
        setError("Erro ao convidar. Verifique os campos e tente novamente.");
      } else {
        setError("Sem conexão com o servidor. Tente novamente.");
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">
              Equipe
            </span>
            <h2 className="text-3xl font-bold text-primary mt-1">Membros da Equipe</h2>
          </div>
          {!inviting && (
            <GoldButton onClick={() => setInviting(true)}>
              <Icon name="person_add" className="text-base" /> Convidar usuário
            </GoldButton>
          )}
        </div>

        {/* Invite Panel */}
        {inviting && (
          <Card>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6" onChange={() => setError(null)}>
              <div className="flex items-center justify-between border-b border-outline/30 pb-4">
                <h3 className="text-base font-medium text-primary">Convidar para o escritório</h3>
                <GhostButton onClick={() => { setInviting(false); setError(null); }} type="button">
                  Cancelar
                </GhostButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Field
                  label="Nome"
                  placeholder="Nome completo do convidado"
                  value={formData.name}
                  onChange={(e: any) => handleInputChange("name", e.target.value)}
                  disabled={loadingSubmit}
                />

                <Field
                  label="E-mail"
                  type="email"
                  placeholder="nome@escritorio.com.br"
                  value={formData.email}
                  onChange={(e: any) => handleInputChange("email", e.target.value)}
                  disabled={loadingSubmit}
                />

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em]">
                    Nível de acesso
                  </label>
                  <select
                    className="w-full rounded-xl border border-outline bg-surface-2 px-4 py-3 text-base font-medium text-primary focus:border-secondary focus:ring-1 focus:ring-secondary/40 outline-none transition-all disabled:opacity-50"
                    value={formData.permission}
                    onChange={(e) => handleInputChange("permission", e.target.value)}
                    disabled={loadingSubmit}
                  >
                    <option value="admin">Administrador</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Visualizador</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-rose-200/60 bg-rose-50 px-4 py-3 text-rose-700 text-xs font-bold mt-2">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-outline/30 pt-4">
                <GhostButton
                  onClick={() => { setInviting(false); setError(null); }}
                  type="button"
                  disabled={loadingSubmit}
                >
                  Cancelar
                </GhostButton>
                <GoldButton type="submit" disabled={loadingSubmit}>
                  {loadingSubmit ? (
                    <>
                      <Icon name="autorenew" className="text-base animate-spin" /> Enviando...
                    </>
                  ) : (
                    <>
                      <Icon name="send" className="text-base" /> Enviar convite
                    </>
                  )}
                </GoldButton>
              </div>
            </form>
          </Card>
        )}

        {/* Success message banner */}
        {successMsg && (
          <div className="rounded-lg border border-emerald-200/60 bg-emerald-50 flex items-center justify-between px-4 py-3 text-emerald-700 text-sm font-bold">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-950">
              <Icon name="close" aria-label="Fechar" className="text-lg" />
            </button>
          </div>
        )}

        {/* Members List */}
        {loadingList ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Icon name="autorenew" className="text-4xl text-secondary animate-spin" />
            <p className="text-sm font-medium text-primary/60">Buscando membros...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="rounded-[32px] border-2 border-dashed border-outline/30 bg-surface py-20 text-center">
            <Icon name="group" className="text-4xl text-primary/10 mb-4" />
            <h3 className="text-sm font-bold text-primary/30 uppercase tracking-widest">
              Equipe vazia
            </h3>
            <p className="text-xs text-primary/20 mt-2">
              Convide membros do escritório para acessar o portal.
            </p>
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline/30 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em]">
                    <th className="pb-4 pt-2">Nome</th>
                    <th className="pb-4 pt-2">E-mail</th>
                    <th className="pb-4 pt-2">Função</th>
                    <th className="pb-4 pt-2">Admitido em</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="border-b border-outline/20 last:border-none text-base text-primary font-medium">
                      <td className="py-4 flex items-center gap-3">
                        <Avatar initials={member.name.split(" ").map(n => n[0]).slice(0,2).join("")} size="sm" tone="gold" />
                        <span>{member.name}</span>
                      </td>
                      <td className="py-4 text-primary/60">{member.email}</td>
                      <td className="py-4">
                        <Pill tone={member.role === "admin" ? "gold" : "gray"}>
                          {member.role === "admin" ? "Administrador" : member.role === "editor" ? "Editor" : "Visualizador"}
                        </Pill>
                      </td>
                      <td className="py-4 text-primary/40">
                        {new Date(member.created_at).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
