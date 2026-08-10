import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageContainer, GoldButton, Avatar, Icon, Card, SectionTitle, GhostButton } from "@/components/ui/connexo-primitives";
import { getAccountantProfile, AccountantCatalogItem } from "@/services/catalog";
import { BindProcessModal } from "@/components/marketplace/BindProcessModal";

export function AccountantPublicProfile() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [accountant, setAccountant] = useState<AccountantCatalogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await getAccountantProfile(slug);
        setAccountant(data);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Icon name="autorenew" className="text-4xl text-secondary animate-spin" />
      </div>
    );
  }

  if (!accountant) {
    return (
      <PageContainer className="text-center py-20">
        <h2 className="text-2xl font-black text-primary mb-4">Perfil não encontrado</h2>
        <GoldButton onClick={() => navigate("/cli/catalogo")}>Voltar ao Catálogo</GoldButton>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <GhostButton icon="arrow_back" onClick={() => navigate(-1)} className="mb-8">
        Voltar
      </GhostButton>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Lado Esquerdo - Perfil e Ação */}
        <div className="lg:col-span-1">
          <Card className="text-center p-10 sticky top-24">
            <div className="relative inline-block mb-6">
              <div className="flex justify-center mb-6">
                <Avatar 
                  initials={accountant.name.split(" ").map(n => n[0]).join("").toUpperCase()} 
                  size="lg" 
                  tone="navy"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <Icon name="verified" className="text-white text-xs" />
              </div>
            </div>

            <h1 className="text-2xl font-black text-primary mb-2 leading-tight">{accountant.name}</h1>
            <p className="text-secondary font-bold text-sm uppercase tracking-widest mb-6">Contador Perito Judicial</p>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="text-center">
                <p className="text-2xl font-black text-primary">{accountant.rating.toFixed(1)}</p>
                <div className="flex text-secondary justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} name="star" fill={i < Math.floor(accountant.rating)} className="text-[10px]" />
                  ))}
                </div>
              </div>
              <div className="w-px h-10 bg-outline/30" />
              <div className="text-center">
                <p className="text-2xl font-black text-primary">{accountant.completed_cases}</p>
                <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest">Perícias</p>
              </div>
            </div>

            <GoldButton 
              className="w-full py-5 text-sm mb-4" 
              icon="handshake"
              onClick={() => setIsModalOpen(true)}
            >
              Contratar para Processo
            </GoldButton>
            <GhostButton className="w-full py-4 text-xs font-bold" icon="mail" disabled title="Mensagens em desenvolvimento">
              Enviar Mensagem
            </GhostButton>
          </Card>
        </div>

        {/* Lado Direito - Detalhes */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <SectionTitle title="Sobre o Profissional" />
            <p className="text-lg text-primary/70 leading-relaxed font-medium">
              {accountant.bio || "Este profissional ainda não preencheu sua biografia detalhada. Entre em contato para mais informações sobre sua experiência e metodologia de trabalho."}
            </p>
          </section>

          <section>
            <SectionTitle title="Especialidades e Expertise" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accountant.specialties.map((spec) => (
                <div key={spec} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-outline/30 group hover:border-secondary/40 transition-colors">
                  <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                    <Icon name="check_circle" className="text-xl" />
                  </div>
                  <span className="font-bold text-primary">{spec}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle title="Informações de Registro" />
            <Card padded={false} className="overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="p-6 border-r border-outline/30">
                  <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-1">Número CRC</p>
                  <p className="text-lg font-black text-primary">{accountant.crc_number}</p>
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-1">Estado de Atuação</p>
                  <p className="text-lg font-black text-primary">{accountant.city}, {accountant.state}</p>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>

      {isModalOpen && accountant && (
        <BindProcessModal 
          accountant={accountant} 
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            alert("Vínculo solicitado com sucesso! O perito será notificado.");
          }}
        />
      )}
    </PageContainer>
  );
}
