import type { ReactNode } from "react";

type CtrlBotaoPrimarioProps = {
  children: ReactNode;
};

export function CtrlBotaoPrimario({ children }: CtrlBotaoPrimarioProps) {
  return (
    <button
      type="button"
      data-ctrl="cta"
      className="w-full min-h-11 rounded-[16px] bg-mg-indigo text-white font-ui text-sm font-semibold tracking-tight px-5"
    >
      {children}
    </button>
  );
}
