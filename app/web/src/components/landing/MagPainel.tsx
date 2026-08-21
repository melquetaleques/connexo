import { useEffect, useRef, useState, type ReactNode } from "react";
import { GlyphCatalogo, GlyphConsentimento, GlyphLaudo, GlyphProcesso } from "@/components/ui/connexo-icons";

const ASIDE_ITEMS = [
  { label: "Catálogo", Icon: GlyphCatalogo, photo: "/landing/tile-advocacia.jpg" },
  { label: "Consentimento", Icon: GlyphConsentimento, photo: "/landing/tile-consentimento.jpg" },
  { label: "Timeline", Icon: GlyphProcesso, photo: "/landing/painel-retrato.jpg" },
  { label: "Laudo", Icon: GlyphLaudo, photo: "/landing/tile-laudo.jpg" },
];

type MagPainelProps = {
  children: ReactNode;
  activeIndex?: number;
};

export function MagPainel({ children, activeIndex = 0 }: MagPainelProps) {
  const [reduce, setReduce] = useState(false);
  const [photo, setPhoto] = useState(ASIDE_ITEMS[activeIndex].photo);
  const [photoOpaque, setPhotoOpaque] = useState(true);
  const firstPhoto = useRef(true);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (firstPhoto.current) {
      firstPhoto.current = false;
      return undefined;
    }
    setPhotoOpaque(false);
    const t = window.setTimeout(() => {
      setPhoto(ASIDE_ITEMS[activeIndex].photo);
      setPhotoOpaque(true);
    }, 220);
    return () => window.clearTimeout(t);
  }, [activeIndex]);

  return (
    <div
      data-testid="mag-painel"
      className="relative isolate overflow-hidden rounded-[16px] grid lg:grid-cols-[34%_1fr] min-h-[28rem] bg-[#1A1412] text-white"
    >
      <div className="relative flex flex-col">
        <div className="flex items-center gap-2 px-4 min-h-12 border-b border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-deny" aria-hidden="true" />
          <span className="w-2.5 h-2.5 rounded-full bg-mg-warm" aria-hidden="true" />
          <span className="w-2.5 h-2.5 rounded-full bg-ledger" aria-hidden="true" />
          <p className="ml-3 font-ui text-xs text-white truncate">connexo.app · expediente</p>
        </div>
        <aside className="flex-1 flex flex-col gap-4 p-4 sm:p-5 font-ui text-sm">
          <p className="font-semibold text-white/50 uppercase tracking-[0.08em] text-[0.65rem]">Processo</p>
          {ASIDE_ITEMS.map(({ label, Icon }, i) => {
            const active = i === activeIndex;
            return (
              <div key={label} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className="shrink-0 transition-colors duration-300"
                    style={{ color: active ? "#ffffff" : "rgb(255 255 255 / 0.4)" }}
                  >
                    <Icon />
                  </span>
                  <p
                    className="transition-colors duration-300"
                    style={{ color: active ? "#ffffff" : "rgb(255 255 255 / 0.45)", fontWeight: active ? 600 : 400 }}
                  >
                    {label}
                  </p>
                </div>
                <span className="h-px w-full bg-white/10 overflow-hidden ml-[26px]">
                  <span
                    key={active ? `on-${label}` : `off-${label}`}
                    className="block h-full bg-mg-magenta"
                    style={
                      active
                        ? reduce
                          ? { width: "100%" }
                          : { animation: "mag-item-fill 4.5s linear forwards" }
                        : { width: 0 }
                    }
                  />
                </span>
              </div>
            );
          })}
        </aside>
      </div>
      <div className="relative min-h-[16rem] lg:min-h-full overflow-hidden">
        <div className="mag-photo-frame" aria-hidden="true">
          <div
            className="mag-photo mag-ken-burns"
            style={{
              backgroundImage: `url(${photo})`,
              opacity: photoOpaque ? 1 : 0,
              transition: reduce ? "none" : "opacity 300ms ease",
            }}
          />
          <div className="mag-photo-veil mag-photo-veil-ink" />
          <div className="mag-grain" />
        </div>
        <div className="absolute right-3 bottom-3 sm:right-5 sm:bottom-5 w-[min(300px,78%)] sm:w-[340px] z-10">
          <div className="landing-glass-ink backdrop-blur-xl rounded-[16px] overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <div className="origin-top-left scale-[0.56] w-[179%] pointer-events-none">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
