import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { CtrlBotaoPrimario } from "./controls/CtrlBotaoPrimario";
import { MockRow, MockShell, StatusPill } from "./MockShell";

const CAMPOS = [
  { rotulo: "Processo", valor: "0008821-14.2024.5.02.0038" },
  { rotulo: "Perito", valor: "Helena Vasconcelos · CRC 1SP-314567" },
  { rotulo: "Versão", valor: "v.2 — revisado em 16h48" },
  { rotulo: "Arquivo", valor: "laudo-haveres-v2.pdf · 1,4 MB" },
  { rotulo: "Pedido de ajuste", valor: "Detalhar índice de correção na cláusula 4.2" },
  { rotulo: "Prazo de revisão", valor: "48h úteis · Dra. Camila Ribeiro" },
];

function LaudoComparador() {
  const [split, setSplit] = useState(54);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setSplit(pct);
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (!dragging.current) return;
    setFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSplit((n) => Math.max(0, n - 4));
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setSplit((n) => Math.min(100, n + 4));
    }
  };

  return (
    <div
      ref={trackRef}
      className="relative h-36 overflow-hidden rounded-[16px] border border-outline mx-3 my-3"
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        setFromClientX(e.clientX);
      }}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="absolute inset-0 bg-mg-ivory p-4">
        <p className="font-ui text-[10px] uppercase tracking-wide font-medium text-mg-ink">laudo v.1</p>
        <p className="font-ui text-sm font-bold text-mg-ink mt-2">Cláusula 4.2 — índice omitido</p>
        <p className="font-ui text-xs font-medium text-mg-ink mt-2">Protocolado às 14h08 · 1,1 MB</p>
      </div>
      <div
        className="absolute inset-0 bg-white p-4"
        style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
      >
        <p className="font-ui text-[10px] uppercase tracking-wide font-medium text-mg-ink">laudo v.2 revisado</p>
        <p className="font-ui text-sm font-bold text-mg-ink mt-2">Cláusula 4.2 — INPC desde a citação</p>
        <p className="font-ui text-xs font-medium text-mg-ink mt-2">Ajuste às 16h48 · 1,4 MB</p>
      </div>
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div
          className="absolute top-0 bottom-0 left-0 w-full"
          style={{ transform: `translateX(${split}%)` }}
        >
          <span className="absolute left-0 top-0 bottom-0 w-px bg-mg-indigo" />
          <button
            type="button"
            aria-label="Comparar versões do laudo"
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(split)}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
            className="pointer-events-auto absolute left-0 top-1/2 w-9 h-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mg-indigo text-white font-ui text-xs font-bold flex items-center justify-center"
          >
            ‹ ›
          </button>
        </div>
      </div>
    </div>
  );
}

export function MockLaudo() {
  return (
    <MockShell testId="mock-laudo" label="Entrega do laudo" meta="v.2" dotClass="bg-ledger">
      <div className="flex items-center justify-between gap-3 min-h-12 px-4 border-b border-outline bg-mg-ivory">
        <p className="font-ui text-xs font-medium text-mg-ink">Status · versão · pedido de ajuste</p>
        <div className="flex gap-2">
          <StatusPill tone="gold">aguardando revisão</StatusPill>
          <StatusPill tone="ok">assinado</StatusPill>
        </div>
      </div>
      <LaudoComparador />
      {CAMPOS.map((c, i) => (
        <MockRow key={c.rotulo} alt={i % 2 === 1}>
          <div className="min-w-0 flex-1">
            <p className="font-ui text-xs font-medium text-mg-ink">{c.rotulo}</p>
            <p className="font-ui text-sm font-bold text-mg-ink">{c.valor}</p>
          </div>
        </MockRow>
      ))}
      <div className="p-3">
        <CtrlBotaoPrimario>Pedir ajuste</CtrlBotaoPrimario>
      </div>
    </MockShell>
  );
}
