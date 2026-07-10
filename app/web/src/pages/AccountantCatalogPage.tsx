import { useState, useEffect } from "react";
import { PageContainer, SectionTitle, Field, SelectField, GhostButton, Icon } from "@/components/ui/connexo-primitives";
import { AccountantCard } from "@/components/marketplace/AccountantCard";
import { listAccountants, AccountantCatalogItem } from "@/services/catalog";

export function AccountantCatalogPage() {
  const [accountants, setAccountants] = useState<AccountantCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: "",
    specialty: "",
    city: "",
    state: "",
  });

  const loadAccountants = async () => {
    setLoading(true);
    try {
      const response = await listAccountants(filters);
      setAccountants(response.data);
    } catch (error) {
      console.error("Erro ao carregar contadores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAccountants();
    }, 400); // Debounce para busca por texto
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <SectionTitle 
          title="Marketplace de Peritos" 
          kicker="Encontre o especialista ideal para seu caso"
        />
        
        <div className="flex items-center gap-3">
          <GhostButton icon="filter_list">Filtros Avançados</GhostButton>
          <GhostButton icon="sort">Ordenar por: Relevância</GhostButton>
        </div>
      </div>

      {/* Barra de Filtros Rápida */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 bg-white p-8 rounded-[24px] shadow-sm border border-outline/30">
        <Field
          label="Buscar por nome ou escritório"
          placeholder="Ex: Silva & Associados..."
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
        />
        <Field
          label="Cidade"
          placeholder="Ex: São Paulo..."
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        />
        <SelectField
          label="Especialidade"
          value={filters.specialty}
          onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
          options={[
            { label: "Todas as Especialidades", value: "" },
            { label: "Perícia Trabalhista", value: "trabalhista" },
            { label: "Perícia Previdenciária", value: "previdenciaria" },
            { label: "Perícia Fiscal/Tributária", value: "fiscal" },
            { label: "Avaliação de Empresas", value: "valuation" },
          ]}
        />
        <SelectField
          label="Estado (UF)"
          value={filters.state}
          onChange={(e) => setFilters({ ...filters, state: e.target.value })}
          options={[
            { label: "Todo o Brasil", value: "" },
            { label: "São Paulo", value: "SP" },
            { label: "Rio de Janeiro", value: "RJ" },
            { label: "Minas Gerais", value: "MG" },
            { label: "Paraná", value: "PR" },
          ]}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Icon name="autorenew" className="text-4xl text-secondary animate-spin mb-4" />
          <p className="text-primary/40 font-bold uppercase tracking-widest text-xs">Buscando especialistas...</p>
        </div>
      ) : accountants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accountants.map((acc) => (
            <AccountantCard key={acc.id} accountant={acc} />
          ))}
        </div>
      ) : (
        <div className="bg-[#F9FAFB] rounded-[32px] p-20 text-center border-2 border-dashed border-outline/50">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Icon name="search_off" className="text-3xl text-primary/20" />
          </div>
          <h4 className="text-xl font-black text-primary mb-2">Nenhum perito encontrado</h4>
          <p className="text-primary/50 font-medium max-w-sm mx-auto">
            Tente ajustar seus filtros ou buscar por termos mais genéricos para encontrar os melhores profissionais.
          </p>
        </div>
      )}
    </PageContainer>
  );
}
