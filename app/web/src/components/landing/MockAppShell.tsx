import { Icon } from "@/components/ui/connexo-primitives";
import { CtrlSelect } from "./controls/CtrlSelect";
import { CtrlToggle } from "./controls/CtrlToggle";

const NAV = [
  { icon: "dashboard", label: "Dashboard" },
  { icon: "group", label: "Clientes" },
  { icon: "balance", label: "Processos", active: true },
  { icon: "badge", label: "Equipe" },
  { icon: "settings", label: "Configurações" },
];

export function MockAppShell() {
  return (
    <div
      data-testid="mock-appshell"
      className="flex min-h-[420px] rounded-[16px] overflow-hidden bg-white text-mg-ink"
    >
      <aside className="w-[148px] sm:w-[200px] shrink-0 bg-mg-ink text-white flex flex-col">
        <div className="p-5 pb-6">
          <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-4">
            Expediente
          </p>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded bg-mg-indigo flex items-center justify-center shrink-0">
              <Icon name="balance" className="text-white text-base" />
            </span>
            <span className="font-ui font-black tracking-tighter uppercase text-sm">
              CONNEXO
            </span>
          </div>
          <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-mg-magenta">
            Painel do Advogado
          </p>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {NAV.map((item) => (
            <span
              key={item.label}
              className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold ${
                item.active
                  ? "bg-mg-indigo text-white"
                  : "text-white"
              }`}
            >
              <Icon name={item.icon} fill={Boolean(item.active)} className="text-xl shrink-0" />
              <span className="truncate">{item.label}</span>
            </span>
          ))}
        </nav>
        <div className="p-3 mt-auto">
          <div className="rounded-2xl p-3 flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/15">
            <span className="w-8 h-8 rounded-full bg-mg-indigo text-white font-ui text-xs font-bold flex items-center justify-center">
              CR
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate text-white">Camila Ribeiro</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-mg-magenta">
                Advogado
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col bg-mg-ivory rounded-[16px] m-2 overflow-hidden">
        <header className="h-14 shrink-0 bg-white/60 backdrop-blur-xl border border-white/40 px-4 flex items-center justify-between">
          <div>
            <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-mg-ink">
              Visão geral
            </p>
            <p className="font-ui text-xs font-extrabold text-mg-ink">Processo 0008821-14</p>
          </div>
          <span className="landing-pill landing-glass-light backdrop-blur-xl text-mg-ink font-ui text-[10px] font-semibold px-3 min-h-8 inline-flex items-center">
            Cliente no expediente
          </span>
        </header>
        <div className="p-3 sm:p-4 grid sm:grid-cols-2 gap-3">
          <article className="rounded-[16px] bg-white p-3">
            <p className="font-ui text-[10px] font-bold uppercase tracking-wide text-on-surface-variant mb-1">
              Cliente
            </p>
            <p className="font-ui text-sm font-bold text-mg-ink">João Batista Mello</p>
            <p className="font-ui text-xs text-on-surface-variant mt-1">5 de 7 documentos</p>
            <div className="mt-3">
              <CtrlToggle label="Acesso do cliente" on tone="light" />
            </div>
          </article>
          <article className="rounded-[16px] bg-white p-3">
            <p className="font-ui text-[10px] font-bold uppercase tracking-wide text-on-surface-variant mb-1">
              Contador
            </p>
            <p className="font-ui text-sm font-bold text-mg-ink">Helena Vasconcelos</p>
            <p className="font-ui text-xs text-on-surface-variant mt-1">CRC 1SP-314567</p>
            <div className="mt-3">
              <CtrlSelect
                label="Papel no rito"
                value="Perita titular"
                options={["Perita titular", "Assistente técnico"]}
                tone="light"
              />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
