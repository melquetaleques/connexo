import { useEffect, useRef, useState } from "react";
import { MockCatalogo } from "@/components/landing/MockCatalogo";
import { MockConsentimento } from "@/components/landing/MockConsentimento";
import { MockTimeline } from "@/components/landing/MockTimeline";
import { MockLaudo } from "@/components/landing/MockLaudo";
import { MockVitrine } from "@/components/landing/MockVitrine";
import { MagNav } from "@/components/landing/MagNav";
import { MagHero } from "@/components/landing/MagHero";
import { MagHeroLista } from "@/components/landing/MagHeroLista";
import { MagConfianca } from "@/components/landing/MagConfianca";
import { MagStrip } from "@/components/landing/MagStrip";
import { MagTabs } from "@/components/landing/MagTabs";
import { MagPainel } from "@/components/landing/MagPainel";
import { MagFerramentas } from "@/components/landing/MagFerramentas";
import { MagShowcase } from "@/components/landing/MagShowcase";
import { MagPlanos } from "@/components/landing/MagPlanos";
import { MagFaq } from "@/components/landing/MagFaq";
import { MagFecho } from "@/components/landing/MagFecho";
import { MagRodape } from "@/components/landing/MagRodape";

function useLandingReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll(".landing-reveal, .landing-sweep");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      nodes.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    nodes.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useHeroParallax() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>("[data-hero-parallax]");
    if (!el) return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (media.matches) {
        el.style.transform = "none";
        return;
      }
      const dy = Math.max(-10, Math.min(10, -(window.scrollY * 8) / 300));
      el.style.transform = `translate3d(0, ${dy}px, 0)`;
    };
    apply();
    if (media.matches) return undefined;
    window.addEventListener("scroll", apply, { passive: true });
    media.addEventListener("change", apply);
    return () => {
      window.removeEventListener("scroll", apply);
      media.removeEventListener("change", apply);
    };
  }, []);
}

function HeroSection() {
  return (
    <section
      data-testid="landing-hero"
      className="relative overflow-hidden text-white flex flex-col"
      style={{
        background: "rgb(78, 24, 38)",
        minHeight: 760,
      }}
    >
      <div
        data-hero-parallax
        className="landing-hero-parallax mag-photo-frame"
        aria-hidden="true"
      >
        <img
          src="/landing/hero-campo.jpg"
          alt=""
          className="mag-photo-img mag-ken-burns"
        />
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(rgba(48, 12, 22, 0.62), rgba(48, 12, 22, 0.32) 42%, rgba(38, 9, 17, 0.9)), radial-gradient(70% 60% at 14% 30%, rgba(52, 10, 22, 0.72), transparent 68%)",
        }}
      />
      <div className="mag-field mag-veil landing-field-hero" aria-hidden="true">
        <div className="mag-grain" aria-hidden="true" />
      </div>
      <MagNav />
      <div
        className="relative flex-1"
        style={{ padding: "0 40px", display: "flex", alignItems: "center" }}
      >
        <div
          className="grid lg:grid-cols-2 items-center w-full"
          style={{
            maxWidth: 1600,
            margin: "0 auto",
            gap: 40,
            padding: "70px 0 40px",
          }}
        >
          <MagHero />
          <MagHeroLista />
        </div>
      </div>
      <div className="relative">
        <MagConfianca />
      </div>
    </section>
  );
}

function ProductSection() {
  const [tab, setTab] = useState(4);
  const [shown, setShown] = useState(0);
  const [opaque, setOpaque] = useState(true);
  const [paused, setPaused] = useState(false);
  const firstTab = useRef(true);

  useEffect(() => {
    if (firstTab.current) {
      firstTab.current = false;
      setShown(tab);
      setOpaque(true);
      return undefined;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(tab);
      setOpaque(true);
      return undefined;
    }
    setOpaque(false);
    const t = window.setTimeout(() => {
      setShown(tab);
      setOpaque(true);
    }, 150);
    return () => window.clearTimeout(t);
  }, [tab]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused) return undefined;
    const id = window.setTimeout(() => {
      setTab((t) => (t + 1) % 5);
    }, 4500);
    return () => window.clearTimeout(id);
  }, [tab, paused]);

  return (
    <section id="produto" className="relative overflow-hidden bg-mg-ivory text-mg-ink" style={{ padding: "120px 40px 0" }}>
      <div className="relative" style={{ maxWidth: 1220, margin: "0 auto" }}>
        <div className="text-center">
          <h2 className="mag-title-vinho font-display font-bold text-[2.75rem] leading-[1.05] tracking-tight mb-4 text-mg-vinho">
            Um só lugar para todo o rito
          </h2>
          <p className="font-ui text-base text-mg-ink mb-6">
            Escolha o ponto de partida. Cada papel, cada prazo, cada documento.
          </p>
        </div>
        <div className="flex justify-center">
          <MagTabs tab={tab} onTab={setTab} />
        </div>
        <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <MagPainel activeIndex={tab}>
            <div
              style={{
                opacity: opaque ? 1 : 0,
                transition: "opacity 180ms ease",
              }}
            >
              {shown === 0 ? <MockCatalogo /> : null}
              {shown === 1 ? <MockTimeline /> : null}
              {shown === 2 ? <MockLaudo /> : null}
              {shown === 3 ? <MockVitrine /> : null}
              {shown === 4 ? <MockConsentimento /> : null}
            </div>
          </MagPainel>
        </div>
      </div>
    </section>
  );
}

export function LandingPage() {
  useLandingReveal();
  useHeroParallax();
  return (
    <div className="landing-root font-ui min-h-screen overflow-x-hidden text-mg-ink">
      <HeroSection />
      <ProductSection />
      <MagStrip />
      <MagFerramentas />
      <MagShowcase />
      <MagPlanos />
      <section id="landing-faq" data-testid="landing-faq">
        <MagFaq />
      </section>
      <MagFecho />
      <MagRodape />
    </div>
  );
}
