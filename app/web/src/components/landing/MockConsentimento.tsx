import { CtrlToggle } from "./controls/CtrlToggle";
import { MockRow, MockShell, StatusPill } from "./MockShell";

const DOCS = [
  { nome: "Extrato bancário 2019–2023", dono: "João Batista Mello", estado: "Concedido", tone: "ok" as const },
  { nome: "Imposto de renda PF 2022", dono: "João Batista Mello", estado: "Concedido", tone: "ok" as const },
  { nome: "Folha de pagamento 2020–2024", dono: "Réu — Construtora Vale Norte", estado: "Concedido", tone: "ok" as const },
  { nome: "Contrato social da ré", dono: "Junta Comercial/SP", estado: "Negado", tone: "deny" as const },
  { nome: "Balancetes 2021–2023", dono: "Réu — Construtora Vale Norte", estado: "Concedido", tone: "ok" as const },
  { nome: "Notas fiscais de serviços", dono: "João Batista Mello", estado: "Pendente", tone: "gold" as const },
  { nome: "Holerites do reclamante", dono: "João Batista Mello", estado: "Concedido", tone: "ok" as const },
];

export function MockConsentimento() {
  return (
    <MockShell
      testId="mock-consentimento"
      label="Consentimento LGPD"
      meta="0001234-56.2024.8.26.0100"
      dotClass="bg-mg-indigo"
    >
      <div className="flex items-center justify-between gap-3 min-h-12 px-4 border-b border-outline bg-mg-ivory">
        <p className="font-ui text-xs text-on-surface-variant">Documento a documento · cliente no meio</p>
        <div className="flex items-center gap-3 min-w-0">
          <StatusPill tone="ok">5 concedidos</StatusPill>
          <StatusPill tone="deny">1 negado</StatusPill>
          <div className="w-[9.5rem] shrink-0">
            <CtrlToggle label="Só concedidos" on tone="light" />
          </div>
        </div>
      </div>
      {DOCS.map((d, i) => (
        <MockRow key={d.nome} alt={i % 2 === 1}>
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              d.tone === "ok" ? "bg-ledger" : d.tone === "deny" ? "bg-deny" : "bg-mg-indigo"
            }`}
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="font-ui text-sm font-bold text-mg-ink truncate">{d.nome}</p>
            <p className="font-ui text-xs text-on-surface-variant truncate">{d.dono}</p>
          </div>
          <StatusPill tone={d.tone}>{d.estado}</StatusPill>
        </MockRow>
      ))}
    </MockShell>
  );
}
