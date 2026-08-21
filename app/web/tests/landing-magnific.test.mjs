import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(fileURLToPath(import.meta.url));
const landingPage = readFileSync(join(root, "../src/pages/LandingPage.tsx"), "utf8");
const landingDir = join(root, "../src/components/landing");
const landingFiles = readdirSync(landingDir).filter((f) => /\.(tsx|ts|jsx|js)$/.test(f));
const landingSrc = landingFiles.map((f) => readFileSync(join(landingDir, f), "utf8")).join("\n");
const all = `${landingPage}\n${landingSrc}`;

test("landing reproduz o vocabulario de componentes do modelo", () => {
  const magIds = [
    "mag-nav",
    "mag-hero",
    "mag-hero-lista",
    "mag-strip",
    "mag-tabs",
    "mag-painel",
    "mag-ferramentas",
    "mag-showcase",
    "mag-planos",
    "mag-faq",
    "mag-fecho",
    "mag-rodape",
  ];
  for (const id of magIds) {
    assert.ok(all.includes(`data-testid="${id}"`), `faltando data-testid="${id}"`);
  }

  const mocks = [
    "MockCatalogo",
    "MockConsentimento",
    "MockTimeline",
    "MockLaudo",
    "MockVitrine",
  ];
  for (const name of mocks) {
    assert.match(landingPage, new RegExp(`<${name}\\b`), `faltando uso <${name}`);
  }
  const mockIds = [
    "mock-catalogo",
    "mock-consentimento",
    "mock-timeline",
    "mock-laudo",
    "mock-vitrine",
  ];
  for (const id of mockIds) {
    assert.ok(landingSrc.includes(`data-testid="${id}"`) || landingSrc.includes(`testId="${id}"`), `faltando ${id}`);
  }

  assert.doesNotMatch(all, /Newsreader/, "Newsreader na landing");
  assert.doesNotMatch(all, /Atkinson/, "Atkinson na landing");
  assert.doesNotMatch(all, /Fraunces/, "Fraunces na landing");

  assert.doesNotMatch(landingSrc, /<img\b/i, "<img em components/landing");
  assert.doesNotMatch(landingSrc, /https?:\/\//i, "URL externa em components/landing");

  const keepIds = [
    "landing-hero",
    "landing-faq",
    "mag-ferramentas",
    "mag-showcase",
  ];
  for (const id of keepIds) {
    assert.ok(all.includes(`data-testid="${id}"`), `faltando data-testid="${id}"`);
  }

  assert.match(all, /advogado|Advogado/, "landing sem o papel advogado");
  assert.match(all, /perito|Perito|contador|Contador/, "landing sem o papel perito");
  assert.match(all, /cliente|Cliente/, "landing sem o papel cliente");
});

test("landing porta o hero, as abas e a trilha do mockup", () => {
  const heroLista = readFileSync(join(landingDir, "MagHeroLista.tsx"), "utf8");
  const confianca = readFileSync(join(landingDir, "MagConfianca.tsx"), "utf8");
  const tabs = readFileSync(join(landingDir, "MagTabs.tsx"), "utf8");
  const painel = readFileSync(join(landingDir, "MagPainel.tsx"), "utf8");
  const css = readFileSync(join(root, "../src/index.css"), "utf8");
  const nav = readFileSync(join(landingDir, "MagNav.tsx"), "utf8");

  const ritoItems = [
    "Cadastrar o perito",
    "Vincular com base legal",
    "Controlar prazos",
    "Redigir o laudo",
    "Responder quesitos",
    "Assinar e entregar",
    "Publicar a vitrine",
  ];
  for (const item of ritoItems) {
    assert.ok(heroLista.includes(item), `lista do hero sem "${item}"`);
  }
  assert.equal(ritoItems.length, 7);

  assert.match(confianca, /Usado por 47 escritórios de advocacia e contabilidade/);
  for (const nome of ["Machado", "Pereira & Costa", "Duarte", "Ribeiro Perícias", "Vale Norte", "Aurora"]) {
    assert.ok(confianca.includes(nome), `trust strip sem "${nome}"`);
  }

  for (const tab of ["Vínculo", "Prazos", "Laudo", "Vitrine", "LGPD"]) {
    assert.ok(tabs.includes(`"${tab}"`) || tabs.includes(`label: "${tab}"`) || tabs.includes(`{ label: "${tab}"`), `aba ausente: ${tab}`);
  }

  for (const campo of ["Escopo de documentos", "Prazo de retenção", "Trilha de auditoria", "Revogação pelo cliente"]) {
    assert.ok(painel.includes(campo), `trilha LGPD sem "${campo}"`);
  }

  assert.match(landingPage, /minHeight:\s*760/);
  assert.doesNotMatch(landingPage, /min-h-\[92vh\]/);
  assert.match(css, /\.landing-pill\s*\{[^}]*border-radius:\s*8px/);

  for (const label of ["Expediente", "Peritos", "Recursos", "Escritórios", "Planos", "Buscar processo", "Entrar", "Criar conta"]) {
    assert.ok(nav.includes(label), `nav sem "${label}"`);
  }
  assert.doesNotMatch(nav, /\bfixed\b/, "MagNav ainda é barra fixa");
});
