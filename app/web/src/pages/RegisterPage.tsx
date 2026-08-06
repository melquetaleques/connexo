import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoldButton, Icon, Field, SelectField } from "@/components/ui/connexo-primitives";
import { useAuth } from "@/hooks/useAuth";

const ACCENT = "#C59D5C";

function roleDashboard(role: string): string {
  switch (role) {
    case "advogado": return "/adv/dashboard";
    case "contador": return "/acc/dashboard";
    default: return "/adv/dashboard";
  }
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState<"advogado" | "contador">("advogado");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const totalSteps = 2;

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(roleDashboard(role), { replace: true });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, role]);

  const handleFinish = async () => {
    if (password !== confirmPassword) {
      setError("Senhas nao conferem");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register({ name, email, password, role });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Erro ao cadastrar");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[#F9FAFB] font-['Plus_Jakarta_Sans'] py-12 px-4">
      {/* Watermarks */}
      <div className="fixed inset-0 z-0 overflow-hidden select-none pointer-events-none opacity-[0.03]">
        <span className="absolute -top-10 -left-10 text-[10rem] font-black text-primary leading-none">CONNEXO</span>
      </div>

      <main className="relative z-10 w-full max-w-[850px] bg-white rounded-[32px] shadow-[0_50px_100px_-30px_rgba(0,8,48,0.15)] overflow-hidden border border-[#F3F4F6] animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header do Wizard */}
        <div className="px-12 py-10 border-b border-[#F3F4F6] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Icon name="balance" className="text-white text-xl" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase text-primary">Connexo</span>
          </div>
          <Link to="/login" className="text-[11px] font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors flex items-center gap-2">
            <Icon name="arrow_back" className="text-base" />
            Voltar ao Login
          </Link>
        </div>

        <div className="px-12 pt-12">
          {/* Barra de Progresso */}
          <div className="mb-12">
            <div className="flex justify-between items-end mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: ACCENT }}>
                Etapa {step} de {totalSteps}
              </p>
              <p className="text-xs font-bold text-primary/30 uppercase tracking-widest">
                {step === 1 ? "Dados Corporativos" : (step === 2 && role === "contador") ? "Credenciais" : step === 2 ? "Credenciais Admin" : "Selecao de Plano"}
              </p>
            </div>
            <div className="flex gap-3">
              {(role === "advogado" ? [1, 2, 3] : [1, 2]).map((s) => (
                <div
                  key={s}
                  className="h-1.5 flex-1 rounded-full transition-all duration-500"
                  style={{ background: s <= step ? ACCENT : "#F3F4F6" }}
                />
              ))}
            </div>
          </div>

          {/* Conteúdo das Etapas */}
          <div className="min-h-[380px]">
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-4xl font-black text-primary tracking-tight mb-3">
                  {role === "advogado" ? "Escritório Jurídico" : "Escritório de Perícia"}
                </h2>
                <p className="text-primary/50 font-medium mb-10">
                  {role === "advogado" 
                    ? "Inicie o registro do seu escritório de advocacia." 
                    : "Inicie o registro do seu escritório de perícia contábil."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField 
                    label="Perfil Profissional" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value as any)}
                    options={[
                      { label: "Advogado (Contratante)", value: "advogado" },
                      { label: "Contador (Perito)", value: "contador" },
                    ]}
                  />
                  <Field label="Razão Social" placeholder="Ex: Pereira & Advogados Associados" />
                  <Field label="CNPJ" placeholder="00.000.000/0001-00" />
                  <Field label={role === "advogado" ? "Registro OAB" : "Registro CRC"} placeholder="Ex: 123456/SP" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                {success ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                      <Icon name="check_circle" className="text-4xl text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-black text-primary tracking-tight mb-3">Cadastro concluido!</h2>
                    <p className="text-primary/50 font-medium mb-4">
                      Conta criada com sucesso. Redirecionando para o painel...
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-4xl font-black text-primary tracking-tight mb-3">
                      {role === "contador" ? "Conta do Perito" : "Administrador"}
                    </h2>
                    <p className="text-primary/50 font-medium mb-10">
                      {role === "contador"
                        ? "Defina suas credenciais de acesso para comecar a receber propostas."
                        : "Defina as credenciais do gestor principal da plataforma."}
                    </p>
                    {error && (
                      <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm font-bold text-rose-600">
                        {error}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field label="Nome Completo" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome completo" />
                      <Field label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="seu@email.com" />
                      <Field label="Senha" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Minimo 8 caracteres" />
                      <Field label="Confirmar Senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Repita a senha" />
                    </div>
                  </>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                {success ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                      <Icon name="check_circle" className="text-4xl text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-black text-primary tracking-tight mb-3">Cadastro concluido!</h2>
                    <p className="text-primary/50 font-medium mb-4">
                      Conta criada com sucesso. Redirecionando para o painel...
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-4xl font-black text-primary tracking-tight mb-3">Escolha seu Plano</h2>
                    <p className="text-primary/50 font-medium mb-10">Selecione o volume operacional que melhor atende ao seu escritorio.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { name: "Essencial", price: "R$ 290", desc: "Ate 20 processos ativos", icon: "bolt" },
                        { name: "Profissional", price: "R$ 590", desc: "Ate 80 processos ativos", recommended: true, icon: "verified" },
                        { name: "Enterprise", price: "Consulta", desc: "Volume ilimitado + SLA", icon: "hub" },
                      ].map((p) => (
                        <button
                          key={p.name}
                          className={`text-left p-6 rounded-[24px] border-2 transition-all relative group ${
                            p.recommended
                              ? "border-secondary bg-secondary/[0.03]"
                              : "border-[#F3F4F6] hover:border-primary/20 bg-white"
                          }`}
                          style={p.recommended ? { borderColor: ACCENT } : {}}
                        >
                          {p.recommended && (
                            <div className="absolute -top-3 left-6 px-3 py-1 bg-secondary rounded-full">
                              <span className="text-[9px] font-black uppercase tracking-widest text-white">Recomendado</span>
                            </div>
                          )}
                          <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center transition-transform group-hover:scale-110 ${p.recommended ? "bg-secondary text-white" : "bg-[#F9FAFB] text-primary/30"}`}>
                            <Icon name={p.icon} />
                          </div>
                          <p className="text-xl font-black text-primary">{p.name}</p>
                          <p className="text-2xl font-black mt-2 text-primary">
                            {p.price}
                            {p.price !== "Consulta" && <span className="text-xs text-primary/40 font-bold tracking-tight">/mes</span>}
                          </p>
                          <p className="text-xs text-primary/40 font-bold mt-4 leading-relaxed">{p.desc}</p>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 group cursor-pointer mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="relative">
              <input 
                type="checkbox" 
                required
                className="peer appearance-none w-6 h-6 border-2 border-[#F3F4F6] rounded-lg checked:bg-secondary checked:border-secondary transition-all cursor-pointer"
              />
              <Icon name="check" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none text-xs" />
            </div>
            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest leading-relaxed">
              Li e aceito os <span className="text-secondary border-b border-secondary/30">Termos de Uso</span> e a <span className="text-secondary border-b border-secondary/30">Política de Privacidade (LGPD)</span>.
            </p>
          </div>

          {/* Navegação do Rodapé */}
          {!success && (
            <div className="flex items-center justify-between mt-12 pb-12">
              <button
                onClick={() => (step === 1 ? navigate("/login") : setStep(step - 1))}
                className="px-8 py-3 text-xs font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-all flex items-center gap-2"
              >
                <Icon name="west" />
                {step === 1 ? "Voltar ao Login" : "Etapa Anterior"}
              </button>

              {step < totalSteps ? (
                <GoldButton onClick={() => setStep(step + 1)} icon="east" className="px-10 py-5">
                  Proxima Etapa
                </GoldButton>
              ) : (
                <GoldButton onClick={handleFinish} icon={loading ? "autorenew" : "check"} className="px-12 py-5" disabled={loading}>
                  {loading ? "Processando..." : "Finalizar Cadastro"}
                </GoldButton>
              )}
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
