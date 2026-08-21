import { MagBotao } from "./MagBotao";

export function MagFecho() {
  return (
    <section
      data-testid="mag-fecho"
      className="relative overflow-hidden text-white"
      style={{
        height: 520,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(105deg, rgb(75, 42, 87), rgb(142, 74, 74) 46%, rgb(217, 138, 94))",
      }}
    >
      <div className="mag-field mag-veil landing-field-fecho" aria-hidden="true">
        <div className="mag-grain" aria-hidden="true" />
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(60% 70% at 78% 62%, rgba(255, 180, 120, 0.5), transparent 65%), radial-gradient(70% 80% at 10% 20%, rgba(60, 30, 70, 0.7), transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-4%",
          top: "8%",
          width: "60%",
          height: 2,
          background: "rgb(255, 77, 141)",
          transform: "rotate(19deg)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "8%",
          top: "-6%",
          width: 2,
          height: "120%",
          background: "rgb(255, 77, 141)",
          transform: "rotate(9deg)",
        }}
      />
      <div className="relative text-center" data-testid="landing-cta-final">
        <h2
          className="landing-fecho-title font-display"
          style={{
            margin: "0 0 26px",
            fontWeight: 800,
            fontSize: 52,
            lineHeight: 1.06,
            letterSpacing: "-0.035em",
            color: "rgb(255, 255, 255)",
          }}
        >
          Entre no expediente
        </h2>
        <MagBotao to="/register">Criar conta →</MagBotao>
      </div>
    </section>
  );
}
