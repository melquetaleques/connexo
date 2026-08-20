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
    "mag-bento",
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

  const personaIds = [
    "landing-hero",
    "landing-conexao",
    "landing-personas",
    "persona-cliente",
    "persona-cliente-dor",
    "persona-cliente-beneficio",
    "persona-cliente-funcionalidades",
    "persona-cliente-cta",
    "persona-advogado",
    "persona-advogado-dor",
    "persona-advogado-beneficio",
    "persona-advogado-funcionalidades",
    "persona-advogado-cta",
    "persona-contador",
    "persona-contador-dor",
    "persona-contador-beneficio",
    "persona-contador-funcionalidades",
    "persona-contador-cta",
    "landing-fluxo",
    "landing-faq",
  ];
  assert.equal(personaIds.length, 20);
  for (const id of personaIds) {
    assert.ok(landingPage.includes(`data-testid="${id}"`), `faltando data-testid="${id}"`);
  }
});
