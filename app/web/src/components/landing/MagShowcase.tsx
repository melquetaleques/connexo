const TILES = [
  {
    label: "Catálogo",
    tone: "from-mg-indigo to-mg-blue",
    body: (
      <div className="space-y-2 pt-4 px-4">
        {["Helena Vasconcelos", "Rafael Monteiro", "Lúcia Andrade"].map((n) => (
          <div key={n} className="flex items-center gap-2 rounded-2xl bg-mg-ink/50 px-3 py-2">
            <span className="w-7 h-7 rounded-full bg-mg-indigo text-white font-ui text-[10px] font-bold flex items-center justify-center">
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
    ),
  },
  {
    label: "Consentimento",
    tone: "from-mg-magenta to-mg-warm",
    body: (
      <div className="space-y-2 pt-4 px-4">
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
    ),
  },
  {
    label: "Laudo",
    tone: "from-mg-ink to-mg-indigo",
    body: (
      <div className="pt-6 px-6">
        <div className="rounded-[16px] border border-white/20 bg-mg-ink/50 p-4">
          <p className="font-ui text-[10px] uppercase tracking-wide text-white">arquivo</p>
          <p className="font-ui text-sm font-semibold text-white mt-2">laudo-haveres-v2.pdf</p>
          <p className="font-ui text-xs text-white mt-2">CRC 1SP-314567 · v.2</p>
        </div>
      </div>
    ),
  },
];

export function MagShowcase() {
  return (
    <section data-testid="mag-showcase" className="bg-mg-ivory text-mg-ink py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <h2 className="font-display font-semibold tracking-tight text-[2rem] mb-8">
          O produto, em tela
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TILES.map((tile) => (
            <li
              key={tile.label}
              className={`relative h-72 rounded-[16px] overflow-hidden bg-gradient-to-br ${tile.tone}`}
            >
              {tile.body}
              <span className="absolute bottom-4 left-4 landing-pill landing-glass-ink backdrop-blur-xl text-white font-ui text-xs font-semibold px-3 min-h-8 inline-flex items-center">
                {tile.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
