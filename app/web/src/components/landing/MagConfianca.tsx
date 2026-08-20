const SELOS = [
  { mono: "CRC", title: "CRC verificado" },
  { mono: "LGPD", title: "Consentimento LGPD" },
  { mono: "OAB", title: "Ética OAB" },
  { mono: "LAUDO", title: "Laudo versionado" },
];

export function MagConfianca() {
  const copies = [0, 1] as const;
  return (
    <div data-testid="mag-hero-confianca" className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-2">
      <p className="font-ui text-sm font-semibold text-white mb-4 drop-shadow">
        CRC, LGPD, OAB e laudo versionado no mesmo expediente.
      </p>
      <div className="mag-marquee">
        <ul data-testid="mag-confianca" className="mag-marquee-track">
          {copies.flatMap((copy) =>
            SELOS.map((item) => (
              <li
                key={`${copy}-${item.mono}`}
                className={`landing-pill landing-glass-soft backdrop-blur-xl px-4 min-h-9 inline-flex items-center shrink-0 ${
                  copy === 1 ? "mag-marquee-clone" : ""
                }`}
                aria-hidden={copy === 1 ? true : undefined}
              >
                <span className="font-ui text-xs font-semibold tracking-[0.16em] text-white">{item.mono}</span>
                {copy === 0 ? <span className="sr-only">{item.title}</span> : null}
              </li>
            )),
          )}
        </ul>
      </div>
    </div>
  );
}
