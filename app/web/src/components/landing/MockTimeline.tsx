import { CtrlSlider } from "./controls/CtrlSlider";
import { MockRow, MockShell, StatusPill } from "./MockShell";

const ETAPAS = [
  { hora: "08h17", titulo: "Abertura do processo", resp: "Dra. Camila Ribeiro · OAB/SP 412.890", estado: "Feito", tone: "ok" as const },
  { hora: "08h41", titulo: "Escopo da perícia descrito", resp: "Apuração de haveres · vara 38ª do trabalho", estado: "Feito", tone: "ok" as const },
  { hora: "09h12", titulo: "Cliente convidado ao expediente", resp: "João Batista Mello", estado: "Feito", tone: "ok" as const },
  { hora: "09h41", titulo: "Consentimento LGPD iniciado", resp: "5 de 7 documentos autorizados", estado: "Parcial", tone: "gold" as const },
  { hora: "11h05", titulo: "Perito vinculado", resp: "Helena Vasconcelos · CRC 1SP-314567", estado: "Feito", tone: "ok" as const },
  { hora: "14h08", titulo: "Laudo v.1 protocolado", resp: "Arquivo laudo-haveres-v1.pdf", estado: "Entregue", tone: "gold" as const },
  { hora: "16h20", titulo: "Pedido de ajuste na cláusula 4.2", resp: "Dra. Camila Ribeiro", estado: "Aberto", tone: "warn" as const },
];

export function MockTimeline() {
  return (
    <MockShell
      testId="mock-timeline"
      label="Timeline do processo"
      meta="0008821-14.2024.5.02.0038"
      dotClass="bg-mg-indigo"
    >
      <div className="flex items-center justify-between gap-3 min-h-12 px-4 border-b border-outline bg-mg-ivory">
        <p className="font-ui text-xs text-on-surface-variant">Etapas · datas · responsável</p>
        <StatusPill tone="gold">em andamento</StatusPill>
      </div>
      <div className="px-4 py-3 border-b border-outline bg-mg-ivory">
        <CtrlSlider label="Andamento do rito" value={64} tone="light" />
      </div>
      {ETAPAS.map((e, i) => (
        <MockRow key={e.hora + e.titulo} alt={i % 2 === 1}>
          <span className="font-ui text-xs font-bold text-mg-indigo w-12 shrink-0">{e.hora}</span>
          <div className="min-w-0 flex-1">
            <p className="font-ui text-sm font-bold text-mg-ink truncate">{e.titulo}</p>
            <p className="font-ui text-xs text-on-surface-variant truncate">{e.resp}</p>
          </div>
          <StatusPill tone={e.tone}>{e.estado}</StatusPill>
        </MockRow>
      ))}
    </MockShell>
  );
}
