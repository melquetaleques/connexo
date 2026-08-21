function TilePill({ label }: { label: string }) {
  return (
    <span className="absolute bottom-4 left-4 landing-pill landing-glass-ink backdrop-blur-xl text-white font-ui text-xs font-semibold px-3 min-h-8 inline-flex items-center">
      {label}
    </span>
  );
}

const TILES = [
  {
    src: "/landing/tile-advocacia.jpg",
    field: "mag-field-vinho",
    veil: "mag-photo-veil-vinho",
    label: "Catálogo",
    lines: ["Helena Vasconcelos", "Rafael Monteiro"],
  },
  {
    src: "/landing/tile-consentimento.jpg",
    field: "mag-field-teal",
    veil: "mag-photo-veil-teal",
    label: "Consentimento",
    lines: ["Extrato 2019–2023", "Contrato social da ré"],
  },
  {
    src: "/landing/tile-laudo.jpg",
    field: "mag-field-rosa",
    veil: "mag-photo-veil-vinho",
    label: "Laudo",
    lines: ["laudo-haveres-v2.pdf", "CRC 1SP-314567"],
  },
] as const;

const BIG_TILE = {
  src: "/landing/tile-vitrine.jpg",
  field: "mag-field-ink",
  veil: "mag-photo-veil-ink",
  label: "Timeline",
  lines: ["08h17 · Abertura do processo", "09h41 · Consentimento LGPD", "14h08 · Laudo v.1"],
};

function Tile({
  tile,
  className,
}: {
  tile: (typeof TILES)[number] | typeof BIG_TILE;
  className: string;
}) {
  return (
    <li
      className={`mag-field ${tile.field} mag-photo-hover-card relative isolate ${className} rounded-[16px] overflow-hidden`}
    >
      <div className="mag-photo-frame" aria-hidden="true">
        <div className="mag-photo mag-photo-hover" style={{ backgroundImage: `url(${tile.src})` }} />
        <div className={`mag-photo-veil ${tile.veil}`} />
        <div className="mag-grain" />
      </div>
      <div className="relative flex flex-wrap gap-2 pt-5 px-4 sm:px-6">
        {tile.lines.map((n) => (
          <div key={n} className="flex items-center gap-2 rounded-2xl bg-mg-ink/80 px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-mg-magenta shrink-0" />
            <span className="font-ui text-xs text-white truncate">{n}</span>
          </div>
        ))}
      </div>
      <TilePill label={tile.label} />
    </li>
  );
}

export function MagShowcase() {
  return (
    <section data-testid="mag-showcase" className="mag-field mag-field-ivory relative overflow-hidden text-mg-ink py-20">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <h2 className="mag-title-vinho font-display font-semibold tracking-tight text-[2.75rem] mb-8 text-mg-vinho">
          O produto, em tela
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {TILES.map((tile) => (
            <Tile key={tile.label} tile={tile} className="min-h-[19rem]" />
          ))}
        </ul>
        <ul className="grid grid-cols-1">
          <Tile tile={BIG_TILE} className="min-h-[14rem]" />
        </ul>
      </div>
    </section>
  );
}
