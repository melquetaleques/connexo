import { useState } from "react";
import { PageContainer, Card, Icon, SectionTitle, GoldButton } from "@/components/ui/connexo-primitives";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";
import { apiErrorMessage } from "@/lib/utils";

export function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Informe um nome.");
      return;
    }
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await api.put("/auth/me", { name: name.trim() });
      updateUser({ name: name.trim() });
      setSaved(true);
    } catch (err) {
      setError(apiErrorMessage(err, "Erro ao salvar configurações."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-3xl">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-primary tracking-tight mb-2">Configuracoes</h1>
          <p className="text-primary/40 font-bold uppercase tracking-[0.2em] text-xs">Gerencie suas preferencias e dados da conta</p>
        </div>

        <div className="space-y-8">
          <Card className="p-8">
            <SectionTitle title="Perfil" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 px-6 rounded-2xl bg-surface-1 border-2 border-transparent focus:border-secondary focus:bg-white transition-all outline-none font-bold text-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">E-mail</label>
                <input
                  type="email"
                  defaultValue={user?.email ?? ""}
                  disabled
                  className="w-full h-14 px-6 rounded-2xl bg-surface-1 border-2 border-transparent font-bold text-primary/50 cursor-not-allowed"
                />
              </div>
            </div>
            {error && (
              <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 text-xs font-bold">
                {error}
              </div>
            )}
            <div className="flex justify-end mt-8">
              {saved && <span className="text-xs font-bold text-emerald-600 mr-4 self-center">Salvo com sucesso!</span>}
              <GoldButton icon={saving ? "autorenew" : "save"} onClick={handleSave} disabled={saving}>
                {saving ? "Salvando..." : "Salvar Alteracoes"}
              </GoldButton>
            </div>
          </Card>

          <Card className="p-8">
            <SectionTitle title="Seguranca" />
            <div className="space-y-4 mt-6">
              <button className="w-full text-left p-4 rounded-2xl bg-surface-1 hover:bg-surface-2 transition-colors flex items-center gap-4">
                <Icon name="lock" className="text-2xl text-primary/40" />
                <div>
                  <p className="text-sm font-black text-primary">Alterar Senha</p>
                  <p className="text-xs text-primary/40">Atualize sua senha de acesso</p>
                </div>
                <Icon name="chevron_right" className="ml-auto text-primary/20" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
