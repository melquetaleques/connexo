import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, GoldButton, Field, Icon, SectionTitle, Pill } from "@/components/ui/connexo-primitives";

export function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-surface-1 font-['Plus_Jakarta_Sans'] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link to="/login" className="flex items-center gap-2 text-primary/60 hover:text-primary transition-colors group">
            <Icon name="arrow_back" className="text-xl" />
            <span className="text-xs font-extrabold uppercase tracking-widest">Voltar ao Login</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Icon name="balance" className="text-white text-sm" />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase text-primary">Connexo</span>
          </div>
        </div>

        <Card className="p-10">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Pill tone="gold" className="px-4 py-1.5">Passo {step} de 3</Pill>
              <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-secondary transition-all duration-500" 
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>
            <h2 className="text-3xl font-black text-primary">Solicitar Acesso</h2>
            <p className="text-on-surface-variant font-medium mt-2">
              {step === 1 && "Primeiro, conte-nos sobre o seu escritório ou atuação profissional."}
              {step === 2 && "Agora, defina os dados de acesso da conta administradora."}
              {step === 3 && "Escolha o plano que melhor se adapta ao volume do seu escritório."}
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-8">
            {step === 1 && (
              <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Field label="Razão Social / Nome Profissional" placeholder="Ex: Silva & Associados" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="CNPJ / CPF" placeholder="00.000.000/0000-00" />
                  <Field label="Nº OAB" placeholder="000.000" />
                </div>
                <Field label="Endereço do Escritório" placeholder="Rua, Número, Bairro, Cidade - UF" />
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Field label="Nome Completo do Administrador" placeholder="Ex: Dr. Marcelo Silva" />
                <Field label="E-mail de Trabalho" placeholder="marcelo@escritorio.com.br" type="email" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Senha de Acesso" placeholder="••••••••" type="password" />
                  <Field label="Confirmar Senha" placeholder="••••••••" type="password" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {[
                  { id: 'essencial', name: 'Essencial', desc: 'Até 10 processos ativos/mês', price: 'R$ 297/mês' },
                  { id: 'pro', name: 'Profissional', desc: 'Até 50 processos ativos/mês', price: 'R$ 597/mês', highlight: true },
                  { id: 'elite', name: 'Escritório Elite', desc: 'Processos ilimitados + Consultoria', price: 'Sob consulta' },
                ].map((plan) => (
                  <label key={plan.id} className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all cursor-pointer ${plan.highlight ? 'border-secondary bg-secondary/5' : 'border-outline hover:border-secondary/30 bg-white'}`}>
                    <div className="flex items-center gap-4">
                      <input type="radio" name="plan" defaultChecked={plan.highlight} className="w-5 h-5 text-secondary focus:ring-secondary/20" />
                      <div>
                        <p className="font-bold text-primary">{plan.name}</p>
                        <p className="text-xs text-on-surface-variant">{plan.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-primary">{plan.price}</p>
                    </div>
                  </label>
                ))}
                
                <div className="mt-6 p-4 rounded-lg bg-surface-2 flex gap-3">
                  <Icon name="info" className="text-secondary shrink-0" />
                  <p className="text-[11px] text-primary/60 leading-normal font-medium">
                    Ao clicar em finalizar, você concorda com nossos Termos de Uso e Política de Privacidade. Seu acesso será liberado após a verificação dos dados profissionais.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-outline">
              {step > 1 ? (
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="px-6 py-3 text-xs font-extrabold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors"
                >
                  Voltar
                </button>
              ) : <div />}
              
              <GoldButton type="submit" className="min-w-[200px]" icon={loading ? "autorenew" : (step === 3 ? "check" : "arrow_forward")}>
                {loading ? "Processando..." : (step === 3 ? "Finalizar Cadastro" : "Continuar")}
              </GoldButton>
            </div>
          </form>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-sm text-on-surface-variant font-medium">
            Já possui acesso? <Link to="/login" className="text-secondary font-black hover:underline ml-1">Fazer Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
