import { useEffect, useRef, useState, type ReactNode } from "react";

const TRAIL = [
  { label: "Consentimento", hint: "Link único, IP e data registrados.", active: true },
  { label: "Escopo de documentos" },
  { label: "Prazo de retenção" },
  { label: "Trilha de auditoria" },
  { label: "Revogação pelo cliente" },
];

const SCOPE = [
  { label: "Contrato e cédula", on: true },
  { label: "Extratos 2021–2026", on: true },
  { label: "Folha de pagamento", on: false },
];

type MagPainelProps = {
  children: ReactNode;
  activeIndex?: number;
};

export function MagPainel({ children, activeIndex = 0 }: MagPainelProps) {
  const [reduce, setReduce] = useState(false);
  const [opaque, setOpaque] = useState(true);
  const first = useRef(true);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return undefined;
    }
    setOpaque(false);
    const t = window.setTimeout(() => setOpaque(true), 180);
    return () => window.clearTimeout(t);
  }, [activeIndex]);

  return (
    <div
      data-testid="mag-painel"
      style={{
        background: "rgb(43, 39, 37)",
        borderRadius: 24,
        padding: 40,
        display: "grid",
        gridTemplateColumns: "minmax(0px, 0.78fr) minmax(0px, 1.22fr)",
        gap: 40,
        alignItems: "start",
        minHeight: 600,
      }}
      className="max-lg:!grid-cols-1"
    >
      <div>
        <h3
          style={{
            margin: "0 0 14px",
            font: "800 25px / 1.28 Figtree, sans-serif",
            letterSpacing: "-0.02em",
            color: "rgb(255, 255, 255)",
          }}
        >
          A trilha do consentimento.
          <br />
          Registrada do início ao fim.
        </h3>
        <p
          style={{
            margin: "0 0 20px",
            font: '400 15px / 1.6 "Hanken Grotesk", sans-serif',
            color: "rgba(255, 255, 255, 0.62)",
          }}
        >
          Finalidade, escopo de documentos, prazo de retenção e base legal em cada vínculo entre escritório, perito e cliente.
        </p>
        <a
          href="#landing-faq"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            font: '700 15px / 1 "Hanken Grotesk", sans-serif',
            color: "rgb(255, 255, 255)",
            marginBottom: 34,
            textDecoration: "none",
          }}
        >
          Mais informações →
        </a>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {TRAIL.map((item) =>
            item.active ? (
              <div key={item.label} style={{ padding: "14px 0 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 7 }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 17, color: "rgb(255, 255, 255)" }}
                    aria-hidden="true"
                  >
                    draw
                  </span>
                  <span style={{ font: '700 15px / 1 "Hanken Grotesk", sans-serif', color: "rgb(255, 255, 255)" }}>
                    {item.label}
                  </span>
                </div>
                <div
                  style={{
                    font: '400 14px / 1.5 "Hanken Grotesk", sans-serif',
                    color: "rgba(255, 255, 255, 0.55)",
                    paddingLeft: 27,
                  }}
                >
                  {item.hint}
                </div>
                <div
                  style={{
                    height: 2,
                    background: "linear-gradient(90deg, rgb(255, 255, 255) 42%, rgba(255, 255, 255, 0.16) 42%)",
                    marginTop: 16,
                  }}
                />
              </div>
            ) : (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px 0" }}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 17, color: "rgba(255, 255, 255, 0.6)" }}
                  aria-hidden="true"
                >
                  folder_open
                </span>
                <span
                  style={{
                    font: '600 15px / 1 "Hanken Grotesk", sans-serif',
                    color: "rgba(255, 255, 255, 0.72)",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ),
          )}
        </div>
      </div>

      <div style={{ position: "relative", minHeight: 520 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "2%",
            width: "52%",
            background: "rgb(255, 255, 255)",
            borderRadius: 14,
            padding: 18,
            boxShadow: "rgba(0, 0, 0, 0.5) 0px 24px 50px -18px",
            zIndex: 2,
          }}
        >
          <div
            style={{
              font: '600 10px / 1 "Hanken Grotesk", sans-serif',
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgb(154, 143, 134)",
              marginBottom: 12,
            }}
          >
            Vínculo
          </div>
          <div style={{ font: "700 16px / 1.3 Figtree, sans-serif", color: "rgb(59, 13, 22)", marginBottom: 6 }}>
            Pereira & Costa
          </div>
          <div
            style={{
              font: '400 13px / 1.4 "Hanken Grotesk", sans-serif',
              color: "rgb(107, 90, 94)",
              marginBottom: 14,
            }}
          >
            CRC-SP 1SP298431/O-4
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            <span
              style={{
                padding: "5px 10px",
                borderRadius: 6,
                background: "rgb(253, 238, 244)",
                font: '600 11px / 1 "Hanken Grotesk", sans-serif',
                color: "rgb(193, 30, 99)",
              }}
            >
              Perícia contábil
            </span>
            <span
              style={{
                padding: "5px 10px",
                borderRadius: 6,
                background: "rgb(239, 244, 253)",
                font: '600 11px / 1 "Hanken Grotesk", sans-serif',
                color: "rgb(43, 78, 168)",
              }}
            >
              Cível
            </span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 0,
            top: "22%",
            width: "44%",
            background: "rgb(58, 54, 52)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 14,
            padding: 16,
            zIndex: 2,
          }}
        >
          <div
            style={{
              font: '600 10px / 1 "Hanken Grotesk", sans-serif',
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.4)",
              marginBottom: 14,
            }}
          >
            Escopo autorizado
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SCOPE.map((row) => (
              <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span
                  style={
                    row.on
                      ? {
                          width: 15,
                          height: 15,
                          borderRadius: 4,
                          background: "rgb(255, 77, 141)",
                          color: "rgb(255, 255, 255)",
                          font: '700 9px / 15px "Hanken Grotesk", sans-serif',
                          textAlign: "center",
                          flex: "0 0 auto",
                        }
                      : {
                          width: 15,
                          height: 15,
                          borderRadius: 4,
                          border: "1.6px solid rgba(255, 255, 255, 0.35)",
                          flex: "0 0 auto",
                        }
                  }
                >
                  {row.on ? "✓" : null}
                </span>
                <span
                  style={{
                    font: '500 12px / 1.3 "Hanken Grotesk", sans-serif',
                    color: row.on ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.45)",
                  }}
                >
                  {row.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            top: "40%",
            width: "52%",
            borderRadius: 14,
            overflow: "hidden",
            height: 150,
            boxShadow: "rgba(0, 0, 0, 0.55) 0px 24px 50px -18px",
            zIndex: 1,
          }}
        >
          <div
            className="mag-photo"
            style={{
              backgroundImage: "url(/landing/tile-consentimento.jpg)",
              opacity: opaque ? 1 : 0.4,
              transition: reduce ? "none" : "opacity 180ms ease",
            }}
          />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="origin-top-left scale-[0.42] w-[238%]">{children}</div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: "2%",
            width: "44%",
            background: "rgb(255, 255, 255)",
            borderRadius: 14,
            padding: 18,
            boxShadow: "rgba(0, 0, 0, 0.5) 0px 24px 50px -18px",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ font: '600 12px / 1 "Hanken Grotesk", sans-serif', color: "rgb(59, 13, 22)" }}>Laudo v3</span>
            <span style={{ font: '700 12px / 1 "Hanken Grotesk", sans-serif', color: "rgb(193, 30, 99)" }}>72%</span>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: "rgb(239, 235, 230)", marginBottom: 12 }}>
            <div style={{ width: "72%", height: 6, borderRadius: 99, background: "rgb(255, 77, 141)" }} />
          </div>
          <div style={{ font: '400 12px / 1.4 "Hanken Grotesk", sans-serif', color: "rgb(107, 90, 94)" }}>
            14 de 19 quesitos respondidos
          </div>
        </div>

        <div
          className="landing-capsule"
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            gap: 10,
            height: 44,
            padding: "0 16px",
            background: "rgba(255, 255, 255, 0.94)",
            boxShadow: "rgba(0, 0, 0, 0.5) 0px 14px 30px -12px",
            zIndex: 3,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 15, color: "rgb(154, 143, 134)" }} aria-hidden="true">
            search
          </span>
          <span style={{ font: '400 14px / 1 "Hanken Grotesk", sans-serif', color: "rgb(154, 143, 134)" }}>
            Buscar quesito…
          </span>
        </div>
      </div>
    </div>
  );
}
