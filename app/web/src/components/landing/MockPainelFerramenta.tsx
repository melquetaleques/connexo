import { GlyphLaudo, IconChip } from "@/components/ui/connexo-icons";
import { CtrlBotaoPrimario } from "./controls/CtrlBotaoPrimario";
import { CtrlSelect } from "./controls/CtrlSelect";
import { CtrlSlider } from "./controls/CtrlSlider";
import { CtrlToggle } from "./controls/CtrlToggle";

export function MockPainelFerramenta() {
  return (
    <div
      data-testid="mock-ferramenta"
      className="landing-glass-light backdrop-blur-xl rounded-[16px] p-3 text-mg-ink"
    >
      <div className="flex items-center gap-3 mb-3">
        <IconChip tint="sky">
          <GlyphLaudo />
        </IconChip>
        <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.18em] text-mg-ink">
          Ferramenta do laudo
        </p>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {["LAUDO", "PRAZO", "CRC", "RITO"].map((tag) => (
          <span
            key={tag}
            className="font-ui text-[10px] font-semibold tracking-[0.1em] text-mg-ink"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="space-y-4">
        <CtrlSelect
          label="Versão do arquivo"
          value="laudo v.2 revisado"
          options={["laudo v.1", "laudo v.2 revisado"]}
          tone="light"
        />
        <CtrlSlider label="Prazo restante" value={58} tone="light" />
        <CtrlSlider label="Escopo da perícia" value={72} tone="light" />
        <CtrlToggle label="CRC visível" on tone="light" />
        <CtrlBotaoPrimario>Assinar e protocolar</CtrlBotaoPrimario>
      </div>
    </div>
  );
}
