import { CtrlSelect } from "./controls/CtrlSelect";
import { MockRow, MockShell, StatusPill } from "./MockShell";

const PERITOS = [
  {
    nome: "Helena Vasconcelos",
    crc: "CRC 1SP-314567",
    spec: "Perícia trabalhista",
    cidade: "São Paulo/SP",
    disp: "Disponível",
    tone: "ok" as const,
    nota: "4.9",
  },
  {
    nome: "Rafael Monteiro",
    crc: "CRC 1RJ-228901",
    spec: "Apuração de haveres",
    cidade: "Rio de Janeiro/RJ",
    disp: "Parcial",
    tone: "gold" as const,
    nota: "4.7",
  },
  {
    nome: "Lúcia Andrade",
    crc: "CRC 1MG-187442",
    spec: "Perícia tributária",
    cidade: "Belo Horizonte/MG",
    disp: "Disponível",
    tone: "ok" as const,
    nota: "4.8",
  },
  {
    nome: "Paulo Henrique Dias",
    crc: "CRC 1RS-256118",
    spec: "Liquidação de sentença",
    cidade: "Porto Alegre/RS",
    disp: "Na fila",
    tone: "warn" as const,
    nota: "4.6",
  },
  {
    nome: "Marina Costa e Silva",
    crc: "CRC 1PR-193774",
    spec: "Recuperação judicial",
    cidade: "Curitiba/PR",
    disp: "Disponível",
    tone: "ok" as const,
    nota: "5.0",
  },
  {
    nome: "Eduardo Pires",
    crc: "CRC 1BA-201336",
    spec: "Perícia previdenciária",
    cidade: "Salvador/BA",
    disp: "Indisponível",
    tone: "deny" as const,
    nota: "4.5",
  },
];

export function MockCatalogo() {
  return (
    <MockShell testId="mock-catalogo" label="Catálogo de peritos" meta="hoje" dotClass="bg-ledger">
      <div className="px-3 py-3 border-b border-outline bg-mg-ivory">
        <CtrlSelect
          label="Especialidade"
          value="Perícia trabalhista"
          options={["Perícia trabalhista", "Apuração de haveres", "Perícia tributária"]}
          tone="light"
        />
      </div>
      <div className="grid grid-cols-3 min-h-12 border-b border-outline bg-mg-ivory">
        <div className="min-w-0 px-3 py-3 border-r border-outline">
          <p className="font-ui text-xs text-on-surface-variant">CRC</p>
          <p className="font-ui text-sm font-bold text-mg-ink">38 peritos</p>
        </div>
        <div className="min-w-0 px-3 py-3 border-r border-outline">
          <p className="font-ui text-xs text-on-surface-variant">Livres</p>
          <p className="font-ui text-sm font-bold text-mg-ink">12 janelas</p>
        </div>
        <div className="min-w-0 px-3 py-3">
          <p className="font-ui text-xs text-on-surface-variant">Nota</p>
          <p className="font-ui text-sm font-bold text-mg-ink">4.7</p>
        </div>
      </div>
      {PERITOS.map((p, i) => (
        <MockRow key={p.crc} alt={i % 2 === 1}>
          <span
            className="w-8 h-8 rounded-full bg-mg-indigo text-white font-ui text-xs font-bold flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            {p.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-ui text-sm font-bold text-mg-ink truncate">{p.nome}</p>
            <p className="font-ui text-xs text-on-surface-variant truncate">
              {p.crc} · {p.spec} · {p.cidade}
            </p>
          </div>
          <StatusPill tone={p.tone}>{p.disp}</StatusPill>
          <span className="font-ui text-xs font-bold text-mg-indigo shrink-0">{p.nota}</span>
        </MockRow>
      ))}
    </MockShell>
  );
}
