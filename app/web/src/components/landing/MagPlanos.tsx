import { MagBotao } from "./MagBotao";

const MODULES = [
  { name: "Editor de laudo", tipo: "Perícia", tipoBg: "rgb(42, 51, 88)", tipoFg: "rgb(159, 176, 232)", on: true },
  { name: "Vitrine pública", tipo: "Marketing", tipoBg: "rgb(58, 46, 30)", tipoFg: "rgb(216, 178, 116)", on: false },
  { name: "Assinatura digital", tipo: "Compliance", tipoBg: "rgb(30, 58, 51)", tipoFg: "rgb(127, 203, 178)", on: true },
  { name: "Integração PJe", tipo: "Processo", tipoBg: "rgb(42, 51, 88)", tipoFg: "rgb(159, 176, 232)", on: false },
];

const USERS = [
  { name: "Eduarda Pereira", mail: "eduarda@pereiraecosta", bg: "rgb(74, 58, 68)", curso: 7, pct: "58%", bar: "rgb(76, 99, 199)" },
  { name: "Rafael Ribeiro", mail: "rafael@ribeiropericias", bg: "rgb(58, 68, 80)", curso: 3, pct: "25%", bar: "rgb(76, 99, 199)" },
  { name: "Marina Duarte", mail: "marina@duarte.adv.br", bg: "rgb(74, 68, 56)", curso: 11, pct: "92%", bar: "rgb(216, 169, 60)" },
];

const GOVERNANCE = [
  { icon: "fact_check", title: "Trilha de auditoria", text: "Quem acessou, quando e sob qual base legal — exportável." },
  { icon: "verified_user", title: "Segurança e LGPD", text: "Criptografia em repouso, DPA e sub-operadores declarados." },
  { icon: "key", title: "Controle de papéis", text: "Perito vê o caso, não a carteira. Um painel, visibilidade total." },
  { icon: "inventory_2", title: "O caso é seu", text: "Exportação integral a qualquer momento. Nunca treinamos nada com seus dados." },
  { icon: "support_agent", title: "Suporte dedicado", text: "Um time real, do onboarding ao dia a dia da banca." },
  { icon: "gavel", title: "Publicidade ética", text: "Vitrine revisada dentro do Provimento 205/2021 do CFOAB." },
];

const QUOTES = [
  {
    mark: "square",
    firm: "Machado",
    quote: "O convite com escopo acabou com a troca de documento por e-mail. A prova pericial virou uma etapa previsível.",
    who: "Ana Machado",
    role: "Sócia, Machado Advocacia",
  },
  {
    mark: "circle",
    firm: "Pereira & Costa",
    quote: "Sei em que versão está cada laudo sem abrir o processo no tribunal. O prazo deixou de ser surpresa.",
    who: "Eduarda Pereira",
    role: "Perita contábil, CRC-SP",
  },
  {
    mark: "diamond",
    firm: "Ribeiro Perícias",
    quote: "A vitrine trouxe nomeação de escritório que eu não conhecia — dentro do que a norma permite.",
    who: "Rafael Ribeiro",
    role: "Perito contábil, CRC-MG",
  },
];

