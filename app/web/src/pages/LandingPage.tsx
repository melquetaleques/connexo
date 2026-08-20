import { useEffect, useRef, useState } from "react";
import {
  GlyphConsentimento,
  GlyphLaudo,
  GlyphPrazo,
  GlyphProcesso,
  GlyphVitrine,
  IconAutorizacao,
  IconLaudo,
  IconAcompanhamento,
  IconVitrine,
  IconPrazo,
  IconChip,
} from "@/components/ui/connexo-icons";
import { MockCatalogo } from "@/components/landing/MockCatalogo";
import { MockConsentimento } from "@/components/landing/MockConsentimento";
import { MockTimeline } from "@/components/landing/MockTimeline";
import { MockLaudo } from "@/components/landing/MockLaudo";
import { MockVitrine } from "@/components/landing/MockVitrine";
import { MockAppShell } from "@/components/landing/MockAppShell";
import { MockPainelFerramenta } from "@/components/landing/MockPainelFerramenta";
import { RitoChapter } from "@/components/landing/RitoChapter";
import { MagNav } from "@/components/landing/MagNav";
import { MagHero } from "@/components/landing/MagHero";
import { MagHeroLista } from "@/components/landing/MagHeroLista";
import { MagConfianca } from "@/components/landing/MagConfianca";
import { MagStrip } from "@/components/landing/MagStrip";
import { MagTabs } from "@/components/landing/MagTabs";
import { MagPainel } from "@/components/landing/MagPainel";
import { MagBento } from "@/components/landing/MagBento";
import { MagFerramentas } from "@/components/landing/MagFerramentas";
import { MagShowcase } from "@/components/landing/MagShowcase";
import { MagPlanos } from "@/components/landing/MagPlanos";
import { MagFaq } from "@/components/landing/MagFaq";
import { MagFecho } from "@/components/landing/MagFecho";
import { MagRodape } from "@/components/landing/MagRodape";
import { MagBotao } from "@/components/landing/MagBotao";
import { CtrlSlider } from "@/components/landing/controls/CtrlSlider";

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

function HeroSection() {
  return (
    <section data-testid="landing-hero" className="relative overflow-hidden bg-mg-ink text-white pt-28 pb-16 min-h-[88vh]">
      <div className="landing-field-hero pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <MagHero />
        <MagHeroLista />
      </div>
    </section>
  );
}

function ProductSection() {
  const [tab, setTab] = useState(0);
  const [shown, setShown] = useState(0);
  const [opaque, setOpaque] = useState(true);
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

  return (
    <section id="produto" className="bg-mg-ivory text-mg-ink py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-ui font-bold text-[2rem] tracking-tight mb-3">
            Um só expediente
          </h2>
          <p className="font-ui text-base text-on-surface-variant mb-6">
            Catálogo, consentimento e timeline no mesmo lugar — o rito visível para os três.
          </p>
        </div>
        <div className="flex justify-center">
          <MagTabs tab={tab} onTab={setTab} />
        </div>
        <MagPainel>
          <div
            style={{
              opacity: opaque ? 1 : 0,
              transition: "opacity 180ms ease",
            }}
          >
            {shown === 0 ? <MockCatalogo /> : null}
            {shown === 1 ? <MockConsentimento /> : null}
            {shown === 2 ? <MockTimeline /> : null}
          </div>
        </MagPainel>
      </div>
    </section>
  );
}

function ConexaoSection() {
  return (
    <section data-testid="mag-vitrine-grande" className="bg-mg-ink text-white py-20">
      <div
        data-testid="landing-conexao"
        className="max-w-6xl mx-auto px-5 sm:px-8"
      >
        <h2 className="font-ui font-bold text-[2rem] tracking-tight mb-3">
          O rito completo, no painel
        </h2>
        <p className="font-ui text-base text-white mb-8 max-w-2xl">
          Advogado pede o número. Cliente autoriza o dado. Contador assina o laudo.
          Os três no mesmo expediente, com a ferramenta aberta sobre o processo.
        </p>
        <div className="relative rounded-[16px] p-2 sm:p-3 bg-mg-ink">
          <MockAppShell />
          <div className="absolute right-4 sm:right-8 top-14 sm:top-20 w-[min(280px,74%)] sm:w-[300px] z-10">
            <MockPainelFerramenta />
          </div>
        </div>
      </div>
    </section>
  );
}

