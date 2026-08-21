import { useRef, useState } from "react";
import {
  GlyphCatalogo,
  GlyphConsentimento,
  GlyphLaudo,
  GlyphPrazo,
  GlyphProcesso,
  GlyphVitrine,
  IconChip,
} from "@/components/ui/connexo-icons";
import { MagBotao } from "./MagBotao";

const FILTERS = ["Destaques", "Vínculo", "Laudo", "Prazos", "Vitrine"];

const TOOLS = [
  {
    icon: (
      <IconChip tint="lavender">
        <GlyphProcesso />
      </IconChip>
    ),
    title: "Cadastro de perito",
    line: "Valide CRC e especialidade…",
  },
  {
    icon: (
      <IconChip tint="mint">
        <GlyphConsentimento />
      </IconChip>
    ),
    title: "Convite de vínculo",
    line: "Escopo, prazo e finalidade",
  },
  {
    icon: (
      <IconChip tint="lavender">
        <GlyphCatalogo />
      </IconChip>
    ),
    title: "Consentimento LGPD",
    line: "Base legal e revogação",
  },
  {
    icon: (
      <IconChip tint="rose">
        <GlyphLaudo />
      </IconChip>
    ),
    title: "Editor de laudo",
    line: "Quesitos, anexos e versões…",
  },
  {
    icon: (
      <IconChip tint="sand">
        <GlyphPrazo />
      </IconChip>
    ),
    title: "Controle de prazos",
    line: "Dias úteis e alerta em D-5",
  },
  {
    icon: (
      <IconChip tint="sky">
        <GlyphLaudo />
      </IconChip>
    ),
    title: "Assinatura digital",
    line: "ICP-Brasil e carimbo de tempo",
  },
  {
    icon: (
      <IconChip tint="peach">
        <GlyphVitrine />
      </IconChip>
    ),
    title: "Vitrine pública",
    line: "Perfil do perito e avaliações",
  },
];

