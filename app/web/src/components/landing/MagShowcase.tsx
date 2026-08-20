function TilePill({ label }: { label: string }) {
  return (
    <span className="absolute bottom-4 left-4 landing-pill landing-glass-ink backdrop-blur-xl text-white font-ui text-xs font-semibold px-3 min-h-8 inline-flex items-center">
      {label}
    </span>
  );
}

export function MagShowcase() {
  return (
    <section data-testid="mag-showcase" className="relative overflow-hidden bg-mg-ivory text-mg-ink py-20">
      <div className="mag-field mag-veil mag-field-ivory" aria-hidden="true">
        <div className="mag-grain" aria-hidden="true" />
      </div>
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <h2 className="mag-title-vinho font-display font-semibold tracking-tight text-[2rem] mb-8 text-mg-vinho">
          O produto, em tela
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <li className="mag-field mag-field-vinho relative isolate min-h-[28rem] sm:row-span-2 rounded-[16px] overflow-hidden">
            <div className="mag-grain" aria-hidden="true" />
            <div className="relative space-y-2 pt-5 px-4">
              {["Helena Vasconcelos", "Rafael Monteiro", "Lúcia Andrade", "Marina Costa"].map((n) => (
                <div key={n} className="flex items-center gap-2 rounded-2xl bg-mg-ink/50 px-3 py-2">
                  <span className="w-7 h-7 rounded-full bg-mg-magenta text-white font-ui text-[10px] font-bold flex items-center justify-center">
                    {n
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span className="font-ui text-xs text-white truncate">{n}</span>
                </div>
              ))}
            </div>
            <TilePill label="Catálogo" />
          </li>
          <li className="mag-field mag-field-teal relative isolate min-h-[13.5rem] rounded-[16px] overflow-hidden">
            <div className="mag-grain" aria-hidden="true" />
            <div className="relative space-y-2 pt-5 px-4">
              {[
                { n: "Extrato 2019–2023", ok: true },
                { n: "Contrato social da ré", ok: false },
                { n: "Holerites", ok: true },
              ].map((d) => (
                <div key={d.n} className="flex items-center gap-2 rounded-2xl bg-mg-ink/45 px-3 py-2">
                  <span className={`w-2 h-2 rounded-full ${d.ok ? "bg-white" : "bg-mg-ink"}`} />
                  <span className="font-ui text-xs text-white truncate">{d.n}</span>
                </div>
              ))}
            </div>
            <TilePill label="Consentimento" />
          </li>
          <li className="mag-field mag-field-rosa relative isolate min-h-[13.5rem] rounded-[16px] overflow-hidden">
            <div className="mag-grain" aria-hidden="true" />
            <div className="relative pt-6 px-6">
              <div className="rounded-[16px] border border-white/20 bg-mg-ink/50 p-4">
                <p className="font-ui text-[10px] uppercase tracking-wide text-white">arquivo</p>
                <p className="font-ui text-sm font-semibold text-white mt-2">laudo-haveres-v2.pdf</p>
                <p className="font-ui text-xs text-white mt-2">CRC 1SP-314567 · v.2</p>
              </div>
            </div>
            <TilePill label="Laudo" />
          </li>
          <li className="mag-field mag-field-ink relative isolate min-h-[16rem] sm:col-span-2 rounded-[16px] overflow-hidden">
            <div className="mag-grain" aria-hidden="true" />
            <div className="relative space-y-2 pt-5 px-4 sm:px-6">
              {["08h17 · Abertura do processo", "09h41 · Consentimento LGPD", "14h08 · Laudo v.1"].map((n) => (
                <div key={n} className="flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2">
                  <span className="w-2 h-2 rounded-full bg-mg-magenta" />
                  <span className="font-ui text-xs text-white truncate">{n}</span>
                </div>
              ))}
            </div>
            <TilePill label="Timeline" />
          </li>
        </ul>
      </div>
    </section>
  );
}
