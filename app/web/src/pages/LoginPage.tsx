import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { GoldButton, Icon } from "@/components/ui/connexo-primitives";
import { useAuth } from "@/hooks/useAuth";
import { apiErrorMessage } from "@/lib/utils";

function roleDashboard(role: string): string {
  switch (role) {
    case "advogado": return "/adv/dashboard";
    case "contador": return "/acc/dashboard";
    case "cliente": return "/cli/dashboard";
    case "admin": return "/adv/dashboard";
    default: return "/adv/dashboard";
  }
}

function safeNext(raw: string | null): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const next = safeNext(searchParams.get("next"));
    navigate(next || roleDashboard(user.role), { replace: true });
  }, [user, navigate, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Informe e-mail e senha.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(apiErrorMessage(err, "Erro ao autenticar"));
      setLoading(false);
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-surface-1 font-theme-body">
      <div className="fixed inset-0 z-0 overflow-hidden select-none pointer-events-none opacity-[0.04]">
        <span className="absolute -top-10 -left-10 text-[10rem] font-semibold text-primary leading-none font-theme-display">CONNEXO</span>
        <span className="absolute bottom-10 right-10 text-[10rem] font-semibold text-primary leading-none font-theme-display">EST. 2002</span>
      </div>

      <main className="relative z-10 w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[750px] shadow-[0_50px_100px_-20px_rgba(64,16,30,0.22)] rounded-[32px] bg-white overflow-hidden mx-4 cx-reveal">

        <div className="relative hidden md:flex flex-col justify-between p-16 bg-primary text-white overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-primary via-primary/85 to-transparent" />
          <span className="absolute -top-12 -left-8 text-[12rem] font-semibold text-white opacity-[0.04] leading-none font-theme-display">CONNEXO</span>

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/20">
                <Icon name="balance" className="text-white text-2xl" />
              </div>
              <span className="text-2xl font-semibold tracking-tight uppercase font-theme-display">Connexo</span>
            </div>
          </div>

          <div className="relative z-10">
            <h1 className="text-6xl font-semibold leading-[1] tracking-tight mb-8 font-theme-display">
              A precisão contábil <br />
              <span className="text-secondary">a serviço da causa.</span>
            </h1>
            <p className="text-xl text-white/60 font-light max-w-sm leading-relaxed">
              Plataforma para escritórios de contabilidade que atuam com perícia judicial, integrada aos painéis dos escritórios de advocacia.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-8 pt-12 border-t border-white/10">
            {[
              { v: "320+", l: "Perícias entregues" },
              { v: "47", l: "Escritórios parceiros" },
              { v: "98%", l: "Pareceres no prazo" },
            ].map((s, i) => (
              <div key={i} className="group cursor-default">
                <p className="text-3xl font-semibold tracking-tight group-hover:scale-110 transition-transform duration-300 origin-left motion-reduce:transition-none motion-reduce:group-hover:scale-100 text-secondary font-theme-display">{s.v}</p>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mt-2">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 md:p-20 bg-white">
          <div className="mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-4 text-secondary">
              Acesso à plataforma
            </p>
            <h3 className="text-4xl font-semibold text-ink tracking-tight mb-3 font-theme-display">Bem-vindo de volta</h3>
            <p className="text-on-surface-variant/60 font-medium text-base">
              Acesse sua conta para gerenciar processos, laudos e documentos.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3">
              <Icon name="error_outline" className="text-rose-500" />
              <p className="text-sm font-bold text-rose-700">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-3 block opacity-40">
                E-mail Profissional
              </label>
              <div className="relative group">
                <Icon name="mail" className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-secondary transition-colors text-xl" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-5 py-5 rounded-2xl bg-surface-1 border border-outline text-ink font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all duration-300 text-sm font-theme-body motion-reduce:transition-none"
                  placeholder="eduarda@pereiraecosta.com.br"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary opacity-40">Senha de Acesso</label>
                <Link to="#" className="text-[10px] font-bold uppercase tracking-wider text-secondary hover:text-primary transition-colors">
                  Esqueci a senha
                </Link>
              </div>
              <div className="relative group">
                <Icon name="lock" className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-secondary transition-colors text-xl" />
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-14 py-5 rounded-2xl bg-surface-1 border border-outline text-ink font-medium focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition-all duration-300 text-sm font-theme-body motion-reduce:transition-none"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-primary/20 hover:text-primary transition-colors p-1"
                >
                  <Icon name={showPwd ? "visibility_off" : "visibility"} className="text-xl" />
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 py-3 cursor-pointer group">
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 rounded-lg border-none bg-surface-1 text-secondary focus:ring-secondary/20 transition-all"
              />
              <span className="text-xs font-bold text-primary/40 group-hover:text-primary transition-colors uppercase tracking-wider">Manter conectado neste dispositivo</span>
            </label>

            <div className="pt-4">
              <GoldButton
                type="submit"
                icon={loading ? "autorenew" : "arrow_forward"}
                className={loading ? "w-full py-6 text-sm uppercase tracking-[0.2em] font-black opacity-80" : "w-full py-6 text-sm uppercase tracking-[0.2em] font-black"}
                disabled={loading}
              >
                {loading ? "Autenticando..." : "Acessar Painel"}
              </GoldButton>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-outline text-center">
            <p className="text-sm text-primary/40 font-medium">
              Ainda não possui credenciais? <br className="md:hidden" />
              <Link to="/register" className="font-semibold hover:scale-105 inline-block transition-transform ml-1 text-secondary motion-reduce:hover:scale-100">
                Solicitar acesso ao escritório
              </Link>
            </p>
          </div>
        </div>
      </main>

    </div>
  );
}
