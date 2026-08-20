const ITEMS = [
  "CRC no catálogo",
  "Consentimento por arquivo",
  "Laudo versionado",
  "Honorários separados",
  "Vitrine pública",
];

export function MagStrip() {
  return (
    <section data-testid="mag-strip" className="bg-mg-ivory text-mg-ink">
      <ul className="landing-sweep max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-2 sm:grid-cols-5">
        {ITEMS.map((item, i) => (
          <li
            key={item}
            className={`flex items-center justify-center text-center min-h-16 px-3 py-4 font-ui text-xs sm:text-sm font-semibold tracking-tight ${
              i < ITEMS.length - 1 ? "border-r border-mg-ink/15" : ""
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
