import { MagBotao } from "./MagBotao";

export function MagHero() {
  return (
    <div data-testid="mag-hero" style={{ paddingLeft: 60 }} className="max-lg:!pl-0">
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          height: 42,
          padding: "0 18px",
          borderRadius: 8,
          background: "rgba(255, 255, 255, 0.13)",
          border: "1px solid rgba(255, 255, 255, 0.16)",
          marginBottom: 26,
        }}
      >
        <span style={{ font: '700 14px / 1 "Hanken Grotesk", sans-serif', color: "rgb(255, 255, 255)" }}>
          Perícia contábil judicial
        </span>
        <span style={{ font: '500 14px / 1 "Hanken Grotesk", sans-serif', color: "rgba(255, 255, 255, 0.6)" }}>
          CPC art. 465
        </span>
        <span style={{ font: '700 14px / 1 "Hanken Grotesk", sans-serif', color: "rgb(255, 77, 141)" }}>
          →
        </span>
      </div>
      <h1
        className="font-display"
        style={{
          margin: "0 0 22px",
          fontWeight: 800,
          fontSize: 58,
          lineHeight: 1.09,
          letterSpacing: "-0.03em",
          color: "rgb(255, 255, 255)",
          maxWidth: "15ch",
        }}
      >
        O laudo que a tese precisa. O cliente no meio.
      </h1>
      <p
        style={{
          margin: "0 0 30px",
          font: '400 17px / 1.55 "Hanken Grotesk", sans-serif',
          color: "rgba(255, 255, 255, 0.86)",
          maxWidth: "52ch",
        }}
      >
        Todo o rito da prova pericial em um só lugar. Vínculo autorizado, prazos, laudo versionado e entrega assinada — para advocacia, perícia e cliente.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <MagBotao to="/login" variant="light">
          Acessar o expediente
        </MagBotao>
        <MagBotao href="#produto" variant="solid">
          <span style={{ fontSize: 11 }}>▶</span> Por que Connexo?
        </MagBotao>
      </div>
    </div>
  );
}
