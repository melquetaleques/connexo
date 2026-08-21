import { useState, useEffect, type CSSProperties, type FormEvent } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
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

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  height: 50,
  padding: "0 16px",
  marginBottom: 22,
  border: "1px solid rgb(221, 216, 210)",
  borderRadius: 8,
  background: "rgb(248, 247, 245)",
  font: '400 15px / 1 "Hanken Grotesk", sans-serif',
  color: "rgb(28, 27, 26)",
  outline: "none",
};

const labelStyle: CSSProperties = {
  display: "block",
  font: '600 14px / 1 "Hanken Grotesk", sans-serif',
  color: "rgb(59, 13, 22)",
  marginBottom: 9,
};

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    const next = safeNext(searchParams.get("next"));
    navigate(next || roleDashboard(user.role), { replace: true });
  }, [user, navigate, searchParams]);

  const handleLogin = async (e: FormEvent) => {
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
    <div
      className="min-h-screen font-theme-body"
      style={{ background: "rgb(234, 231, 226)", padding: "80px 40px" }}
    >
      <main style={{ maxWidth: 1220, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <span style={{ font: "700 17px / 1 Figtree, sans-serif", letterSpacing: "-0.02em", color: "rgb(59, 13, 22)" }}>
            Login
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0px, 1fr) minmax(0px, 1fr)",
            borderRadius: 24,
            overflow: "hidden",
            background: "rgb(255, 255, 255)",
            boxShadow: "rgba(59, 13, 22, 0.4) 0px 40px 90px -50px",
          }}
          className="max-md:!grid-cols-1"
        >
          <div
            className="hidden md:flex"
            style={{
              position: "relative",
              background: "rgb(74, 15, 27)",
              padding: "52px 48px",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(85% 70% at 88% 6%, rgba(255, 77, 141, 0.24), transparent 62%), radial-gradient(70% 60% at 10% 100%, rgba(216, 138, 94, 0.24), transparent 68%)",
              }}
            />
            <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 54 }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "rgb(255, 255, 255)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    font: "900 13px / 1 Figtree, sans-serif",
                    color: "rgb(74, 15, 27)",
                  }}
                >
                  C
                </span>
                <span style={{ font: "700 21px / 1 Figtree, sans-serif", letterSpacing: "-0.02em", color: "rgb(255, 255, 255)" }}>
                  Connexo
                </span>
              </div>
              <h1
                style={{
                  margin: "0 0 20px",
                  font: "800 40px / 1.1 Figtree, sans-serif",
                  letterSpacing: "-0.03em",
                  color: "rgb(255, 255, 255)",
                }}
              >
                A precisão contábil a serviço da causa
              </h1>
              <p
                style={{
                  margin: 0,
                  font: '400 16px / 1.6 "Hanken Grotesk", sans-serif',
                  color: "rgba(255, 255, 255, 0.72)",
                  maxWidth: "36ch",
                }}
              >
                Plataforma para escritórios de contabilidade que atuam com perícia judicial, integrada aos painéis da advocacia.
              </p>
              <div style={{ marginTop: "auto", paddingTop: 52, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                {[
                  { v: "320+", l: "Perícias entregues" },
                  { v: "47", l: "Escritórios parceiros" },
                  { v: "98%", l: "Pareceres no prazo" },
                ].map((s) => (
                  <div key={s.l}>
                    <div style={{ font: "800 30px / 1 Figtree, sans-serif", letterSpacing: "-0.03em", color: "rgb(255, 255, 255)", marginBottom: 9 }}>
                      {s.v}
                    </div>
                    <div style={{ font: '400 14px / 1.4 "Hanken Grotesk", sans-serif', color: "rgba(255, 255, 255, 0.6)" }}>
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleLogin}
            style={{ padding: "52px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}
          >
            <h2
              style={{
                margin: "0 0 10px",
                font: "800 30px / 1.15 Figtree, sans-serif",
                letterSpacing: "-0.03em",
                color: "rgb(59, 13, 22)",
              }}
            >
              Bem-vindo de volta
            </h2>
            <p
              style={{
                margin: "0 0 34px",
                font: '400 16px / 1.55 "Hanken Grotesk", sans-serif',
                color: "rgb(92, 74, 78)",
              }}
            >
              Acesse sua conta para gerenciar processos, laudos e documentos.
            </p>

            {error && (
              <div
                style={{
                  marginBottom: 22,
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: "rgb(253, 238, 244)",
                  font: '600 14px / 1.4 "Hanken Grotesk", sans-serif',
                  color: "rgb(193, 30, 99)",
                }}
              >
                {error}
              </div>
            )}

            <label style={labelStyle}>E-mail profissional</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="eduarda@pereiraecosta.com.br"
              style={inputStyle}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 9 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Senha de acesso</label>
              <Link
                to="#"
                style={{ font: '600 14px / 1 "Hanken Grotesk", sans-serif', color: "rgb(193, 30, 99)" }}
              >
                Esqueci a senha
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />

            <label style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 30, cursor: "pointer" }}>
              <input
                type="checkbox"
                defaultChecked
                style={{ width: 19, height: 19, borderRadius: 5, accentColor: "rgb(28, 27, 26)", flex: "0 0 auto" }}
              />
              <span style={{ font: '400 15px / 1 "Hanken Grotesk", sans-serif', color: "rgb(92, 74, 78)" }}>
                Manter conectado neste dispositivo
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: 50,
                border: "none",
                borderRadius: 8,
                background: "rgb(28, 27, 26)",
                color: "rgb(255, 255, 255)",
                font: '700 15px / 1 "Hanken Grotesk", sans-serif',
                cursor: loading ? "wait" : "pointer",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? "Autenticando..." : "Acessar painel →"}
            </button>

            <div
              style={{
                marginTop: 30,
                textAlign: "center",
                font: '400 15px / 1.5 "Hanken Grotesk", sans-serif',
                color: "rgb(92, 74, 78)",
              }}
            >
              Ainda não possui credenciais?{" "}
              <Link to="/register" style={{ fontWeight: 600, color: "rgb(193, 30, 99)" }}>
                Solicitar acesso
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
