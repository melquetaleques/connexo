const SELOS = [
  { mono: "CRC", title: "CRC verificado" },
  { mono: "LGPD", title: "Consentimento LGPD" },
  { mono: "OAB", title: "Ética OAB" },
  { mono: "LAUDO", title: "Laudo versionado" },
];

export function MagConfianca() {
  return (
    <div data-testid="mag-hero-confianca" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-2">
      <p className="font-ui text-sm font-semibold text-white mb-4 drop-shadow">
        CRC, LGPD, OAB e laudo versionado no mesmo expediente.
      </p>
      <ul data-testid="mag-confianca" className="flex flex-wrap items-center gap-3 sm:gap-5">
        {SELOS.map((item) => (
          <li
            key={item.mono}
            className="landing-pill landing-glass-soft backdrop-blur-xl px-4 min-h-9 inline-flex items-center"
          >
            <span className="font-ui text-xs font-semibold tracking-[0.16em] text-white">{item.mono}</span>
            <span className="sr-only">{item.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
