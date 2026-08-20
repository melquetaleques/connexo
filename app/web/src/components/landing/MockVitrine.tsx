import { CtrlToggle } from "./controls/CtrlToggle";
import { MockRow, MockShell, StatusPill } from "./MockShell";

const LINHAS = [
  { rotulo: "Registro", valor: "CRC 1SP-314567 · São Paulo/SP" },
  { rotulo: "Serviços", valor: "Trabalhista · liquidação · apuração de haveres" },
  { rotulo: "Avaliações", valor: "4.9 · 38 pareceres publicados" },
  { rotulo: "Disponibilidade", valor: "Aceita novos processos · janela 22 ago" },
  { rotulo: "Honorários", valor: "Negociados por processo · separados da OAB" },
  { rotulo: "Slug público", valor: "/helena-vasconcelos" },
];

export function MockVitrine() {
  return (
    <MockShell testId="mock-vitrine" label="Vitrine pública" meta="Helena Vasconcelos" dotClass="bg-mg-magenta">
      <div className="flex items-center gap-3 min-h-12 px-4 border-b border-outline bg-mg-ivory">
        <span
          className="w-8 h-8 rounded-full bg-mg-indigo text-white font-ui text-xs font-bold flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          HV
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-ui text-sm font-bold text-mg-ink">Helena Vasconcelos</p>
          <p className="font-ui text-xs text-on-surface-variant">Contadora perita judicial</p>
        </div>
        <StatusPill tone="ok">disponível</StatusPill>
        <StatusPill tone="gold">CRC verificado</StatusPill>
        <div className="w-[8.5rem] shrink-0">
          <CtrlToggle label="Aceita fila" on tone="light" />
        </div>
      </div>
      {LINHAS.map((l, i) => (
        <MockRow key={l.rotulo} alt={i % 2 === 1}>
          <div className="min-w-0 flex-1">
            <p className="font-ui text-xs text-on-surface-variant">{l.rotulo}</p>
            <p className="font-ui text-sm font-bold text-mg-ink">{l.valor}</p>
          </div>
        </MockRow>
      ))}
    </MockShell>
  );
}
