import { useEffect, useState } from "react";
import {
  Card,
  GhostButton,
  GoldButton,
  Icon,
  PageContainer,
  SectionTitle,
  Field,
  Pill
} from "@/components/ui/connexo-primitives";
import api from "@/services/api";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tag: string;
  cover_url: string;
  status: string;
  published_at: string;
}

const CATEGORIES = ["Tributário", "Empresarial", "Trabalhista", "Carreira", "Sucessões", "Cível"];

export function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [composing, setComposing] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    cover_url: "",
    tag: "",
  });

  const loadPosts = async () => {
    try {
      setLoadingList(true);
      const res = await api.get<Post[]>("/acc/postagens");
      setPosts(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar postagens", err);
      // Fallback local
      setPosts([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setError(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectTag = (tag: string) => {
    setError(null);
    setFormData((prev) => ({ ...prev, tag }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt || !formData.content || !formData.cover_url || !formData.tag) {
      setError("Erro ao publicar. Verifique os campos e tente novamente.");
      return;
    }

    setLoadingSubmit(true);
    setError(null);

    try {
      const payload = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_url: formData.cover_url,
        tag: formData.tag,
      };

      await api.post("/acc/postagens", payload);

      setFormData({
        title: "",
        excerpt: "",
        content: "",
        cover_url: "",
        tag: "",
      });
      setComposing(false);
      loadPosts();
    } catch (err: any) {
      console.error(err);
      if (err.response) {
        setError("Erro ao publicar. Verifique os campos e tente novamente.");
      } else {
        setError("Sem conexão. Tente novamente.");
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
              Conteúdo Editorial
            </span>
            <h2 className="text-3xl font-bold text-primary mt-1">Artigos & Publicações</h2>
          </div>
          {!composing && (
            <GoldButton onClick={() => setComposing(true)}>
              <Icon name="add" className="text-base" /> Nova postagem
            </GoldButton>
          )}
        </div>

        {/* Compose Panel */}
        {composing && (
          <Card>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6" onChange={() => setError(null)}>
              <div className="flex items-center justify-between border-b border-outline/30 pb-4">
                <h3 className="text-base font-medium text-primary">Nova postagem</h3>
                <GhostButton onClick={() => { setComposing(false); setError(null); }} type="button">
                  Cancelar
                </GhostButton>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <Field
                  label="URL da capa"
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.cover_url}
                  onChange={(e: any) => handleInputChange("cover_url", e.target.value)}
                  disabled={loadingSubmit}
                />

                {formData.cover_url && (
                  <div className="h-48 w-full rounded-2xl overflow-hidden bg-surface-2 border border-outline/50 flex items-center justify-center">
                    <img
                      src={formData.cover_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                <Field
                  label="Título"
                  placeholder="Sobre o que você quer escrever?"
                  value={formData.title}
                  onChange={(e: any) => handleInputChange("title", e.target.value)}
                  disabled={loadingSubmit}
                />

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em]">
                    Resumo
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Resumo curto que aparece no card..."
                    className="w-full rounded-xl border border-outline bg-surface-2 px-4 py-3 text-base font-medium text-primary focus:border-secondary focus:ring-1 focus:ring-secondary/40 outline-none transition-all disabled:opacity-50"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange("excerpt", e.target.value)}
                    disabled={loadingSubmit}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em]">
                    Categoria
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                      const isSelected = formData.tag === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleSelectTag(cat)}
                          disabled={loadingSubmit}
                          className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                            isSelected
                              ? "bg-secondary/10 border-secondary/40 text-secondary"
                              : "border-outline bg-surface text-primary/60 hover:text-primary hover:border-primary/40"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.3em]">
                    Conteúdo
                  </label>
                  <textarea
                    rows={8}
                    placeholder="Escreva o conteúdo completo do artigo..."
                    className="w-full rounded-xl border border-outline bg-surface-2 px-4 py-3 text-base font-medium text-primary focus:border-secondary focus:ring-1 focus:ring-secondary/40 outline-none transition-all disabled:opacity-50"
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
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
                  onClick={() => { setComposing(false); setError(null); }}
                  type="button"
                  disabled={loadingSubmit}
                >
                  Cancelar
                </GhostButton>
                <GoldButton type="submit" disabled={loadingSubmit || !formData.tag}>
                  {loadingSubmit ? (
                    <>
                      <Icon name="autorenew" className="text-base animate-spin" /> Publicando...
                    </>
                  ) : (
                    <>
                      <Icon name="publish" className="text-base" /> Publicar
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
            <p className="text-sm font-medium text-primary/60">Buscando publicações...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-[32px] border-2 border-dashed border-outline/30 bg-surface py-20 text-center">
            <Icon name="edit_note" className="text-4xl text-primary/10 mb-4" />
            <h3 className="text-sm font-bold text-primary/30 uppercase tracking-widest">
              Nenhuma postagem ainda
            </h3>
            <p className="text-xs text-primary/20 mt-2">
              Compartilhe seu conhecimento. Clique em 'Nova postagem' para começar.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Card key={post.id}>
                <div className="flex flex-col h-full gap-4">
                  {post.cover_url && (
                    <div className="h-48 w-full rounded-xl overflow-hidden bg-surface-2 border border-outline/30">
                      <img
                        src={post.cover_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Pill tone="gold">{post.tag}</Pill>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      {new Date(post.published_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-primary">{post.title}</h4>
                  <p className="text-sm font-medium text-primary/70 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between border-t border-outline/30 pt-4 mt-auto">
                    <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-1">
                      Status: {post.status}
                    </span>
                    <GhostButton type="button" className="text-xs font-bold p-0 flex items-center gap-1">
                      Ver artigo <Icon name="arrow_forward" className="text-sm" />
                    </GhostButton>
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