export function MagFerramentas() {
  const scroller = useRef<HTMLUListElement>(null);
  const [filter, setFilter] = useState(0);

  const go = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = 14;
    const w = card ? card.getBoundingClientRect().width + gap : 232;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * w, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-mg-ivory text-mg-ink" style={{ padding: "120px 40px 0" }}>
      <div style={{ maxWidth: 1220, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 40,
            marginBottom: 44,
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
                lineHeight: 1.14,
                letterSpacing: "-0.03em",
              }}
            >
              Comece simples.
              <br />
              Escale quando o rito exigir
            </h2>
            <p style={{ margin: 0, font: '400 17px / 1.55 "Hanken Grotesk", sans-serif', color: "rgb(92, 74, 78)" }}>
              De um processo à banca inteira, no seu ritmo.
            </p>
          </div>
          <MagBotao href="#produto">Ver o painel →</MagBotao>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0px, 0.86fr) minmax(0px, 1fr) minmax(0px, 1fr)",
            gridTemplateRows: "auto auto",
            gap: 16,
            marginBottom: 120,
          }}
          className="max-lg:!grid-cols-1"
        >
          <div
            style={{
              gridRow: "span 2",
              background: "rgb(228, 226, 222)",
              borderRadius: 20,
              padding: 30,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px",
                font: "800 23px / 1.25 Figtree, sans-serif",
                letterSpacing: "-0.02em",
                color: "rgb(28, 27, 26)",
              }}
            >
              Cada ferramenta, pronta para usar
            </h3>
            <p
              style={{
                margin: "0 0 28px",
                font: '400 15px / 1.6 "Hanken Grotesk", sans-serif',
                color: "rgb(87, 80, 76)",
              }}
            >
              Cadastro, vínculo, prazos, laudo, assinatura e vitrine — doze módulos, nenhum setup. Abra o que precisar.
            </p>
            <div
              style={{
                margin: "auto -30px -30px",
                background: "rgb(237, 235, 231)",
                borderRadius: "16px 16px 0 0",
                padding: "16px 16px 0",
              }}
            >
              <div style={{ display: "flex", gap: 16, marginBottom: 14, paddingLeft: 2, overflow: "hidden" }}>
                <span
                  className="landing-capsule"
                  style={{
                    padding: "8px 16px",
                    background: "rgb(28, 27, 26)",
                    font: '700 12px / 1 "Hanken Grotesk", sans-serif',
                    letterSpacing: "0.06em",
                    color: "rgb(255, 255, 255)",
                  }}
                >
                  TODOS
                </span>
                {["VÍNCULO", "LAUDO", "PR"].map((label) => (
                  <span
                    key={label}
                    style={{
                      padding: "8px 0",
                      font: '700 12px / 1 "Hanken Grotesk", sans-serif',
                      letterSpacing: "0.06em",
                      color: "rgb(163, 154, 147)",
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div
                className="relative overflow-hidden mag-field mag-field-ivory"
                style={{ borderRadius: "12px 12px 0 0", height: 220, boxShadow: "rgba(28, 27, 26, 0.3) 0px -2px 20px -10px" }}
              >
                <div className="mag-photo-frame" aria-hidden="true">
                  <div className="mag-photo" style={{ backgroundImage: "url(/landing/painel-retrato.jpg)" }} />
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              gridColumn: "span 2",
              background: "rgb(16, 15, 14)",
              borderRadius: 20,
              padding: 30,
              display: "grid",
              gridTemplateColumns: "minmax(0px, 1fr) minmax(0px, 1.05fr)",
              gap: 24,
              alignItems: "start",
              overflow: "hidden",
              position: "relative",
              minHeight: 300,
            }}
            className="max-lg:!col-span-1 max-lg:!grid-cols-1"
          >
            <div>
              <h3
                style={{
                  margin: "0 0 12px",
                  font: "800 23px / 1.25 Figtree, sans-serif",
                  letterSpacing: "-0.02em",
                  color: "rgb(255, 255, 255)",
                }}
              >
                Todo o processo em uma só linha do tempo
              </h3>
              <p style={{ margin: 0, font: '400 15px / 1.6 "Hanken Grotesk", sans-serif', color: "rgba(255, 255, 255, 0.6)" }}>
                Nomeação, vínculo, quesitos, versões do laudo e entrega. Compare versões e trabalhe com o perito no mesmo fio.
              </p>
            </div>
            <div style={{ position: "relative", height: 220 }}>
              <div
                className="overflow-hidden"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 14,
                  width: "74%",
                  borderRadius: 10,
                  height: 140,
                  boxShadow: "rgba(0, 0, 0, 0.6) 0px 20px 40px -14px",
                }}
              >
                <div className="mag-photo" style={{ backgroundImage: "url(/landing/tile-vitrine.jpg)" }} />
              </div>
              <div
                style={{
                  position: "absolute",
                  right: 8,
                  top: 34,
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "rgb(90, 108, 224)",
                  font: '600 11px / 1 "Hanken Grotesk", sans-serif',
                  color: "rgb(255, 255, 255)",
                }}
              >
                Perito
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 20,
                  bottom: 0,
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "rgb(255, 77, 141)",
                  font: '600 11px / 1 "Hanken Grotesk", sans-serif',
                  color: "rgb(255, 255, 255)",
                }}
              >
                Advogado
              </div>
            </div>
          </div>

          <div
            className="mag-field mag-field-vinho relative overflow-hidden"
            style={{
              borderRadius: 20,
              padding: 30,
              display: "flex",
              flexDirection: "column",
              minHeight: 330,
            }}
          >
            <div className="mag-grain" aria-hidden="true" />
            <h3
              className="relative"
              style={{
                margin: "0 0 12px",
                font: "800 23px / 1.25 Figtree, sans-serif",
                letterSpacing: "-0.02em",
                color: "rgb(255, 255, 255)",
              }}
            >
              Um caso, o time inteiro
            </h3>
            <p
              className="relative"
              style={{
                margin: "0 0 24px",
                font: '400 15px / 1.6 "Hanken Grotesk", sans-serif',
                color: "rgba(255, 255, 255, 0.66)",
              }}
            >
              Organize documentos, versões e prazos por processo. O time trabalha junto, o caso permanece íntegro.
            </p>
            <div className="relative mt-auto grid grid-cols-2 gap-3">
              <div className="overflow-hidden" style={{ borderRadius: 12, height: 120 }}>
                <div className="mag-photo" style={{ backgroundImage: "url(/landing/tile-advocacia.jpg)" }} />
              </div>
              <div className="overflow-hidden" style={{ borderRadius: 12, height: 120 }}>
                <div className="mag-photo" style={{ backgroundImage: "url(/landing/tile-laudo.jpg)" }} />
              </div>
            </div>
          </div>

          <div
            className="relative overflow-hidden"
            style={{
              background: "rgb(18, 60, 90)",
              borderRadius: 20,
              padding: 30,
              display: "flex",
              flexDirection: "column",
              minHeight: 330,
            }}
          >
            <h3
              style={{
                margin: "0 0 12px",
                font: "800 23px / 1.25 Figtree, sans-serif",
                letterSpacing: "-0.02em",
                color: "rgb(255, 255, 255)",
              }}
            >
              Modelo de laudo em um clique
            </h3>
            <p style={{ margin: 0, font: '400 15px / 1.6 "Hanken Grotesk", sans-serif', color: "rgba(255, 255, 255, 0.68)" }}>
              Salve a estrutura de um laudo aprovado como modelo. O próximo perito parte dele.
            </p>
            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", height: 130 }}>
              <span
                className="landing-capsule"
                style={{
                  padding: "14px 30px",
                  border: "2px solid rgb(255, 77, 141)",
                  font: "600 26px / 1 Figtree, sans-serif",
                  letterSpacing: "-0.01em",
                  color: "rgb(255, 255, 255)",
                }}
              >
                USAR MODELO
              </span>
            </div>
          </div>
        </div>

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
          Escolha um módulo, comece o rito
        </h2>
        <p
          style={{
            margin: "0 0 40px",
            font: '400 17px / 1.55 "Hanken Grotesk", sans-serif',
            color: "rgb(92, 74, 78)",
          }}
        >
          Cadastrar, vincular, apurar — seu fluxo de perícia começa aqui.
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, marginBottom: 26, flexWrap: "wrap" }}>
          <div
            className="landing-capsule inline-flex items-center"
            style={{ gap: 2, padding: 5, background: "rgb(255, 255, 255)" }}
          >
            {FILTERS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setFilter(i)}
                className="landing-capsule"
                style={{
                  padding: "10px 20px",
                  background: i === filter ? "rgb(28, 27, 26)" : "transparent",
                  font: '600 14px / 1 "Hanken Grotesk", sans-serif',
                  color: i === filter ? "rgb(255, 255, 255)" : "rgb(59, 13, 22)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              aria-label="Ferramenta anterior"
              onClick={() => go(-1)}
              className="landing-capsule"
              style={{
                width: 38,
                height: 38,
                background: "rgb(231, 228, 223)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                font: '500 15px / 1 "Hanken Grotesk", sans-serif',
                color: "rgb(154, 144, 136)",
              }}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Próxima ferramenta"
              onClick={() => go(1)}
              className="landing-capsule"
              style={{
                width: 38,
                height: 38,
                background: "rgb(231, 228, 223)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                font: '500 15px / 1 "Hanken Grotesk", sans-serif',
                color: "rgb(59, 13, 22)",
              }}
            >
              →
            </button>
          </div>
        </div>
        <ul
          data-testid="mag-ferramentas"
          ref={scroller}
          style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(180px, 1fr))", gap: 14 }}
          className="overflow-x-auto"
        >
          {TOOLS.map((t) => (
            <li
              key={t.title}
              style={{
                background: "rgb(255, 255, 255)",
                borderRadius: 14,
                padding: 18,
                minWidth: 180,
              }}
            >
              <span style={{ display: "block", marginBottom: 38 }}>{t.icon}</span>
              <div style={{ font: '600 15px / 1.3 "Hanken Grotesk", sans-serif', color: "rgb(28, 27, 26)", marginBottom: 6 }}>
                {t.title}
              </div>
              <div style={{ font: '400 13px / 1.45 "Hanken Grotesk", sans-serif', color: "rgb(124, 114, 109)" }}>
                {t.line}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
