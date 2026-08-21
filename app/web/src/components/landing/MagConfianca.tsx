const ESCRITORIOS = [
  "Machado",
  "Pereira & Costa",
  "Duarte",
  "Ribeiro Perícias",
  "Vale Norte",
  "Aurora",
];

export function MagConfianca() {
  return (
    <div
      data-testid="mag-hero-confianca"
      style={{ position: "relative", padding: "0 40px 34px", textAlign: "center" }}
    >
      <div
        style={{
          font: '500 15px / 1 "Hanken Grotesk", sans-serif',
          color: "rgba(255, 255, 255, 0.72)",
          marginBottom: 22,
        }}
      >
        Usado por 47 escritórios de advocacia e contabilidade
      </div>
      <ul
        data-testid="mag-confianca"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 52,
          flexWrap: "wrap",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {ESCRITORIOS.map((nome) => (
          <li
            key={nome}
            style={{
              font: "700 19px / 1 Figtree, sans-serif",
              color: "rgba(255, 255, 255, 0.4)",
            }}
          >
            {nome}
          </li>
        ))}
      </ul>
    </div>
  );
}