export function MagPlanos() {
  return (
    <section
      id="planos"
      data-testid="mag-planos"
      className="mag-field mag-field-ink relative overflow-hidden text-white"
      style={{ marginTop: 120, background: "rgb(28, 27, 26)", padding: "120px 40px" }}
    >
      <div className="mag-grain" aria-hidden="true" />
      <div style={{ maxWidth: 1220, margin: "0 auto" }}>
        <h2
          className="font-display"
          style={{
            margin: "0 0 56px",
            fontWeight: 800,
            fontSize: 44,
            lineHeight: 1.14,
            letterSpacing: "-0.03em",
            color: "rgb(255, 255, 255)",
            maxWidth: "24ch",
          }}
        >
          Planos feitos para escritórios que trabalham com perícia
        </h2>
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0px, 1fr))", gap: 64, marginBottom: 60 }}
          className="max-md:!grid-cols-1"
        >
          <div>
            <div
              style={{
                font: "800 23px / 1.2 Figtree, sans-serif",
                letterSpacing: "-0.02em",
                color: "rgb(255, 255, 255)",
                marginBottom: 14,
              }}
            >
              Escritório
            </div>
            <p
              style={{
                margin: "0 0 26px",
                font: '400 15px / 1.6 "Hanken Grotesk", sans-serif',
                color: "rgba(255, 255, 255, 0.52)",
              }}
            >
              Para bancas e contabilidades prontas para tirar a perícia do e-mail. Processos ilimitados, peritos vinculados sem custo por convite e trilha de auditoria completa.
            </p>
            <MagBotao to="/register?role=advogado" variant="light">
              Saber mais
            </MagBotao>
          </div>
          <div>
            <div
              style={{
                font: "800 23px / 1.2 Figtree, sans-serif",
                letterSpacing: "-0.02em",
                color: "rgb(255, 255, 255)",
                marginBottom: 14,
              }}
            >
              Enterprise
            </div>
            <p
              style={{
                margin: "0 0 26px",
                font: '400 15px / 1.6 "Hanken Grotesk", sans-serif',
                color: "rgba(255, 255, 255, 0.52)",
              }}
            >
              Para organizações onde a prova técnica é crítica. SSO, DPA assinado, retenção customizada, usuários ilimitados e um time dedicado desde o primeiro dia.
            </p>
            <MagBotao to="/register?role=contador" variant="ghost" className="text-white">
              Falar com o time
            </MagBotao>
          </div>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0px, 1fr))", gap: 20, marginBottom: 20 }}
          className="max-md:!grid-cols-1"
        >
          <div style={{ background: "rgb(36, 35, 34)", borderRadius: 16, padding: 30 }}>
            <h3
              style={{
                margin: "0 0 12px",
                font: "800 22px / 1.25 Figtree, sans-serif",
                letterSpacing: "-0.02em",
                color: "rgb(255, 255, 255)",
              }}
            >
              Todos os módulos em um só painel
            </h3>
            <p
              style={{
                margin: "0 0 30px",
                font: '400 15px / 1.6 "Hanken Grotesk", sans-serif',
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              Habilite o que o escritório usa. Permissões por papel definidas no painel do administrador.
            </p>
            <div style={{ background: "rgb(44, 43, 41)", borderRadius: 12, padding: 16 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1.1fr 0.7fr 0.4fr",
                  gap: 12,
                  paddingBottom: 12,
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  font: '500 12px / 1 "Hanken Grotesk", sans-serif',
                  color: "rgba(255, 255, 255, 0.42)",
                }}
              >
                <span>Módulo (12)</span>
                <span>Tipo</span>
                <span>Ativo</span>
                <span />
              </div>
              {MODULES.map((row) => (
                <div
                  key={row.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5fr 1.1fr 0.7fr 0.4fr",
                    gap: 12,
                    padding: "13px 0",
                    alignItems: "center",
                  }}
                >
                  <span style={{ font: '500 13px / 1 "Hanken Grotesk", sans-serif', color: "rgba(255, 255, 255, 0.9)" }}>
                    {row.name}
                  </span>
                  <span
                    style={{
                      padding: "4px 9px",
                      borderRadius: 5,
                      background: row.tipoBg,
                      font: '500 11px / 1 "Hanken Grotesk", sans-serif',
                      color: row.tipoFg,
                      justifySelf: "start",
                    }}
                  >
                    {row.tipo}
                  </span>
                  <span
                    className="landing-capsule relative"
                    style={{
                      width: 34,
                      height: 19,
                      background: row.on ? "rgb(76, 99, 199)" : "rgb(58, 57, 54)",
                    }}
                  >
                    <span
                      className="landing-capsule"
                      style={{
                        position: "absolute",
                        [row.on ? "right" : "left"]: 2,
                        top: 2,
                        width: 15,
                        height: 15,
                        background: "rgb(255, 255, 255)",
                      }}
                    />
                  </span>
                  <span style={{ color: "rgba(255, 255, 255, 0.4)", font: '600 13px / 1 "Hanken Grotesk", sans-serif' }}>⋮</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "rgb(36, 35, 34)", borderRadius: 16, padding: 30 }}>
            <h3
              style={{
                margin: "0 0 12px",
                font: "800 22px / 1.25 Figtree, sans-serif",
                letterSpacing: "-0.02em",
                color: "rgb(255, 255, 255)",
              }}
            >
              Usuários ilimitados, custo por caso
            </h3>
            <p
              style={{
                margin: "0 0 30px",
                font: '400 15px / 1.6 "Hanken Grotesk", sans-serif',
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              Cresça sem limite de assentos. Pague pelos processos em curso, não por quantas pessoas abrem o sistema.
            </p>
            <div style={{ background: "rgb(44, 43, 41)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
              {USERS.map((u) => (
                <div key={u.name} style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14, alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="landing-capsule" style={{ width: 30, height: 30, background: u.bg, flex: "0 0 auto" }} />
                    <div>
                      <div style={{ font: '600 12px / 1.3 "Hanken Grotesk", sans-serif', color: "rgb(255, 255, 255)" }}>{u.name}</div>
                      <div style={{ font: '400 11px / 1.3 "Hanken Grotesk", sans-serif', color: "rgba(255, 255, 255, 0.4)" }}>{u.mail}</div>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        font: '400 11px / 1 "Hanken Grotesk", sans-serif',
                        color: "rgba(255, 255, 255, 0.5)",
                        marginBottom: 6,
                      }}
                    >
                      <span>
                        Em curso <span style={{ color: "rgb(255, 255, 255)", fontWeight: 600 }}>{u.curso}</span>
                      </span>
                      <span>
                        Limite <span style={{ color: "rgb(255, 255, 255)", fontWeight: 600 }}>12</span>
                      </span>
                    </div>
                    <div className="landing-capsule" style={{ height: 4, background: "rgb(58, 57, 54)" }}>
                      <div className="landing-capsule" style={{ width: u.pct, height: 4, background: u.bar }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: "rgb(36, 35, 34)", borderRadius: 16, padding: 36, marginBottom: 76 }}>
          <h3
            style={{
              margin: "0 0 10px",
              font: "800 22px / 1.25 Figtree, sans-serif",
              letterSpacing: "-0.02em",
              color: "rgb(255, 255, 255)",
            }}
          >
            Governança pensada para escala
          </h3>
          <p
            style={{
              margin: "0 0 34px",
              font: '400 15px / 1.6 "Hanken Grotesk", sans-serif',
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            Segurança, conformidade e controle administrativo para bancas de qualquer tamanho.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0px, 1fr))", gap: "30px 40px" }} className="max-md:!grid-cols-1">
            {GOVERNANCE.map((g) => (
              <div key={g.title} style={{ display: "grid", gridTemplateColumns: "34px minmax(0px, 1fr)", gap: 14 }}>
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    border: "1px solid rgba(255, 255, 255, 0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: "rgba(255, 255, 255, 0.8)" }} aria-hidden="true">
                    {g.icon}
                  </span>
                </span>
                <div>
                  <div style={{ font: '600 15px / 1.3 "Hanken Grotesk", sans-serif', color: "rgb(255, 255, 255)", marginBottom: 6 }}>
                    {g.title}
                  </div>
                  <div style={{ font: '400 14px / 1.5 "Hanken Grotesk", sans-serif', color: "rgba(255, 255, 255, 0.45)" }}>
                    {g.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0px, 1fr))", gap: 40 }} className="max-md:!grid-cols-1">
          {QUOTES.map((q) => (
            <div key={q.firm}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 22 }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    background: "rgb(255, 255, 255)",
                    borderRadius: q.mark === "circle" ? 99 : 0,
                    transform: q.mark === "diamond" ? "rotate(45deg)" : undefined,
                  }}
                />
                <span style={{ font: "700 20px / 1 Figtree, sans-serif", color: "rgb(255, 255, 255)" }}>{q.firm}</span>
              </div>
              <p
                style={{
                  margin: "0 0 22px",
                  font: "700 17px / 1.45 Figtree, sans-serif",
                  letterSpacing: "-0.01em",
                  color: "rgba(255, 255, 255, 0.42)",
                }}
              >
                “{q.quote}”
              </p>
              <div style={{ font: '600 14px / 1.4 "Hanken Grotesk", sans-serif', color: "rgb(255, 255, 255)" }}>{q.who}</div>
              <div style={{ font: '400 14px / 1.4 "Hanken Grotesk", sans-serif', color: "rgba(255, 255, 255, 0.5)" }}>{q.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
