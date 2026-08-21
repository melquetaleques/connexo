import { MagBotao } from "./MagBotao";

const FAQS = [
  {
    q: "Quem pode atuar como perito na plataforma?",
    a: "Contadores com CRC ativo. O cadastro valida registro e especialidade antes de liberar o recebimento de convites de vínculo.",
  },
  {
    q: "O cliente precisa criar conta para autorizar?",
    a: "Não. O consentimento é assinado por link único, com registro de IP, data e finalidade — e pode ser revogado pelo mesmo link.",
  },
  {
    q: "Como funciona a base legal de cada vínculo?",
    a: "Cada vínculo registra finalidade, escopo de documentos, prazo de retenção e a base legal aplicável ao tratamento.",
  },
  {
    q: "A vitrine respeita o Provimento 205/2021 do CFOAB?",
    a: "Sim. Campos informativos, sem mercantilização, promessa de resultado ou captação — com revisão antes da publicação.",
  },
  {
    q: "Consigo exportar o laudo e os anexos?",
    a: "Sim, em PDF assinado com carimbo de tempo, acompanhado do índice de anexos e da memória de cálculo.",
  },
];

export function MagFaq() {
  return (
    <div className="relative overflow-hidden bg-mg-ivory text-mg-ink" style={{ padding: "130px 40px 150px" }}>
      <div className="mag-field mag-veil mag-field-ivory" aria-hidden="true">
        <div className="mag-grain" aria-hidden="true" />
      </div>
      <section
        data-testid="mag-faq"
        className="relative"
        style={{
          maxWidth: 1220,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0px, 0.5fr) minmax(0px, 1fr)",
          gap: 60,
          alignItems: "start",
        }}
      >
        <div className="min-w-0">
          <h2
            className="mag-title-vinho font-display text-mg-vinho"
            style={{
              margin: "0 0 26px",
              fontWeight: 800,
              fontSize: 34,
              lineHeight: 1.18,
              letterSpacing: "-0.03em",
            }}
          >
            Respostas às perguntas mais comuns
          </h2>
          <MagBotao href="#landing-personas" variant="ghost">
            Falar com o suporte
          </MagBotao>
        </div>
        <div className="min-w-0">
          {FAQS.map((faq) => (
            <details key={faq.q}>
              <summary
                className="flex items-center justify-between cursor-pointer list-none"
                style={{
                  gap: 24,
                  padding: "22px 0",
                  font: '500 17px / 1.4 "Hanken Grotesk", sans-serif',
                  color: "rgb(59, 13, 22)",
                }}
              >
                <span className="pr-3 min-w-0 break-words">{faq.q}</span>
                <span style={{ color: "rgb(255, 77, 141)", fontWeight: 400 }} aria-hidden="true">
                  +
                </span>
              </summary>
              <p
                style={{
                  margin: "0 0 18px",
                  font: '400 15px / 1.65 "Hanken Grotesk", sans-serif',
                  color: "rgb(92, 74, 78)",
                  maxWidth: "66ch",
                }}
              >
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
