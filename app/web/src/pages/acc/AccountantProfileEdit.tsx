import { useEffect, useState, useRef } from "react";
import {
  Card,
  GhostButton,
  GoldButton,
  Icon,
  PageContainer,
  SectionTitle,
  Field,
  Pill,
} from "@/components/ui/connexo-primitives";
import {
  getMyProfile,
  updateMyProfile,
  uploadLogo,
  uploadPhoto,
  updateAvailability,
  type ProfileUpdateData,
} from "@/services/accountant";

type AvailabilityStatus = "disponivel" | "parcial" | "indisponivel";

const AVAILABILITY_OPTIONS: { value: AvailabilityStatus; label: string; color: string; tone: "success" | "warning" | "muted" }[] = [
  { value: "disponivel", label: "Disponível", color: "bg-emerald-500", tone: "success" },
  { value: "parcial", label: "Disponibilidade Limitada", color: "bg-amber-500", tone: "warning" },
  { value: "indisponivel", label: "Indisponível", color: "bg-gray-400", tone: "muted" },
];

export function AccountantProfileEdit() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfileUpdateData>({
    name: "",
    bio: "",
    specialty: "",
    city: "",
    state: "",
  });

  const [availability, setAvailability] = useState<AvailabilityStatus>("disponivel");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getMyProfile();
        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          specialty: data.specialty || "",
          city: data.city || "",
          state: data.state || "",
        });
        setAvailability(data.availability || "disponivel");
        setLogoUrl(data.logo_url || "");
        setPhotoUrls(data.photo_urls || []);
      } catch (err) {
        console.error("Erro ao carregar perfil", err);
        setError("Não foi possível carregar seu perfil.");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setError(null);
    setSuccess(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateMyProfile(formData);
      setSuccess("Perfil atualizado com sucesso!");
      setTimeout(() => setSuccess(null), 6000);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Logo excede o limite de 5MB.");
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Formato não suportado. Use JPEG ou PNG.");
      return;
    }

    setUploadingLogo(true);
    setError(null);
    try {
      const result = await uploadLogo(file);
      setLogoUrl(result.url);
      setSuccess("Logo atualizado com sucesso!");
      setTimeout(() => setSuccess(null), 6000);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao fazer upload do logo.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("Foto excede o limite de 10MB.");
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Formato não suportado. Use JPEG ou PNG.");
      return;
    }

    if (photoUrls.length >= 5) {
      setError("Máximo de 5 fotos atingido.");
      return;
    }

    setUploadingPhoto(true);
    setError(null);
    try {
      const result = await uploadPhoto(file);
      setPhotoUrls((prev) => [...prev, result.url]);
      setSuccess("Foto adicionada com sucesso!");
      setTimeout(() => setSuccess(null), 6000);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao fazer upload da foto.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleAvailabilityChange = async (status: AvailabilityStatus) => {
    setError(null);
    setSuccess(null);
    try {
      await updateAvailability({ availability: status });
      setAvailability(status);
      setSuccess("Disponibilidade atualizada!");
      setTimeout(() => setSuccess(null), 6000);
    } catch (err: any) {
      console.error(err);
      setError("Erro ao atualizar disponibilidade.");
    }
  };

  const currentAvail = AVAILABILITY_OPTIONS.find((o) => o.value === availability) || AVAILABILITY_OPTIONS[0];

  if (loading) {
    return (
      <PageContainer>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary/20 border-t-secondary" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/40">Carregando Perfil...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        {/* Header */}
        <div>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">
            Editar Perfil
          </span>
          <h2 className="text-3xl font-bold text-primary mt-1">Perfil Público do Contador</h2>
        </div>

        {/* Success Banner */}
        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700 text-sm font-bold flex items-center gap-3">
            <Icon name="check_circle" className="text-lg text-emerald-500" />
            {success}
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700 text-sm font-bold flex items-center gap-3">
            <Icon name="error_outline" className="text-lg text-rose-500" />
            {error}
          </div>
        )}

        {/* Logo Section */}
        <Card>
          <SectionTitle title="Logo" kicker="Imagem de marca" />
          <div className="flex items-center gap-6 mt-4">
            <div className="w-24 h-24 rounded-full bg-surface-2 border-2 border-dashed border-outline/40 flex items-center justify-center overflow-hidden shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover rounded-full" />
              ) : (
                <Icon name="image" className="text-3xl text-primary/20" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold text-primary/60">JPEG ou PNG • Máx 5MB</p>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleLogoChange}
                disabled={uploadingLogo}
              />
              <GoldButton
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingLogo}
                className="text-xs"
              >
                {uploadingLogo ? (
                  <>
                    <Icon name="autorenew" className="text-sm animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    <Icon name="upload" className="text-sm" /> {logoUrl ? "Trocar Logo" : "Adicionar Logo"}
                  </>
                )}
              </GoldButton>
            </div>
          </div>
        </Card>

        {/* Fotos Section */}
        <Card>
          <SectionTitle title="Fotos" kicker={`${photoUrls.length}/5 adicionadas`} />
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-4">
            {photoUrls.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-surface-2 border border-outline/30 group">
                <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
            {photoUrls.length < 5 && (
              <button
                onClick={() => photoInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="aspect-square rounded-xl border-2 border-dashed border-outline/40 bg-surface-2 flex flex-col items-center justify-center gap-1 hover:border-secondary/60 hover:bg-secondary/5 transition-all group"
              >
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handlePhotoChange}
                  disabled={uploadingPhoto}
                />
                {uploadingPhoto ? (
                  <Icon name="autorenew" className="text-xl text-secondary animate-spin" />
                ) : (
                  <>
                    <Icon name="add_photo_alternate" className="text-xl text-primary/30 group-hover:text-secondary transition-colors" />
                    <span className="text-[10px] font-bold text-primary/30 uppercase tracking-wider">Adicionar</span>
                  </>
                )}
              </button>
            )}
          </div>
          {photoUrls.length === 0 && !uploadingPhoto && (
            <p className="text-xs font-medium text-primary/40 mt-2">Nenhuma foto adicionada ainda.</p>
          )}
        </Card>

        {/* Availability Section */}
        <Card>
          <SectionTitle title="Disponibilidade" kicker="Status para clientes" />
          <div className="flex flex-wrap gap-3 mt-4">
            {AVAILABILITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAvailabilityChange(opt.value)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                  availability === opt.value
                    ? "border-secondary/60 bg-secondary/10 text-secondary"
                    : "border-outline/40 bg-surface-2 text-primary/50 hover:border-primary/30 hover:text-primary"
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${opt.color}`} />
                {opt.label}
              </button>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl bg-surface-2 border border-outline/30">
            <p className="text-xs font-medium text-primary/60">
              <span className="font-bold text-primary">Status atual:</span>{" "}
              <Pill tone={currentAvail.tone as any}>
                <div className={`w-1.5 h-1.5 rounded-full ${currentAvail.color} inline-block mr-1.5`} />
                {currentAvail.label}
              </Pill>
            </p>
          </div>
        </Card>

        {/* Profile Fields */}
        <Card>
          <SectionTitle title="Informações do Perfil" kicker="Dados pessoais e profissionais" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Field
              label="Nome completo"
              placeholder="Seu nome"
              value={formData.name || ""}
              onChange={(e: any) => handleInputChange("name", e.target.value)}
              disabled={saving}
            />
            <Field
              label="Especialidade"
              placeholder="Ex: Perícia Contábil Judicial"
              value={formData.specialty || ""}
              onChange={(e: any) => handleInputChange("specialty", e.target.value)}
              disabled={saving}
            />
            <Field
              label="Cidade"
              placeholder="Sua cidade"
              value={formData.city || ""}
              onChange={(e: any) => handleInputChange("city", e.target.value)}
              disabled={saving}
            />
            <Field
              label="Estado"
              placeholder="UF"
              value={formData.state || ""}
              onChange={(e: any) => handleInputChange("state", e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em]">
              Biografia
            </label>
            <textarea
              rows={5}
              placeholder="Conte um pouco sobre sua trajetória profissional..."
              className="w-full rounded-xl border border-outline bg-surface-2 px-4 py-3 text-base font-medium text-primary focus:border-secondary focus:ring-1 focus:ring-secondary/40 outline-none transition-all disabled:opacity-50"
              value={formData.bio || ""}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="flex justify-end mt-8">
            <GoldButton onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Icon name="autorenew" className="text-base animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <Icon name="save" className="text-base" /> Salvar Perfil
                </>
              )}
            </GoldButton>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
