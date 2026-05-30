import { useEffect, useState } from "react";
import {
  Card,
  GhostButton,
  GoldButton,
  Icon,
  PageContainer,
  SectionTitle,
  Field
} from "@/components/ui/connexo-primitives";
import api from "@/services/api";

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: number;
}

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [editing, setEditing] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
  });

  const loadServices = async () => {
    try {
      setLoadingList(true);
      const res = await api.get<Service[]>("/acc/servicos");
      setServices(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar serviços", err);
      // Fallback para demonstração local
      setServices([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setError(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.price || !formData.duration) {
      setError("Erro ao salvar serviço. Verifique os campos e tente novamente.");
      return;
    }

    setLoadingSubmit(true);
    setError(null);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        duration: parseInt(formData.duration, 10),
      };

      await api.post("/acc/servicos", payload);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        duration: "",
      });
      setEditing(false);
      loadServices();
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 400) {
        setError("Já existe um serviço com este título.");
      } else if (err.response) {
        setError("Erro ao salvar serviço. Verifique os campos e tente novamente.");
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
              Meus Serviços
            </span>
            <h2 className="text-3xl font-bold text-primary mt-1">Serviços Oferecidos</h2>
          </div>
          {!editing && (
            <GoldButton onClick={() => setEditing(true)}>
              <Icon name="add" className="text-base" /> Cadastrar serviço
            </GoldButton>
          )}
        </div>

        {/* Form Panel */}
        {editing && (
          <Card>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6" onChange={() => setError(null)}>
              <div className="flex items-center justify-between border-b border-outline/30 pb-4">
                <h3 className="text-base font-medium text-primary">Novo serviço</h3>
                <GhostButton onClick={() => { setEditing(false); setError(null); }} type="button">
                  Cancelar
                </GhostButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field
                  label="Título do serviço"
                  placeholder="Ex: Perícia Contábil Judicial"
                  value={formData.title}
                  onChange={(e: any) => handleInputChange("title", e.target.value)}
                  disabled={loadingSubmit}
                />

                <Field
                  label="Valor a partir de (R$)"
                  placeholder="1.800,00"
                  value={formData.price}
                  onChange={(e: any) => handleInputChange("price", e.target.value)}
                  disabled={loadingSubmit}
                />

                <Field
                  label="Prazo médio (dias)"
                  placeholder="30"
                  type="number"
                  value={formData.duration}
                  onChange={(e: any) => handleInputChange("duration", e.target.value)}
                  disabled={loadingSubmit}
                />

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em]">
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Descreva o serviço..."
                    className="w-full rounded-xl border border-outline bg-surface-2 px-4 py-3 text-base font-medium text-primary focus:border-secondary focus:ring-1 focus:ring-secondary/40 outline-none transition-all disabled:opacity-50"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    disabled={loadingSubmit}
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-rose-200/60 bg-rose-50 px-4 py-3 text-rose-700 text-xs font-bold mt-2">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-outline/30 pt-4">
                <GhostButton
                  onClick={() => { setEditing(false); setError(null); }}
                  type="button"
                  disabled={loadingSubmit}
                >
                  Cancelar
                </GhostButton>
                <GoldButton type="submit" disabled={loadingSubmit}>
                  {loadingSubmit ? (
                    <>
                      <Icon name="autorenew" className="text-base animate-spin" /> Salvando...
                    </>
                  ) : (
                    <>
                      <Icon name="check" className="text-base" /> Salvar serviço
                    </>
                  )}
                </GoldButton>
              </div>
            </form>
          </Card>
        )}

        {/* Content list */}
        {loadingList ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Icon name="autorenew" className="text-4xl text-secondary animate-spin" />
            <p className="text-sm font-medium text-primary/60">Buscando serviços...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-[32px] border-2 border-dashed border-outline/30 bg-surface py-20 text-center">
            <Icon name="business_center" className="text-4xl text-primary/10 mb-4" />
            <h3 className="text-sm font-bold text-primary/30 uppercase tracking-widest">
              Nenhum serviço cadastrado
            </h3>
            <p className="text-xs text-primary/20 mt-2">
              Clique em 'Cadastrar serviço' para adicionar sua primeira oferta.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <h4 className="text-lg font-bold text-primary">{service.title}</h4>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
                      <Icon name="business_center" className="text-secondary text-base" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-primary/70 line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-outline/30 pt-4 mt-2">
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                        Valor
                      </p>
                      <p className="text-sm font-bold text-primary">R$ {service.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                        Prazo
                      </p>
                      <p className="text-sm font-medium text-primary">{service.duration} dias</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
