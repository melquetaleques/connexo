import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  GhostButton,
  GoldButton,
  Icon,
  PageContainer,
  Pill,
} from "@/components/ui/connexo-primitives";
import { getPublicProfile } from "@/services/accountant";
import type { PublicAccountantProfile } from "@/types";

interface PostItem {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  cover_url: string;
  status: string;
  published_at: string;
}

const AVAILABILITY_CONFIG: Record<string, { label: string; color: string; tone: "success" | "warning" | "muted" }> = {
  disponivel: { label: "Disponível", color: "bg-emerald-500", tone: "success" },
  parcial: { label: "Disponibilidade Limitada", color: "bg-amber-500", tone: "warning" },
  indisponivel: { label: "Indisponível", color: "bg-gray-400", tone: "muted" },
};

export function AccountantPublicProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<PublicAccountantProfile | null>(null);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    async function loadProfile() {
      try {
        const data = await getPublicProfile(slug);
        setProfile(data.profile);
        setPosts(data.posts || []);
      } catch (err: any) {
        console.error("Erro ao carregar perfil público", err);
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("Não foi possível carregar o perfil do contador.");
        }
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [slug]);

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

  if (notFound) {
    return (
      <PageContainer>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-6 text-center">
          <Icon name="person_off" className="text-6xl text-primary/10" />
          <div>
            <h2 className="text-2xl font-black text-primary">Perfil não encontrado</h2>
            <p className="text-sm font-medium text-primary/50 mt-2">
              O contador que você está procurando não existe ou o link está incorreto.
            </p>
          </div>
          <Link to="/cli/catalogo">
            <GoldButton icon="search">Explorar Catálogo</GoldButton>
          </Link>
        </div>
      </PageContainer>
    );
  }

  if (error || !profile) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center">
          <Icon name="error_outline" className="text-4xl text-rose-400 mb-4" />
          <p className="text-sm font-bold text-rose-700">{error || "Erro ao carregar perfil"}</p>
          <GhostButton onClick={() => window.location.reload()} className="mt-4">
            Tentar Novamente
          </GhostButton>
        </div>
      </PageContainer>
    );
  }

  const availConfig = AVAILABILITY_CONFIG[profile.availability] || AVAILABILITY_CONFIG.disponivel;

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* ======== Section 1: Header ======== */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

          {/* Background accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary to-secondary/40" />

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
            {/* Logo */}
            <div className="w-28 h-28 rounded-2xl bg-surface-2 border-2 border-outline/40 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
              {profile.logo_url ? (
                <img src={profile.logo_url} alt={`${profile.name} logo`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/20 to-primary/20">
                  <Icon name="account_balance" className="text-4xl text-secondary/40" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl font-black text-primary tracking-tight">{profile.name}</h1>
                <Pill tone={availConfig.tone as any}>
                  <div className={`w-1.5 h-1.5 rounded-full ${availConfig.color} inline-block mr-1.5`} />
                  {availConfig.label}
                </Pill>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-primary/60">
                {profile.city && profile.state && (
                  <span className="flex items-center gap-1.5">
                    <Icon name="location_on" className="text-base text-secondary" />
                    {profile.city}, {profile.state}
                  </span>
                )}
                {profile.specialty && (
                  <span className="flex items-center gap-1.5">
                    <Icon name="star" className="text-base text-amber-500" />
                    {profile.specialty}
                  </span>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="shrink-0 w-full md:w-auto">
              <GoldButton icon="handshake" className="w-full md:w-auto">
                Contratar
              </GoldButton>
            </div>
          </div>
        </Card>

        {/* ======== Fotos Gallery ======== */}
        {profile.photo_urls && profile.photo_urls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {profile.photo_urls.map((url, idx) => (
              <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-surface-2 border border-outline/30 shadow-sm">
                <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* ======== Section 2: Bio ======== */}
        {profile.bio && (
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Icon name="description" className="text-secondary" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">Sobre</p>
                <h3 className="text-lg font-black text-primary tracking-tight">Biografia</h3>
              </div>
            </div>
            <p className="text-sm font-medium text-primary/80 leading-relaxed whitespace-pre-line">
              {profile.bio}
            </p>
          </Card>
        )}

        {/* ======== Section 3: Especialidades ======== */}
        {profile.specialty && (
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Icon name="local_offer" className="text-secondary" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">Áreas de Atuação</p>
                <h3 className="text-lg font-black text-primary tracking-tight">Especialidades</h3>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.specialty.split(",").map((spec, idx) => (
                <Pill key={idx} tone="gold" className="px-4 py-1.5 text-xs font-bold">
                  {spec.trim()}
                </Pill>
              ))}
            </div>
          </Card>
        )}

        {/* ======== Section 4: Serviços ======== */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Icon name="business_center" className="text-secondary" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">Ofertas</p>
              <h3 className="text-lg font-black text-primary tracking-tight">Serviços</h3>
            </div>
          </div>

          {/* Mock services for display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-outline/30 bg-surface-2 hover:border-secondary/40 transition-all group cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-sm font-bold text-primary">Perícia Contábil Judicial</h4>
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Icon name="receipt_long" className="text-secondary text-sm" />
                </div>
              </div>
              <p className="text-xs font-medium text-primary/60 mb-4 line-clamp-2">
                Análise detalhada de documentos contábeis para instrução processual.
              </p>
              <div className="flex items-center justify-between border-t border-outline/20 pt-3">
                <span className="text-sm font-bold text-primary">R$ 1.800</span>
                <span className="text-[10px] font-bold text-primary/40 uppercase tracking-wider">30 dias</span>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-outline/30 bg-surface-2 hover:border-secondary/40 transition-all group cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-sm font-bold text-primary">Parecer Técnico-Contábil</h4>
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Icon name="description" className="text-secondary text-sm" />
                </div>
              </div>
              <p className="text-xs font-medium text-primary/60 mb-4 line-clamp-2">
                Elaboração de parecer técnico com fundamentação contábil para suporte jurídico.
              </p>
              <div className="flex items-center justify-between border-t border-outline/20 pt-3">
                <span className="text-sm font-bold text-primary">R$ 2.500</span>
                <span className="text-[10px] font-bold text-primary/40 uppercase tracking-wider">20 dias</span>
              </div>
            </div>
          </div>
        </Card>

        {/* ======== Section 5: Posts ======== */}
        {posts.length > 0 && (
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Icon name="article" className="text-secondary" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">Publicações</p>
                <h3 className="text-lg font-black text-primary tracking-tight">Artigos & Conteúdo</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="rounded-xl border border-outline/30 bg-surface-2 overflow-hidden hover:border-secondary/30 transition-all group">
                  {post.cover_url && (
                    <div className="h-44 overflow-hidden">
                      <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Pill tone="gold" className="text-[10px] px-2.5 py-0.5">{post.tag}</Pill>
                      <span className="text-[10px] font-bold text-primary/30 uppercase tracking-wider">
                        {new Date(post.published_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-primary mb-2 line-clamp-2">{post.title}</h4>
                    <p className="text-xs font-medium text-primary/60 line-clamp-3">{post.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ======== Section 6: Avaliações (placeholder) ======== */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Icon name="star" className="text-secondary" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">Feedback</p>
              <h3 className="text-lg font-black text-primary tracking-tight">Avaliações</h3>
            </div>
          </div>

          <div className="rounded-xl border-2 border-dashed border-outline/30 bg-surface-2 p-10 text-center">
            <Icon name="rate_review" className="text-5xl text-primary/10 mb-4" />
            <h4 className="text-sm font-bold text-primary/30 uppercase tracking-widest mb-2">
              Em Breve
            </h4>
            <p className="text-xs font-medium text-primary/20 max-w-md mx-auto">
              O sistema de avaliações está sendo desenvolvido. Em breve, clientes e advogados poderão avaliar
              os serviços prestados por este contador.
            </p>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
