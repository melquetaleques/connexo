import { useState, useEffect, type CSSProperties, type ReactNode } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth, type Role } from "@/hooks/useAuth";
import { apiErrorMessage } from "@/lib/utils";

const REGISTER_ROLES: Role[] = ["advogado", "contador", "cliente"];

function parseRole(value: string | null): Role {
  if (value && REGISTER_ROLES.includes(value as Role)) return value as Role;
  return "advogado";
}

function roleDashboard(role: string): string {
  switch (role) {
    case "advogado": return "/adv/dashboard";
    case "contador": return "/acc/dashboard";
    case "cliente": return "/cli/dashboard";
    case "admin": return "/adv/dashboard";
    default: return "/login";
  }
}

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  height: 48,
  padding: "0 15px",
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

function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState<Role>(() => parseRole(searchParams.get("role")));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [registro, setRegistro] = useState("");

  const totalSteps = 2;

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(roleDashboard(role), { replace: true });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, role]);

  const handleNext = () => {
    if (!REGISTER_ROLES.includes(role)) {
      setError("Selecione um perfil profissional valido.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleFinish = async () => {
    if (!name.trim()) {
      setError("Informe o nome completo.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Informe um e-mail valido.");
      return;
    }
    if (password.length < 8) {
      setError("A senha deve ter no minimo 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Senhas nao conferem");
      return;
    }
    if (!acceptedTerms) {
      setError("Aceite os Termos de Uso e a Politica de Privacidade para continuar.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), phone: phone.trim() || undefined, password, role });
      setSuccess(true);
    } catch (err) {
      setError(apiErrorMessage(err, "Erro ao cadastrar"));
      setLoading(false);
    }
  };

  const stepLabel = step === 1 ? "Perfil" : "Credenciais";
  const title =
    step === 1
      ? role === "advogado"
        ? "Escritório jurídico"
        : role === "contador"
          ? "Escritório de perícia"
          : "Acesso do cliente"
      : role === "contador"
        ? "Conta do perito"
        : role === "cliente"
          ? "Sua conta"
          : "Administrador";
  const subtitle =
    step === 1
      ? role === "advogado"
        ? "Inicie o registro do seu escritório de advocacia."
        : role === "contador"
          ? "Inicie o registro do seu escritório de perícia contábil."
          : "Crie sua conta para acompanhar processos e enviar documentos."
      : role === "contador"
        ? "Defina suas credenciais de acesso para começar a receber propostas de vínculo."
        : role === "cliente"
          ? "Defina as credenciais para acompanhar seus processos."
          : "Defina as credenciais do gestor principal da plataforma.";

  return (
    <div
      className="min-h-screen font-theme-body"
      style={{ background: "rgb(243, 241, 237)", padding: "80px 40px" }}
    >
      <div style={{ maxWidth: 1220, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <span style={{ font: "700 17px / 1 Figtree, sans-serif", letterSpacing: "-0.02em", color: "rgb(59, 13, 22)" }}>
            Cadastro · etapa {step} de {totalSteps}
          </span>
        </div>
        <div
          style={{
            maxWidth: 820,
            margin: "0 auto",
            background: "rgb(255, 255, 255)",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "rgba(59, 13, 22, 0.35) 0px 30px 70px -46px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "24px 36px",
              borderBottom: "1px solid rgb(237, 234, 229)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "rgb(28, 27, 26)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  font: "900 13px / 1 Figtree, sans-serif",
                  color: "rgb(255, 255, 255)",
                }}
              >
                C
              </span>
              <span style={{ font: "700 20px / 1 Figtree, sans-serif", letterSpacing: "-0.02em", color: "rgb(59, 13, 22)" }}>
                Connexo
              </span>
            </div>
            <Link to="/login" style={{ font: '600 14px / 1 "Hanken Grotesk", sans-serif', color: "rgb(124, 114, 109)" }}>
              ← Voltar ao login
            </Link>
          </div>

          <div style={{ padding: 36 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ font: '600 14px / 1 "Hanken Grotesk", sans-serif', color: "rgb(193, 30, 99)" }}>
                Etapa {step} de {totalSteps}
              </span>
              <span style={{ font: '400 14px / 1 "Hanken Grotesk", sans-serif', color: "rgb(154, 144, 136)" }}>
                {stepLabel}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 36 }}>
              <div style={{ height: 4, borderRadius: 99, background: "rgb(255, 77, 141)" }} />
              <div
                style={{
                  height: 4,
                  borderRadius: 99,
                  background: step >= 2 ? "rgb(255, 77, 141)" : "rgb(237, 234, 229)",
                }}
              />
            </div>

            {success ? (
              <div style={{ textAlign: "center", padding: "24px 0 12px" }}>
                <h3
                  style={{
                    margin: "0 0 10px",
                    font: "800 32px / 1.14 Figtree, sans-serif",
                    letterSpacing: "-0.03em",
                    color: "rgb(59, 13, 22)",
                  }}
                >
                  Cadastro concluido!
                </h3>
                <p style={{ margin: 0, font: '400 16px / 1.55 "Hanken Grotesk", sans-serif', color: "rgb(92, 74, 78)" }}>
                  Conta criada com sucesso. Redirecionando para o painel...
                </p>
              </div>
            ) : (
              <>
                <h3
                  style={{
                    margin: "0 0 10px",
                    font: "800 32px / 1.14 Figtree, sans-serif",
                    letterSpacing: "-0.03em",
                    color: "rgb(59, 13, 22)",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    margin: "0 0 32px",
                    font: '400 16px / 1.55 "Hanken Grotesk", sans-serif',
                    color: "rgb(92, 74, 78)",
                  }}
                >
                  {subtitle}
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

                {step === 1 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "22px 24px",
                      marginBottom: 30,
                    }}
                    className="max-sm:!grid-cols-1"
                  >
                    <FieldBlock label="Perfil profissional">
                      <select
                        value={role}
                        onChange={(e) => setRole(parseRole(e.target.value))}
                        style={inputStyle}
                      >
                        <option value="advogado">Advogado (Contratante)</option>
                        <option value="contador">Contador (Perito)</option>
                        <option value="cliente">Cliente (Parte)</option>
                      </select>
                    </FieldBlock>
                    {role === "cliente" ? (
                      <FieldBlock label="Telefone">
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="(11) 99999-9999"
                          style={inputStyle}
                        />
                      </FieldBlock>
                    ) : (
                      <>
                        <FieldBlock label="Razão social">
                          <input
                            value={razaoSocial}
                            onChange={(e) => setRazaoSocial(e.target.value)}
                            placeholder="Ex: Pereira & Advogados Associados"
                            style={inputStyle}
                          />
                        </FieldBlock>
                        <FieldBlock label="CNPJ">
                          <input
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                            placeholder="00.000.000/0001-00"
                            style={inputStyle}
                          />
                        </FieldBlock>
                        <FieldBlock label={role === "advogado" ? "Registro OAB" : "Registro CRC"}>
                          <input
                            value={registro}
                            onChange={(e) => setRegistro(e.target.value)}
                            placeholder="Ex: 123456/SP"
                            style={inputStyle}
                          />
                        </FieldBlock>
                      </>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "22px 24px",
                      marginBottom: 30,
                    }}
                    className="max-sm:!grid-cols-1"
                  >
                    <FieldBlock label="Nome completo">
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome completo"
                        style={inputStyle}
                      />
                    </FieldBlock>
                    <FieldBlock label="E-mail">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        style={inputStyle}
                      />
                    </FieldBlock>
                    <FieldBlock label="Senha">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimo 8 caracteres"
                        style={inputStyle}
                      />
                    </FieldBlock>
                    <FieldBlock label="Confirmar senha">
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repita a senha"
                        style={inputStyle}
                      />
                    </FieldBlock>
                  </div>
                )}

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "16px 18px",
                    borderRadius: 12,
                    background: "rgb(253, 238, 244)",
                    marginBottom: 30,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    style={{
                      width: 19,
                      height: 19,
                      borderRadius: 5,
                      accentColor: "rgb(255, 77, 141)",
                      flex: "0 0 auto",
                    }}
                  />
                  <span style={{ font: '400 15px / 1.5 "Hanken Grotesk", sans-serif', color: "rgb(92, 53, 64)" }}>
                    Li e aceito os{" "}
                    <span style={{ color: "rgb(193, 30, 99)", fontWeight: 600 }}>termos de uso</span> e a{" "}
                    <span style={{ color: "rgb(193, 30, 99)", fontWeight: 600 }}>política de privacidade (LGPD)</span>.
                  </span>
                </label>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => (step === 1 ? navigate("/login") : setStep(step - 1))}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      font: '600 15px / 1 "Hanken Grotesk", sans-serif',
                      color: "rgb(124, 114, 109)",
                      cursor: "pointer",
                    }}
                  >
                    {step === 1 ? "← Voltar ao login" : "← Etapa anterior"}
                  </button>
                  {step < totalSteps ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      style={{
                        height: 48,
                        padding: "0 26px",
                        border: "none",
                        borderRadius: 8,
                        background: "rgb(28, 27, 26)",
                        color: "rgb(255, 255, 255)",
                        font: '700 15px / 1 "Hanken Grotesk", sans-serif',
                        cursor: "pointer",
                      }}
                    >
                      Próxima etapa →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinish}
                      disabled={loading}
                      style={{
                        height: 48,
                        padding: "0 26px",
                        border: "none",
                        borderRadius: 8,
                        background: "rgb(28, 27, 26)",
                        color: "rgb(255, 255, 255)",
                        font: '700 15px / 1 "Hanken Grotesk", sans-serif',
                        cursor: loading ? "wait" : "pointer",
                        opacity: loading ? 0.8 : 1,
                      }}
                    >
                      {loading ? "Processando..." : "Finalizar cadastro →"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
