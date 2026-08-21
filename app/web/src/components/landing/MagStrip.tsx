const ITEMS = [
  { icon: "account_balance", label: "PJe" },
  { icon: "public", label: "e-SAJ" },
  { icon: "balance", label: "Projudi" },
  { icon: "account_balance", label: "ICP-Brasil" },
  { icon: "public", label: "Gov.br" },
  { icon: "balance", label: "CFC" },
  { icon: "account_balance", label: "OAB" },
  { icon: "public", label: "Receita" },
];

export function MagStrip() {
  return (
    <section data-testid="mag-strip" style={{ padding: "120px 0 0", textAlign: "center" }}>
      <h2
        className="mag-title-vinho font-display text-mg-vinho"
        style={{
          margin: "0 0 14px",
          fontWeight: 800,
          fontSize: 40,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
        }}
      >
        Integrado a tudo que o rito exige
      </h2>
      <p
        style={{
          margin: "0 auto 52px",
          font: '400 17px / 1.55 "Hanken Grotesk", sans-serif',
          color: "rgb(92, 74, 78)",
          maxWidth: "56ch",
          padding: "0 40px",
        }}
      >
        Tribunais, conselhos e assinatura digital — para você nunca ter que escolher entre a norma e o fluxo de trabalho.
      </p>
      <ul
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gap: 2,
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
        className="max-lg:!grid-cols-4 max-sm:!grid-cols-2"
      >
        {ITEMS.map((item) => (
          <li
            key={item.label}
            style={{
              background: "rgb(255, 255, 255)",
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18, color: "rgb(59, 13, 22)" }}
              aria-hidden="true"
            >
              {item.icon}
            </span>
            <span style={{ font: '600 15px / 1 "Hanken Grotesk", sans-serif', color: "rgb(59, 13, 22)" }}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