function RitoSection() {
  return (
    <section data-testid="landing-rito" className="relative bg-mg-ivory text-mg-ink py-16">
      <div
        className="landing-magenta-rail pointer-events-none absolute left-5 sm:left-8 top-28 bottom-16 w-px hidden sm:block"
        aria-hidden="true"
      />
      <div className="landing-stagger max-w-6xl mx-auto px-5 sm:px-8 space-y-20">
        <div>
          <h2 className="font-ui font-bold text-[2rem] tracking-tight mb-3">
            O expediente da perícia
          </h2>
          <p className="font-ui text-base text-on-surface-variant">
            A história não é um funil. É um rito com hora, papel e documento.
          </p>
        </div>

        <RitoChapter
          time="08h17"
          titleStart="O advogado abre o processo e"
          titleEnd="descreve o escopo da perícia."
          body="Número CNJ, vara e o que o laudo precisa responder. O cliente entra no expediente por convite, não por pasta compartilhada."
          chips={["Cadastro de processo", "Escopo da perícia", "Número CNJ"]}
        >
          <MockTimeline />
        </RitoChapter>

        <RitoChapter
          time="09h41"
          titleStart="O cliente autoriza os documentos,"
          titleEnd="um a um, com base na LGPD."
          body="Cada arquivo tem consentimento próprio. Sem o sim, o perito não lê. O dado deixa de ser um anexo solto no e-mail."
          chips={["Consentimento por documento", "Escolha do perito"]}
          reverse
        >
          <MockConsentimento />
        </RitoChapter>

        <RitoChapter
          time="14h08"
          titleStart="O contador recebe a fila e"
          titleEnd="assina o laudo no processo."
          body="CRC visível, versão numerada, arquivo no mesmo expediente. O honorário do perito não se mistura com o do escritório."
          chips={["Fila de processos", "Assinatura do laudo", "CRC verificado"]}
        >
          <MockLaudo />
        </RitoChapter>

        <RitoChapter
          time="16h52"
          titleStart="O advogado revisa a entrega e"
          titleEnd="pede ajuste, ou usa o número na tese."
          body="O pedido de ajuste fica no processo. A vitrine do perito continua pública para o próximo caso, com avaliação à vista."
          chips={["Pedido de ajuste", "Tese com número"]}
          reverse
        >
          <MockVitrine />
        </RitoChapter>
      </div>
    </section>
  );
}

function PersonasSection() {
  return (
    <section
      id="landing-personas"
      data-testid="landing-personas"
      className="scroll-mt-24"
    >
      <p className="font-ui text-base text-on-surface-variant mb-12">
        Cada um entra por uma porta. A perícia só fecha quando os três estão no
        mesmo expediente.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <article
          data-testid="persona-cliente"
          className="landing-reveal lg:col-span-7 bg-white text-ink p-8 sm:p-10 flex flex-col rounded-[16px]"
        >
          <p className="font-ui text-xs text-ledger mb-2">Quem autoriza o dado</p>
          <div className="flex items-center gap-3 mb-6">
            <IconChip tint="mint">
              <GlyphConsentimento />
            </IconChip>
            <IconAutorizacao className="hidden" />
            <h3 className="font-ui font-bold text-xl">Cliente</h3>
          </div>
          <p data-testid="persona-cliente-dor" className="text-base mb-4">
            Não sabe se a análise contábil do processo é confiável nem em que pé está.
          </p>
          <p data-testid="persona-cliente-beneficio" className="text-base mb-6">
            Confiabilidade na análise de um perito escolhido por você e transparência do fluxo do processo.
          </p>
          <ul
            data-testid="persona-cliente-funcionalidades"
            className="font-ui text-sm space-y-2 mb-6 list-disc pl-5"
          >
            <li>Escolher o contador perito</li>
            <li>Consentimento LGPD por documento</li>
            <li>Acompanhar o processo em tempo real</li>
            <li>Avaliar o serviço entregue</li>
          </ul>
          <div className="mb-8">
            <CtrlSlider label="Concedidos" value={71} tone="light" />
          </div>
          <div className="mt-auto" data-testid="persona-cliente-cta">
            <MagBotao to="/register?role=cliente">Acompanhar meu processo</MagBotao>
          </div>
        </article>

        <article
          data-testid="persona-advogado"
          className="landing-reveal lg:col-span-5 bg-mg-ink text-white p-8 sm:p-10 flex flex-col rounded-[16px]"
        >
          <p className="font-ui text-xs text-white mb-2">Quem sustenta a tese</p>
          <h3 className="font-ui font-bold text-xl mb-6">Advogado</h3>
          <p data-testid="persona-advogado-dor" className="text-base text-white/80 mb-4">
            Precisa sustentar tese com número que não domina; a perícia é cara, lenta e imprevisível.
          </p>
          <p data-testid="persona-advogado-beneficio" className="text-base text-white/80 mb-6">
            Proteção e validação das informações processuais com embasamento técnico-contábil, dinâmico e a preço negociado.
          </p>
          <ul
            data-testid="persona-advogado-funcionalidades"
            className="font-ui text-sm text-white/80 space-y-2 mb-8 list-disc pl-5"
          >
            <li>Catálogo de contadores verificados por CRC</li>
            <li>Cadastro de processo e escopo da perícia</li>
            <li>Entregas revisáveis com pedido de ajuste</li>
            <li>Separação de honorários conforme ética OAB</li>
          </ul>
          <div className="mt-auto" data-testid="persona-advogado-cta">
            <MagBotao to="/register?role=advogado">Cadastrar meu escritório</MagBotao>
          </div>
        </article>

        <article
          data-testid="persona-contador"
          className="landing-reveal lg:col-span-12 bg-white text-ink rounded-[16px] border-t-2 border-mg-magenta p-8 sm:p-10 grid lg:grid-cols-12 gap-6"
        >
          <div className="lg:col-span-4">
            <p className="font-ui text-xs text-ledger mb-2">Quem assina o laudo</p>
            <div className="flex items-center gap-3 mb-4">
              <IconChip tint="rose">
                <GlyphVitrine />
              </IconChip>
              <IconVitrine className="hidden" />
              <h3 className="font-ui font-bold text-xl text-primary">
                Contador
              </h3>
            </div>
            <p data-testid="persona-contador-dor" className="text-base text-ink mb-4">
              Trabalho técnico invisível, sem canal de captação, dependente de indicação.
            </p>
            <p data-testid="persona-contador-beneficio" className="text-base text-ink mb-6">
              Portal próprio para exibir serviços, conectar-se a advogados e clientes e ganhar visibilidade contínua.
            </p>
            <div data-testid="persona-contador-cta">
              <MagBotao to="/register?role=contador">Criar meu perfil público</MagBotao>
            </div>
          </div>
          <div className="lg:col-span-8 flex flex-col gap-4 min-w-0">
            <ul
              data-testid="persona-contador-funcionalidades"
              className="flex flex-wrap gap-2 font-ui text-sm list-none"
            >
              <li className="landing-pill border border-outline bg-mg-ivory px-3 py-2">Perfil público com slug próprio</li>
              <li className="landing-pill border border-outline bg-mg-ivory px-3 py-2">Vitrine de serviços e postagens</li>
              <li className="landing-pill border border-outline bg-mg-ivory px-3 py-2">Disponibilidade e avaliações visíveis</li>
              <li className="landing-pill border border-outline bg-mg-ivory px-3 py-2">Fila de processos recebidos</li>
            </ul>
            <MockVitrine />
          </div>
        </article>
      </div>
    </section>
  );
}

