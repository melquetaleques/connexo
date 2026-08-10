import { useState, useEffect } from "react";
import { PageContainer, Card, Icon, SectionTitle, GoldButton, GhostButton, Pill } from "@/components/ui/connexo-primitives";
import { getMyProfile, updateAccountantProfile } from "@/services/accountant";
import { useNavigate } from "react-router-dom";

export function AccountantProfileEdit() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cityInput, setCityInput] = useState("");

  const addCity = () => {
    const city = cityInput.trim();
    if (!city) return;
    const cities: string[] = profile.cities || [];
    if (!cities.some((c) => c.toLowerCase() === city.toLowerCase())) {
      setProfile({ ...profile, cities: [...cities, city] });
    }
    setCityInput("");
  };

  const removeCity = (city: string) => {
    setProfile({ ...profile, cities: (profile.cities || []).filter((c: string) => c !== city) });
  };

  useEffect(() => {
    getMyProfile()
      .then(setProfile)
      .catch((err) => console.error("Erro ao carregar perfil:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateAccountantProfile(profile);
      alert("Perfil atualizado com sucesso!");
      navigate("/acc/dashboard");
    } catch (err: any) {
      console.error("Erro ao salvar perfil:", err);
      setError(err?.response?.data?.error || "Erro ao salvar perfil. Tente novamente.");
    } finally {
      setSaving(false);
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
      <div className="max-w-4xl mx-auto">
        <GhostButton icon="arrow_back" onClick={() => navigate(-1)} className="mb-8">
          Voltar para o Dashboard
        </GhostButton>

        <div className="mb-12">
          <h1 className="text-4xl font-black text-primary tracking-tight mb-2">Editar Perfil Profissional</h1>
          <p className="text-primary/40 font-bold uppercase tracking-[0.2em] text-xs">Configure como você aparece no catálogo público</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3">
            <Icon name="error_outline" className="text-rose-500" />
            <p className="text-sm font-bold text-rose-700">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          <Card className="p-10">
            <SectionTitle title="Informações Básicas" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest px-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={profile.name || ""} 
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="w-full h-14 px-6 rounded-2xl bg-surface-1 border-2 border-outline/60 focus:border-secondary focus:bg-white transition-all outline-none font-bold text-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest px-1">Slug do Perfil (URL)</label>
                <input 
                  type="text" 
                  value={profile.slug || ""} 
                  onChange={e => setProfile({...profile, slug: e.target.value})}
                  className="w-full h-14 px-6 rounded-2xl bg-surface-1 border-2 border-outline/60 focus:border-secondary focus:bg-white transition-all outline-none font-bold text-primary"
                />
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest px-1">Biografia e Experiência</label>
              <textarea 
                rows={6}
                value={profile.bio || ""} 
                onChange={e => setProfile({...profile, bio: e.target.value})}
                className="w-full p-6 rounded-2xl bg-surface-1 border-2 border-outline/60 focus:border-secondary focus:bg-white transition-all outline-none font-bold text-primary resize-none"
              />
            </div>

            <div className="flex items-center gap-4 p-6 bg-surface-1 rounded-[24px] border-2 border-dashed border-outline/30">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-secondary border border-outline/30">
                <Icon name="verified_user" className="text-2xl" />
              </div>
              <div>
                <p className="text-sm font-black text-primary">Status de Visibilidade</p>
                <p className="text-xs font-bold text-primary/40">Seu perfil está atualmente <span className="text-emerald-500 uppercase tracking-widest font-black ml-1">Público</span></p>
              </div>
              <div className="ml-auto">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={profile.is_public} onChange={e => setProfile({...profile, is_public: e.target.checked})} className="sr-only peer" />
                  <div className="w-14 h-8 bg-primary/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>
            </div>
          </Card>

          <Card className="p-10">
            <SectionTitle title="Expertise e Atuação" />
            <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-8 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest px-1">Cidades de Atuação</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={cityInput}
                    onChange={e => setCityInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCity(); } }}
                    placeholder="Ex: São Paulo"
                    className="w-full h-14 px-6 rounded-2xl bg-surface-1 border-2 border-outline/60 focus:border-secondary focus:bg-white transition-all outline-none font-bold text-primary"
                  />
                  <button
                    type="button"
                    onClick={addCity}
                    className="h-14 px-6 rounded-2xl bg-secondary/10 text-secondary font-black uppercase text-xs tracking-widest hover:bg-secondary hover:text-white transition-all shrink-0"
                  >
                    Adicionar
                  </button>
                </div>
                {(profile.cities || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(profile.cities || []).map((c: string) => (
                      <Pill key={c} tone="gold" className="py-2 px-4 text-xs">
                        {c} <Icon name="close" className="ml-2 cursor-pointer hover:text-primary transition-colors" onClick={() => removeCity(c)} />
                      </Pill>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest px-1">UF</label>
                <input
                  type="text"
                  maxLength={2}
                  value={profile.state || ""}
                  onChange={e => setProfile({...profile, state: e.target.value.toUpperCase()})}
                  className="w-full h-14 px-6 rounded-2xl bg-surface-1 border-2 border-outline/60 focus:border-secondary focus:bg-white transition-all outline-none font-bold text-primary text-center uppercase"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest px-1">Especialidades Selecionadas</label>
              <div className="flex flex-wrap gap-3">
                {profile.specialties?.map((s: string) => (
                  <Pill key={s} tone="gold" className="py-2 px-4 text-xs">
                    {s} <Icon name="close" className="ml-2 cursor-pointer hover:text-primary transition-colors" />
                  </Pill>
                ))}
                <button className="h-10 px-4 rounded-full border-2 border-dashed border-outline/30 text-primary/30 hover:border-secondary/40 hover:text-secondary transition-all flex items-center gap-2 text-xs font-black">
                  <Icon name="add" /> Adicionar
                </button>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-6 pt-8">
            <GhostButton className="px-10 py-5" onClick={() => navigate("/acc/dashboard")}>Descartar Alterações</GhostButton>
            <GoldButton 
              className="px-16 py-5" 
              icon={saving ? "autorenew" : "save"} 
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? "Salvando..." : "Salvar Perfil Profissional"}
            </GoldButton>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
