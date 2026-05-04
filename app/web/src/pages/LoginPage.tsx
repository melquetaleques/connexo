import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, GoldButton, Field, Icon } from "@/components/ui/connexo-primitives";

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de login - Integração com API será feita no Plan 1.3
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-white font-['Plus_Jakarta_Sans']">
      {/* Lado Esquerdo - Branding */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-16 text-white">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary blur-[100px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shadow-lg shadow-secondary/20">
              <Icon name="balance" className="text-white text-2xl" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">Connexo</span>
          </div>
          
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight mb-6">
            A precisão contábil <br />
            <span className="text-secondary italic">a serviço da causa.</span>
          </h1>
          <p className="text-lg text-white/60 max-w-md font-medium leading-relaxed">
            Plataforma exclusiva para advogados e escritórios de elite. 
            Conectamos sua demanda jurídica à expertise contábil que garante o resultado.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-1">Established</p>
            <p className="text-xl font-mono font-bold">2002</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-1">Compliance</p>
            <p className="text-xl font-mono font-bold tracking-widest">OAB / CFC</p>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-surface-1">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-12 justify-center">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Icon name="balance" className="text-white text-sm" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase text-primary">Connexo</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-primary mb-3">Bem-vindo ao Connexo</h2>
            <p className="text-on-surface-variant font-medium">Acesse sua conta para gerenciar seus processos e perícias.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Field label="E-mail Profissional" placeholder="seu@escritorio.com.br" type="email" />
            
            <div className="relative">
              <Field 
                label="Senha" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-on-surface-variant hover:text-primary transition-colors"
              >
                <Icon name={showPassword ? "visibility_off" : "visibility"} className="text-xl" />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-outline bg-white text-secondary focus:ring-secondary/20" />
                <span className="text-xs font-bold text-primary/60 group-hover:text-primary transition-colors uppercase tracking-wider">Manter conectado</span>
              </label>
              <Link to="/forgot-password" **emphasized** className="text-xs font-extrabold text-secondary hover:text-secondary/80 transition-colors uppercase tracking-widest">
                Esqueci a senha
              </Link>
            </div>

            <GoldButton type="submit" className="w-full py-4 text-sm" icon={loading ? "autorenew" : "login"}>
              {loading ? "Acessando..." : "Entrar no Sistema"}
            </GoldButton>

            <div className="pt-8 text-center">
              <p className="text-sm text-on-surface-variant font-medium mb-4">Ainda não possui conta?</p>
              <Link to="/register">
                <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-outline hover:border-secondary/50 hover:bg-secondary/5 transition-all group">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest group-hover:text-secondary">Solicitar Acesso ao Escritório</span>
                  <Icon name="arrow_forward" className="text-sm text-primary/40 group-hover:text-secondary" />
                </div>
              </Link>
            </div>
          </form>
          
          <div className="mt-16 text-center">
            <p className="text-[10px] font-bold text-primary/20 uppercase tracking-[0.4em]">Tecnologia Sovereign Gilded v1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