function FluxoSection() {
  return (
    <section data-testid="landing-fluxo" className="pt-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <h2 className="font-ui font-bold text-[2rem] tracking-tight mb-12 text-mg-ink">
          O que o expediente segura
        </h2>
        <ol className="grid md:grid-cols-3 gap-8">
          <li className="bg-white rounded-[16px] p-6">
            <IconChip tint="lavender">
              <GlyphPrazo />
            </IconChip>
            <IconPrazo className="hidden" />
            <h3 className="font-ui font-bold text-xl mb-3 mt-4">
              Dado com dono
            </h3>
            <p className="font-ui text-sm leading-relaxed text-ink">
              Cada arquivo tem consentimento próprio. Sem o sim, o perito não lê.
            </p>
          </li>
          <li className="bg-white rounded-[16px] p-6">
            <IconChip tint="peach">
              <GlyphProcesso />
            </IconChip>
            <IconAcompanhamento className="hidden" />
            <h3 className="font-ui font-bold text-xl mb-3 mt-4">
              Três no mesmo rito
            </h3>
            <p className="font-ui text-sm leading-relaxed text-ink">
              Cliente, advogado e perito vêem o mesmo estado, no mesmo lugar.
            </p>
          </li>
          <li className="bg-white rounded-[16px] p-6">
            <IconChip tint="sky">
              <GlyphLaudo />
            </IconChip>
            <IconLaudo className="hidden" />
            <h3 className="font-ui font-bold text-xl mb-3 mt-4">
              Honorários separados
            </h3>
            <p className="font-ui text-sm leading-relaxed text-ink">
              O perito cobra o laudo. O escritório cobra a tese. A ética da OAB cabe.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}

export function LandingPage() {
  useLandingReveal();
  return (
    <div className="landing-root font-ui min-h-screen overflow-x-hidden text-mg-ink">
      <MagNav />
      <HeroSection />
      <MagConfianca />
      <ProductSection />
      <MagStrip />
      <MagBento>
        <PersonasSection />
      </MagBento>
      <MagFerramentas />
      <MagShowcase />
      <RitoSection />
      <ConexaoSection />
      <div data-testid="landing-quebra-clara" className="bg-mg-ivory text-mg-ink py-16">
        <FluxoSection />
      </div>
      <MagPlanos />
      <section id="landing-faq" data-testid="landing-faq">
        <MagFaq />
      </section>
      <MagFecho>
        <div data-testid="landing-cta-final" className="flex flex-col sm:flex-row flex-wrap gap-4 mt-10">
          <MagBotao to="/register?role=cliente">
            Sou cliente
          </MagBotao>
          <MagBotao to="/register?role=advogado">
            Sou advogado
          </MagBotao>
          <MagBotao to="/register?role=contador">
            Sou contador
          </MagBotao>
        </div>
      </MagFecho>
      <MagRodape />
    </div>
  );
}
