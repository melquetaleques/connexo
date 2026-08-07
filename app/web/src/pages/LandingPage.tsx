import { Link } from "react-router-dom";
import { Icon, GoldButton } from "@/components/ui/connexo-primitives";

const FAQS = [
  {
    q: "O que é o Connexo?",
    a: "O Connexo é uma plataforma que conecta escritórios de advocacia a contadores especializados em perícia contábil. Advogados cadastram processos, escolhem contadores parceiros e acompanham entregas em tempo real — tudo com conformidade OAB e LGPD.",
  },
  {
    q: "O Connexo é conforme as regras da OAB?",
    a: "Sim. O Connexo foi projetado dentro das normas éticas da OAB. A separação entre honorários advocatícios e serviços contábeis é explícita: o contador recebe exclusivamente pelo serviço técnico prestado, nunca por indicação (Art. 7º do Código de Ética). Consulte nossa equipe para detalhes sobre compliance.",
  },
  {
    q: "Como funciona a proteção de dados (LGPD)?",
    a: "O Connexo possui sistema completo de consentimento LGPD: o cliente autoriza expressamente o compartilhamento de dados, cada documento tem controle granular de acesso, e todas as interações são registradas em logs de auditoria. Seus dados e os dos seus clientes estão protegidos.",
  },
  {
    q: "Preciso ter conhecimento técnico em contabilidade?",
    a: "Não. O Connexo foi feito para advogados. Você só precisa cadastrar seus processos e escolher contadores parceiros disponíveis na plataforma. Nós cuidamos da ponte técnica.",
  },
  {
    q: "Como são selecionados os contadores?",
    a: "Os contadores passam por verificação de registro profissional (CRC) e têm perfis públicos com avaliações de advogados parceiros. Você pode filtrar por especialidade, localização e disponibilidade antes de contratar.",
  },
  {
    q: "Posso usar o Connexo sozinho ou preciso de um escritório?",
    a: "O Connexo atende desde advogados autônomos a grandes escritórios. Advogados autônomos podem se cadastrar individualmente. Escritórios podem convidar membros da equipe com diferentes níveis de permissão.",
  },
];

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-primary overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-secondary/10 blur-[160px]" />
        <div className="absolute bottom-[-15%] left-[-5%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px]" />
        <div className="absolute top-[30%] left-[10%] w-64 h-64 border border-secondary/10 rounded-full" />
        <div className="absolute bottom-[20%] right-[15%] w-32 h-32 border border-secondary/10 rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-24 lg:py-32">
        <div className="max-w-3xl">
          {/* Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
              Plataforma para Advocacia de Elite
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-8">
            A perícia contábil que{" "}
            <span className="text-secondary italic">todo escritório merece.</span>
          </h1>

          <p className="text-lg lg:text-xl text-white/60 font-medium leading-relaxed max-w-2xl mb-12">
            Conecte sua causa a contadores especializados, acompanhe cada entrega
            em tempo real e garanta o respaldo técnico que faz a diferença no resultado.
            Tudo em conformidade com a OAB.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link to="/register?role=advogado">
              <GoldButton icon="rocket_launch" className="text-sm px-8 py-4">
                Cadastrar Escritório
              </GoldButton>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-4 text-sm font-extrabold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
            >
              Já tenho conta
              <Icon name="arrow_forward" className="text-lg" />
            </Link>
          </div>

          {/* Trust signals */}
          <div className="mt-16 flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2">
              <Icon name="verified" className="text-emerald-400 text-lg" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
                Conformidade OAB
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="verified" className="text-emerald-400 text-lg" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
                LGPD Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComoFuncionaSection() {
  const steps = [
    {
      step: "01",
      title: "Advogado cadastra",
      desc: "Você cria seu escritório na plataforma, cadastra os processos e descreve a perícia necessária.",
      icon: "how_to_reg",
    },
    {
      step: "02",
      title: "Cliente escolhe o contador",
      desc: "Seu cliente é convidado a acessar a plataforma, consentir com o compartilhamento de dados (LGPD) e escolher entre contadores parceiros verificados.",
      icon: "handshake",
    },
    {
      step: "03",
      title: "Contador entrega",
      desc: "O contador acessa os documentos autorizados, realiza o trabalho e entrega o laudo técnico. Você revisa, aprova ou solicita ajustes em tempo real.",
      icon: "assignment_turned_in",
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-surface-1">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-4 block">
            Como Funciona
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-primary leading-tight mb-4">
            Da causa ao laudo,{" "}
            <span className="text-secondary italic">em 3 passos.</span>
          </h2>
          <p className="text-on-surface-variant font-medium max-w-xl mx-auto">
            Uma plataforma pensada para simplificar a relação entre advocacia e contabilidade, mantendo total controle e transparência.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((s) => (
            <div key={s.step} className="relative group">
              <div className="bg-white rounded-3xl p-8 lg:p-10 border border-outline/60 hover:border-secondary/20 transition-all hover:shadow-xl hover:shadow-secondary/5">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors">
                  <span className="text-xl font-black text-white">{s.step}</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Icon name={s.icon} className="text-2xl text-secondary" />
                  <h3 className="text-xl font-black text-primary">{s.title}</h3>
                </div>
                <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                  {s.desc}
                </p>
              </div>
              {steps.indexOf(s) < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 text-secondary/20">
                  <Icon name="chevron_right" className="text-4xl" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="py-24 lg:py-32 bg-surface-1">
      <div className="max-w-3xl mx-auto px-6 lg:px-16">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-4 block">
            FAQ
          </span>
          <h2 className="text-4xl lg:text-5xl font-black text-primary leading-tight mb-4">
            Perguntas{" "}
            <span className="text-secondary italic">Frequentes.</span>
          </h2>
          <p className="text-on-surface-variant font-medium">
            Tudo que você precisa saber antes de começar.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group bg-white rounded-2xl border border-outline/60 overflow-hidden transition-all hover:border-secondary/20"
            >
              <summary className="flex items-center justify-between p-6 lg:p-8 cursor-pointer list-none select-none">
                <span className="text-sm font-extrabold text-primary pr-4">{faq.q}</span>
                <Icon
                  name="expand_more"
                  className="text-xl text-primary/40 group-open:rotate-180 transition-transform shrink-0"
                />
              </summary>
              <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-primary text-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shadow-lg shadow-secondary/20">
              <Icon name="balance" className="text-white text-2xl" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">Connexo</span>
          </div>
          <div className="flex items-center gap-8">
            <Link
              to="/login"
              className="text-xs font-extrabold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              Entrar
            </Link>
            <Link
              to="/register?role=advogado"
              className="text-xs font-extrabold uppercase tracking-widest text-secondary hover:text-secondary/80 transition-colors"
            >
              Cadastrar
            </Link>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-medium text-white/30">
            &copy; {new Date().getFullYear()} Connexo. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="font-['Plus_Jakarta_Sans'] min-h-screen">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">
              <Icon name="balance" className="text-white text-sm" />
            </div>
            <span className="text-base font-black tracking-tighter uppercase text-white">
              Connexo
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-[10px] font-extrabold uppercase tracking-widest text-white/50 hover:text-white transition-colors px-4 py-2"
            >
              Entrar
            </Link>
            <Link to="/register?role=advogado">
              <GoldButton className="py-2 px-5 text-[10px]">
                Cadastrar
              </GoldButton>
            </Link>
          </div>
        </div>
      </div>

      <HeroSection />
      <ComoFuncionaSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
