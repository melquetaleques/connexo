import { Icon } from "@/components/ui/connexo-primitives";
import { MagBotao } from "./MagBotao";

const FAQS = [
  {
    q: "O que o Connexo faz, na prática?",
    a: "Liga três papéis que hoje se falam por e-mail e pasta compartilhada: o advogado pede a perícia, o cliente autoriza cada documento, o contador entrega o laudo. O processo inteiro fica visível para os três.",
  },
  {
    q: "Sou cliente. Meus dados vão para o perito sem eu ver?",
    a: "Não. Cada documento tem consentimento LGPD próprio. Você escolhe o contador, autoriza o que ele pode ler e acompanha o andamento. Sem autorização, o laudo não começa.",
  },
  {
    q: "O Connexo respeita a ética da OAB?",
    a: "Sim. Honorários advocatícios e honorários do perito ficam separados. O contador recebe pelo trabalho técnico, nunca por indicação (Art. 7º do Código de Ética).",
  },
  {
    q: "Preciso entender contabilidade para usar?",
    a: "Não. O advogado descreve o escopo da perícia. O contador responde com o laudo. Você revisa, pede ajuste e usa o número na tese — sem virar perito.",
  },
  {
    q: "Como o contador entra no catálogo?",
    a: "Com CRC verificado, perfil público com slug próprio, vitrine de serviços e postagens, disponibilidade e avaliações. O cliente escolhe a partir disso, não de uma indicação opaca.",
  },
  {
    q: "Posso usar sozinho ou preciso de um escritório?",
    a: "Advogados autônomos cadastram o próprio processo. Escritórios convidam a equipe. Clientes entram por convite do processo. Contadores abrem o perfil público e passam a receber fila.",
  },
];

export function MagFaq() {
  return (
    <div className="bg-mg-ivory text-mg-ink py-20">
      <section
        data-testid="mag-faq"
        className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-2 gap-4 sm:gap-12 items-start"
      >
        <div className="min-w-0">
          <h2 className="font-display font-semibold tracking-tight text-xl sm:text-[2rem] mb-6">
            Perguntas antes de entrar
          </h2>
          <MagBotao href="#landing-personas">Escolher meu papel</MagBotao>
        </div>
        <div className="min-w-0 space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="landing-glass-light backdrop-blur-xl rounded-[16px]"
            >
              <summary className="flex items-center justify-between min-h-11 p-4 cursor-pointer list-none font-ui font-semibold text-sm sm:text-base text-mg-ink">
                <span className="pr-3 min-w-0 break-words">{faq.q}</span>
                <Icon name="expand_more" className="text-xl text-mg-ink shrink-0" />
              </summary>
              <p className="px-4 pb-4 font-ui text-sm text-on-surface-variant leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
