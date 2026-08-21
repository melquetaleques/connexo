const SELOS = [
  { mono: "CRC", title: "CRC verificado" },
  { mono: "LGPD", title: "Consentimento LGPD" },
  { mono: "OAB", title: "Ética OAB" },
  { mono: "LAUDO", title: "Laudo versionado" },
];

export function MagConfianca() {
  return (
    <div
      data-testid="mag-hero-confianca"
      className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-2 text-center"
    >
      <p className="font-ui text-sm font-medium text-white/70 mb-4">
        CRC, LGPD, OAB e laudo versionado no mesmo expediente.
      </p>
      <ul data-testid="mag-confianca" className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {SELOS.map((item) => (
          <li key={item.mono} className="inline-flex items-center">
            <span className="font-ui text-xs font-semibold tracking-[0.16em] text-white/60">
              {item.mono}
            </span>
            <span className="sr-only">{item.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
