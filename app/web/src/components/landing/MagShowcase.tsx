import { MagBotao } from "./MagBotao";

const CASES = [
  {
    src: "/landing/tile-advocacia.jpg",
    field: "mag-field-vinho",
    veil: "mag-photo-veil-vinho",
    tag: "Painel do advogado",
    title: "Revisão de contrato",
    text: "Encargos abusivos em cédula bancária. Da inicial ao parecer.",
    tall: true,
  },
  {
    src: "/landing/tile-laudo.jpg",
    field: "mag-field-teal",
    veil: "mag-photo-veil-teal",
    tag: "Painel do perito",
    title: "Apuração de haveres",
    text: "Dissolução parcial com balanço de determinação.",
    tall: true,
  },
  {
    src: "/landing/tile-consentimento.jpg",
    field: "mag-field-ink",
    veil: "mag-photo-veil-ink",
    tag: "Cadastro de cliente",
    title: "Liquidação de sentença",
    text: "Índices oficiais, memória de cálculo e planilhas.",
    tall: true,
  },
] as const;

export function MagShowcase() {
  return (
    <section data-testid="mag-showcase" className="mag-field mag-field-ivory relative overflow-hidden text-mg-ink" style={{ padding: "120px 40px 0" }}>
      <div style={{ maxWidth: 1220, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 40,
            marginBottom: 36,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              className="mag-title-vinho font-display text-mg-vinho"
              style={{
                margin: "0 0 12px",
                fontWeight: 800,
                fontSize: 40,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}
            >
              Da nomeação ao trânsito em julgado
            </h2>
            <p
              style={{
                margin: 0,
                font: '400 17px / 1.55 "Hanken Grotesk", sans-serif',
                color: "rgb(92, 74, 78)",
                maxWidth: "58ch",
              }}
            >
              Revisão contratual, apuração de haveres, liquidação de sentença e trabalhista. Tudo que a prova pericial contábil exige, em qualquer rito.
            </p>
          </div>
          <MagBotao href="#produto">Ver casos →</MagBotao>
        </div>
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0px, 1fr))", gap: 16, listStyle: "none", margin: 0, padding: 0 }} className="max-md:!grid-cols-1">
          {CASES.map((tile) => (
            <li
              key={tile.title}
              className={`mag-field ${tile.field} mag-photo-hover-card relative isolate overflow-hidden`}
              style={{ borderRadius: 16, height: 530, display: "flex", alignItems: "flex-end" }}
            >
              <div className="mag-photo-frame" aria-hidden="true">
                <div className="mag-photo mag-photo-hover" style={{ backgroundImage: `url(${tile.src})` }} />
                <div className={`mag-photo-veil ${tile.veil}`} />
                <div className="mag-grain" />
              </div>
              <span
                className="relative"
                style={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                  padding: "5px 11px",
                  borderRadius: 6,
                  background: "rgba(20, 14, 11, 0.6)",
                  font: '600 11px / 1 "Hanken Grotesk", sans-serif',
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                {tile.tag}
              </span>
              <div className="relative" style={{ padding: 24 }}>
                <div
                  style={{
                    font: "800 21px / 1.2 Figtree, sans-serif",
                    letterSpacing: "-0.02em",
                    color: "rgb(255, 255, 255)",
                    marginBottom: 8,
                  }}
                >
                  {tile.title}
                </div>
                <div style={{ font: '400 14px / 1.5 "Hanken Grotesk", sans-serif', color: "rgba(255, 255, 255, 0.72)" }}>
                  {tile.text}
                </div>
              </div>
            </li>
          ))}
          <li
            className="mag-field mag-field-ink mag-photo-hover-card relative isolate overflow-hidden col-span-3 max-md:!col-span-1"
            style={{ borderRadius: 16, height: 420, display: "flex", alignItems: "flex-end" }}
          >
            <div className="mag-photo-frame" aria-hidden="true">
              <div className="mag-photo mag-photo-hover" style={{ backgroundImage: "url(/landing/tile-vitrine.jpg)" }} />
              <div className="mag-photo-veil mag-photo-veil-ink" />
              <div className="mag-grain" />
            </div>
            <div className="relative" style={{ padding: 28 }}>
              <div
                style={{
                  font: "800 21px / 1.2 Figtree, sans-serif",
                  letterSpacing: "-0.02em",
                  color: "rgb(255, 255, 255)",
                  marginBottom: 8,
                }}
              >
                Trabalhista
              </div>
              <div
                style={{
                  font: '400 14px / 1.5 "Hanken Grotesk", sans-serif',
                  color: "rgba(255, 255, 255, 0.72)",
                  maxWidth: "56ch",
                }}
              >
                Cinco anos de folha reconstruídos, quesitos respondidos e laudo entregue em 19 dias.
              </div>
            </div>
          </li>
        </ul>

        <div style={{ marginTop: 120 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 40,
              marginBottom: 32,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                className="mag-title-vinho font-display text-mg-vinho"
                style={{
                  margin: "0 0 12px",
                  fontWeight: 800,
                  fontSize: 40,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                }}
              >
                Feito no Connexo
              </h2>
              <p style={{ margin: 0, font: '400 17px / 1.55 "Hanken Grotesk", sans-serif', color: "rgb(92, 74, 78)" }}>
                Perícias reais conduzidas por escritórios parceiros.
              </p>
            </div>
            <MagBotao href="#landing-personas">Ver perícias →</MagBotao>
          </div>
          <div
            className="mag-field mag-field-ink mag-photo-hover-card relative isolate overflow-hidden"
            style={{ borderRadius: 18, height: 660, display: "flex", alignItems: "flex-end" }}
          >
            <div className="mag-photo-frame" aria-hidden="true">
              <div className="mag-photo mag-photo-hover" style={{ backgroundImage: "url(/landing/tile-suave.jpg)" }} />
              <div className="mag-photo-veil mag-photo-veil-ink" />
              <div className="mag-grain" />
            </div>
            <div className="relative" style={{ padding: 34, maxWidth: 520 }}>
              <div
                style={{
                  font: '600 13px / 1 "Hanken Grotesk", sans-serif',
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: 18,
                }}
              >
                <span style={{ fontWeight: 700, color: "rgb(255, 255, 255)" }}>Connexo</span> Casos
              </div>
              <div
                style={{
                  font: "700 17px / 1.3 Figtree, sans-serif",
                  color: "rgb(255, 255, 255)",
                  marginBottom: 10,
                }}
              >
                Vale Norte × Banco Meridional
              </div>
              <p
                style={{
                  margin: "0 0 20px",
                  font: '400 15px / 1.6 "Hanken Grotesk", sans-serif',
                  color: "rgba(255, 255, 255, 0.78)",
                }}
              >
                R$ 4,1 milhões de encargos revisados em 19 dias de perícia, com laudo assinado digitalmente e nenhuma impugnação técnica.
              </p>
              <a
                href="#produto"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  height: 42,
                  padding: "0 20px",
                  borderRadius: 8,
                  background: "rgba(255, 255, 255, 0.16)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  font: '700 14px / 1 "Hanken Grotesk", sans-serif',
                  color: "rgb(255, 255, 255)",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontSize: 10 }}>▶</span> Ver o resumo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
