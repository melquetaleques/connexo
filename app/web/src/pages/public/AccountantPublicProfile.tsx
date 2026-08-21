import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BindProcessModal } from "@/components/marketplace/BindProcessModal";
import { useToast } from "@/contexts/ToastContext";
import {
  GhostButton,
  GoldButton,
  Icon,
  PageContainer,
} from "@/components/ui/connexo-primitives";
import { getPublicProfile, getReviews } from "@/services/accountant";
import type { PublicAccountantProfile } from "@/types";
import type { ReviewWithClient } from "@/services/accountant";

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

/** Tintas dos cards de publicação, como as três faixas do mockup 09. */
const TINTAS = ["rgb(74, 15, 27)", "rgb(18, 60, 90)", "rgb(16, 82, 66)"];

export function AccountantPublicProfile() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [bindOpen, setBindOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<PublicAccountantProfile | null>(null);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [reviews, setReviews] = useState<ReviewWithClient[]>([]);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  // logo_url pode existir mas apontar para um arquivo que não carrega —
  // sem isso o hero mostra o ícone de imagem quebrada.
  const [logoErro, setLogoErro] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    const profileSlug = slug;

    async function loadProfile() {
      try {
        const data = await getPublicProfile(profileSlug);
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

    async function loadReviews() {
      try {
        setReviewsLoading(true);
        const data = await getReviews(profileSlug, { limit: 10, offset: 0 });
        setReviews(data.reviews || []);
        setReviewsTotal(data.total || 0);
      } catch (err) {
        console.error("Erro ao carregar avaliações", err);
      } finally {
        setReviewsLoading(false);
      }
    }

    loadProfile();
    loadReviews();
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
          <Link to="/public">
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

  const especialidades = (profile.specialty || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const nomeParts = profile.name.trim().split(" ");
  const nomeInicio = nomeParts.length > 1 ? nomeParts.slice(0, -1).join(" ") : profile.name;
  const nomeFim = nomeParts.length > 1 ? nomeParts[nomeParts.length - 1] : "";
  const iniciais = nomeParts
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const media = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
  const mediaLabel = media.toFixed(1).replace(".", ",");
  const destaque = reviews.find((r) => r.comment) || null;
  const demais = destaque ? reviews.filter((r) => r.id !== destaque.id) : reviews;
  const capaHero = profile.photo_urls?.[0];

  const contratar = () => {
    if (!user) {
      navigate(`/login?next=/contadores/${slug}`);
      return;
    }
    if (user.role !== "cliente") {
      addToast("Apenas clientes podem solicitar o vínculo com um perito.", "info");
      return;
    }
    setBindOpen(true);
  };

  const linhaResumo = [
    especialidades.slice(0, 2).join(" · "),
    profile.city && profile.state ? `${profile.city}, ${profile.state}` : null,
    reviewsTotal > 0 ? `${reviewsTotal} avaliações` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="font-theme-body" style={{ background: "rgb(240, 240, 232)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 24px 80px" }}>
        <div className="overflow-hidden" style={{ borderRadius: 24, background: "rgb(255, 255, 255)" }}>
          {/* Barra do escritório */}
          <div
            style={{
              background: "rgb(59, 13, 22)",
              padding: "14px 26px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <span
                className="landing-capsule"
                style={{
                  width: 34,
                  height: 34,
                  background: "rgba(255, 255, 255, 0.14)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  font: '700 13px / 1 "Hanken Grotesk", sans-serif',
                  color: "rgb(255, 255, 255)",
                }}
              >
                {iniciais}
              </span>
              <div>
                <div style={{ font: "700 15px / 1.2 Figtree, sans-serif", color: "rgb(255, 255, 255)" }}>
                  {profile.name}
                </div>
                <div style={{ font: '400 12px / 1.2 "Hanken Grotesk", sans-serif', color: "rgba(255, 255, 255, 0.55)" }}>
                  {especialidades[0] || "Perícia contábil judicial"}
                </div>
              </div>
            </div>
            <nav className="max-md:hidden" style={{ display: "flex", gap: 24 }}>
              {[
                { href: "#perfil-servicos", label: "Serviços" },
                { href: "#perfil-reputacao", label: "Reputação" },
                { href: "#perfil-insights", label: "Insights" },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  style={{
                    font: '600 14px / 1 "Hanken Grotesk", sans-serif',
                    color: "rgba(255, 255, 255, 0.82)",
                    textDecoration: "none",
                  }}
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <Link
              to="/login"
              className="landing-pill"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 38,
                padding: "0 18px",
                background: "rgb(255, 255, 255)",
                font: '700 14px / 1 "Hanken Grotesk", sans-serif',
                color: "rgb(59, 13, 22)",
                textDecoration: "none",
              }}
            >
              Área do cliente
            </Link>
          </div>

          {/* Hero */}
          <div className="relative overflow-hidden" style={{ background: "rgb(78, 24, 38)", padding: "64px 26px 120px" }}>
            {capaHero && (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${capaHero})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center 40%",
                  opacity: 0.32,
                }}
              />
            )}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(rgba(48, 12, 22, 0.55), rgba(48, 12, 22, 0.35) 42%, rgba(38, 9, 17, 0.92))",
              }}
            />
            <div className="relative" style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
              <div
                className="landing-pill"
                style={{
                  width: 62,
                  height: 62,
                  margin: "0 auto 22px",
                  overflow: "hidden",
                  background: "rgba(255, 255, 255, 0.16)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {profile.logo_url && !logoErro ? (
                  <img
                    src={profile.logo_url}
                    alt=""
                    onError={() => setLogoErro(true)}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ font: "800 20px / 1 Figtree, sans-serif", color: "rgb(255, 255, 255)" }}>{iniciais}</span>
                )}
              </div>
              <h1
                style={{
                  margin: "0 0 16px",
                  font: "800 48px / 1.06 Figtree, sans-serif",
                  letterSpacing: "-0.03em",
                  color: "rgb(255, 255, 255)",
                }}
              >
                {nomeInicio}
                {nomeFim ? <span style={{ color: "rgb(255, 154, 190)" }}> {nomeFim}</span> : null}
              </h1>
              <p
                style={{
                  margin: "0 0 26px",
                  font: '400 17px / 1.55 "Hanken Grotesk", sans-serif',
                  color: "rgba(255, 255, 255, 0.86)",
                }}
              >
                {linhaResumo}
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={contratar}
                  className="landing-pill"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    height: 46,
                    padding: "0 24px",
                    background: "rgb(255, 255, 255)",
                    font: '700 15px / 1 "Hanken Grotesk", sans-serif',
                    color: "rgb(59, 13, 22)",
                  }}
                >
                  <Icon name="handshake" className="text-lg" />
                  Contratar
                </button>
                <a
                  href="#perfil-servicos"
                  className="landing-pill"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: 46,
                    padding: "0 24px",
                    background: "rgba(255, 255, 255, 0.16)",
                    border: "1px solid rgba(255, 255, 255, 0.22)",
                    font: '700 15px / 1 "Hanken Grotesk", sans-serif',
                    color: "rgb(255, 255, 255)",
                    textDecoration: "none",
                  }}
                >
                  Ver serviços
                </a>
              </div>
            </div>
          </div>

          {/* Cartões sobrepostos */}
          <div style={{ padding: "0 26px", marginTop: -76, position: "relative", zIndex: 2 }}>
            <div className="grid gap-4 max-lg:!grid-cols-1" style={{ gridTemplateColumns: "1.25fr 1fr" }}>
              <div
                style={{
                  background: "rgb(255, 255, 255)",
                  borderRadius: 16,
                  padding: 26,
                  boxShadow: "rgba(28, 27, 26, 0.10) 0 20px 44px -22px",
                }}
              >
                <div
                  style={{
                    font: '600 10px / 1 "Hanken Grotesk", sans-serif',
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgb(154, 90, 43)",
                    marginBottom: 14,
                  }}
                >
                  Perito
                </div>
                <div style={{ font: "700 21px / 1.25 Figtree, sans-serif", color: "rgb(59, 13, 22)", marginBottom: 16 }}>
                  {profile.name}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {profile.city && profile.state && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Icon name="location_on" className="text-base" style={{ color: "rgb(193, 30, 99)" }} />
                      <span style={{ font: '400 14px / 1.4 "Hanken Grotesk", sans-serif', color: "rgb(92, 74, 78)" }}>
                        {profile.city}, {profile.state}
                      </span>
                    </div>
                  )}
                  {profile.email && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Icon name="mail" className="text-base" style={{ color: "rgb(193, 30, 99)" }} />
                      <span style={{ font: '400 14px / 1.4 "Hanken Grotesk", sans-serif', color: "rgb(92, 74, 78)" }}>
                        {profile.email}
                      </span>
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon name="schedule" className="text-base" style={{ color: "rgb(193, 30, 99)" }} />
                    <span style={{ font: '400 14px / 1.4 "Hanken Grotesk", sans-serif', color: "rgb(92, 74, 78)" }}>
                      {availConfig.label}
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "rgb(255, 255, 255)",
                  borderRadius: 16,
                  padding: 26,
                  boxShadow: "rgba(28, 27, 26, 0.10) 0 20px 44px -22px",
                }}
              >
                <div
                  style={{
                    font: '600 10px / 1 "Hanken Grotesk", sans-serif',
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgb(154, 90, 43)",
                    marginBottom: 14,
                  }}
                >
                  Reputação
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
                  {media > 0 && (
                    <span style={{ font: "800 34px / 1 Figtree, sans-serif", color: "rgb(59, 13, 22)" }}>
                      {mediaLabel}
                    </span>
                  )}
                  <span style={{ font: '400 14px / 1 "Hanken Grotesk", sans-serif', color: "rgb(140, 127, 130)" }}>
                    {reviewsTotal > 0 ? `de ${reviewsTotal} avaliações` : "Sem avaliações ainda"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Icon
                      key={s}
                      name={s <= Math.round(media) ? "star" : "star_outline"}
                      className="text-lg"
                      style={{ color: s <= Math.round(media) ? "rgb(193, 30, 99)" : "rgb(214, 208, 205)" }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={contratar}
                  className="landing-pill"
                  style={{
                    width: "100%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 9,
                    height: 46,
                    background: "rgb(28, 27, 26)",
                    font: '700 15px / 1 "Hanken Grotesk", sans-serif',
                    color: "rgb(255, 255, 255)",
                  }}
                >
                  <Icon name="handshake" className="text-lg" />
                  Solicitar vínculo
                </button>
              </div>
            </div>
          </div>

          {/* Serviços */}
          <div id="perfil-servicos" style={{ padding: "72px 26px 0" }}>
            <h2
              style={{
                margin: "0 0 12px",
                font: "800 34px / 1.14 Figtree, sans-serif",
                letterSpacing: "-0.03em",
                color: "rgb(59, 13, 22)",
              }}
            >
              Perícia contábil <span style={{ color: "rgb(193, 30, 99)" }}>sob medida</span>
            </h2>
            {profile.bio && (
              <p
                style={{
                  margin: "0 0 34px",
                  font: '400 16px / 1.6 "Hanken Grotesk", sans-serif',
                  color: "rgb(92, 74, 78)",
                  maxWidth: "68ch",
                  whiteSpace: "pre-line",
                }}
              >
                {profile.bio}
              </p>
            )}
            {especialidades.length > 0 && (
              <div
                className="grid gap-4 max-lg:!grid-cols-2 max-sm:!grid-cols-1"
                style={{ gridTemplateColumns: `repeat(${Math.min(especialidades.length, 4)}, minmax(0, 1fr))` }}
              >
                {especialidades.map((esp) => (
                  <div
                    key={esp}
                    style={{
                      background: "rgb(255, 255, 255)",
                      border: "1px solid rgb(234, 231, 226)",
                      borderRadius: 16,
                      padding: 22,
                    }}
                  >
                    <span
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        background: "rgb(253, 238, 244)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}
                    >
                      <Icon name="receipt_long" className="text-lg" style={{ color: "rgb(193, 30, 99)" }} />
                    </span>
                    <div style={{ font: "700 16px / 1.3 Figtree, sans-serif", color: "rgb(28, 27, 26)", marginBottom: 6 }}>
                      {esp}
                    </div>
                    <div style={{ font: '400 13px / 1.5 "Hanken Grotesk", sans-serif', color: "rgb(124, 114, 109)" }}>
                      Atuação como perito nomeado ou assistente técnico.
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reputação */}
          <div id="perfil-reputacao" style={{ padding: "72px 26px 0" }}>
            <div
              className="landing-pill"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "8px 16px",
                background: "rgb(255, 255, 255)",
                border: "1px solid rgb(234, 231, 226)",
                marginBottom: 18,
              }}
            >
              <Icon name="star" className="text-base" style={{ color: "rgb(193, 30, 99)" }} />
              <span style={{ font: '600 13px / 1 "Hanken Grotesk", sans-serif', color: "rgb(59, 13, 22)" }}>
                {media > 0 ? `Avaliação ${mediaLabel} / 5,0 · ${reviewsTotal} avaliações` : "Ainda sem avaliações"}
              </span>
            </div>

            <div className="grid gap-8 max-lg:!grid-cols-1" style={{ gridTemplateColumns: "1fr 1.1fr", alignItems: "start" }}>
              <h2
                style={{
                  margin: 0,
                  font: "800 34px / 1.14 Figtree, sans-serif",
                  letterSpacing: "-0.03em",
                  color: "rgb(59, 13, 22)",
                }}
              >
                Confiança construída laudo após laudo
              </h2>
              {destaque && (
                <div
                  style={{
                    background: "rgb(255, 255, 255)",
                    border: "1px solid rgb(234, 231, 226)",
                    borderRadius: 16,
                    padding: 26,
                  }}
                >
                  <p style={{ margin: "0 0 16px", font: '400 16px / 1.6 "Hanken Grotesk", sans-serif', color: "rgb(59, 13, 22)" }}>
                    {`“${destaque.comment}”`}
                  </p>
                  <div style={{ font: '600 14px / 1.3 "Hanken Grotesk", sans-serif', color: "rgb(28, 27, 26)" }}>
                    {destaque.client_name || "Cliente"}
                  </div>
                  <div style={{ font: '400 13px / 1.3 "Hanken Grotesk", sans-serif', color: "rgb(140, 127, 130)" }}>
                    {new Date(destaque.submitted_at).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              )}
            </div>

            {reviewsLoading ? (
              <div className="flex items-center justify-center" style={{ padding: "40px 0" }}>
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary/20 border-t-secondary" />
              </div>
            ) : reviews.length === 0 ? (
              <div
                style={{
                  marginTop: 26,
                  border: "1px dashed rgb(228, 226, 222)",
                  borderRadius: 16,
                  padding: 40,
                  textAlign: "center",
                  font: '400 14px / 1.5 "Hanken Grotesk", sans-serif',
                  color: "rgb(140, 127, 130)",
                }}
              >
                Este perito ainda não recebeu avaliações de clientes.
              </div>
            ) : (
              <>
                <div
                  className="grid gap-4 max-lg:!grid-cols-1"
                  style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", marginTop: 26 }}
                >
                  {demais.slice(0, 3).map((review) => (
                    <div
                      key={review.id}
                      style={{
                        background: "rgb(255, 255, 255)",
                        border: "1px solid rgb(234, 231, 226)",
                        borderRadius: 16,
                        padding: 22,
                      }}
                    >
                      <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Icon
                            key={s}
                            name={s <= review.rating ? "star" : "star_outline"}
                            className="text-sm"
                            style={{ color: s <= review.rating ? "rgb(193, 30, 99)" : "rgb(214, 208, 205)" }}
                          />
                        ))}
                      </div>
                      {review.comment && (
                        <p style={{ margin: "0 0 14px", font: '400 14px / 1.55 "Hanken Grotesk", sans-serif', color: "rgb(59, 13, 22)" }}>
                          {review.comment}
                        </p>
                      )}
                      <div style={{ font: '600 13px / 1.3 "Hanken Grotesk", sans-serif', color: "rgb(28, 27, 26)" }}>
                        {review.client_name || "Cliente"}
                      </div>
                      {review.reply_text && (
                        <div style={{ marginTop: 14, paddingLeft: 12, borderLeft: "2px solid rgb(253, 238, 244)" }}>
                          <div
                            style={{
                              font: '600 10px / 1 "Hanken Grotesk", sans-serif',
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                              color: "rgb(193, 30, 99)",
                              marginBottom: 6,
                            }}
                          >
                            Resposta do perito
                          </div>
                          <p style={{ margin: 0, font: '400 13px / 1.5 "Hanken Grotesk", sans-serif', color: "rgb(92, 74, 78)" }}>
                            {review.reply_text}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {reviewsTotal > reviews.length && (
                  <p
                    style={{
                      marginTop: 18,
                      textAlign: "center",
                      font: '600 13px / 1 "Hanken Grotesk", sans-serif',
                      color: "rgb(140, 127, 130)",
                    }}
                  >
                    Mostrando {reviews.length} de {reviewsTotal} avaliações
                  </p>
                )}
              </>
            )}
          </div>

          {/* Publicações */}
          {posts.length > 0 && (
            <div id="perfil-insights" style={{ padding: "72px 26px 0" }}>
              <h2
                style={{
                  margin: "0 0 10px",
                  font: "800 34px / 1.14 Figtree, sans-serif",
                  letterSpacing: "-0.03em",
                  color: "rgb(59, 13, 22)",
                }}
              >
                Páginas internas
              </h2>
              <p style={{ margin: "0 0 30px", font: '400 15px / 1.55 "Hanken Grotesk", sans-serif', color: "rgb(92, 74, 78)" }}>
                Conteúdo técnico publicado pelo perito, dentro do Provimento 205/2021.
              </p>
              <div className="grid gap-4 max-lg:!grid-cols-1" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
                {posts.slice(0, 6).map((post, i) => (
                  <article
                    key={post.id}
                    className="overflow-hidden"
                    style={{ borderRadius: 16, background: "rgb(255, 255, 255)", border: "1px solid rgb(234, 231, 226)" }}
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{
                        height: 150,
                        background: TINTAS[i % TINTAS.length],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {post.cover_url ? (
                        <img
                          src={post.cover_url}
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }}
                        />
                      ) : (
                        <Icon name="article" className="text-4xl" style={{ color: "rgba(255, 255, 255, 0.35)" }} />
                      )}
                    </div>
                    <div style={{ padding: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <span
                          style={{
                            font: '700 10px / 1 "Hanken Grotesk", sans-serif',
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "rgb(193, 30, 99)",
                          }}
                        >
                          {post.tag}
                        </span>
                        <span style={{ font: '400 11px / 1 "Hanken Grotesk", sans-serif', color: "rgb(163, 154, 147)" }}>
                          {new Date(post.published_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <h3 style={{ margin: "0 0 8px", font: "700 16px / 1.3 Figtree, sans-serif", color: "rgb(28, 27, 26)" }}>
                        {post.title}
                      </h3>
                      <p style={{ margin: 0, font: '400 13px / 1.5 "Hanken Grotesk", sans-serif', color: "rgb(124, 114, 109)" }}>
                        {post.excerpt}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Galeria */}
          {profile.photo_urls && profile.photo_urls.length > 0 && (
            <div style={{ padding: "72px 26px 0" }}>
              <div
                className="grid gap-4 max-lg:!grid-cols-2"
                style={{ gridTemplateColumns: `repeat(${Math.min(profile.photo_urls.length, 4)}, minmax(0, 1fr))` }}
              >
                {profile.photo_urls.slice(0, 8).map((url, idx) => (
                  <div key={idx} className="overflow-hidden" style={{ borderRadius: 16, aspectRatio: "4 / 3" }}>
                    <img
                      src={url}
                      alt=""
                      className="transition-transform duration-500 hover:scale-105 motion-reduce:hover:scale-100"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fecho */}
          <div style={{ padding: "72px 26px 26px" }}>
            <div
              className="relative overflow-hidden"
              style={{ borderRadius: 20, background: "rgb(28, 27, 26)", padding: "48px 40px", textAlign: "center" }}
            >
              <h2
                style={{
                  margin: "0 0 12px",
                  font: "800 30px / 1.16 Figtree, sans-serif",
                  letterSpacing: "-0.02em",
                  color: "rgb(255, 255, 255)",
                }}
              >
                Comece o rito com {profile.name}
              </h2>
              <p
                style={{
                  margin: "0 0 26px",
                  font: '400 15px / 1.55 "Hanken Grotesk", sans-serif',
                  color: "rgba(255, 255, 255, 0.66)",
                }}
              >
                Vínculo autorizado, escopo definido e laudo versionado no mesmo expediente.
              </p>
              <button
                type="button"
                onClick={contratar}
                className="landing-pill"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  height: 46,
                  padding: "0 26px",
                  background: "rgb(255, 255, 255)",
                  font: '700 15px / 1 "Hanken Grotesk", sans-serif',
                  color: "rgb(28, 27, 26)",
                }}
              >
                <Icon name="handshake" className="text-lg" />
                Contratar
              </button>
            </div>
          </div>
        </div>
      </div>

      {bindOpen && profile && (
        <BindProcessModal
          accountant={{ id: profile.id, name: profile.name }}
          onClose={() => setBindOpen(false)}
          onSuccess={() => {
            setBindOpen(false);
            addToast("Solicitação de vínculo enviada.", "success");
            navigate("/cli/processos");
          }}
        />
      )}
    </div>
  );
}
