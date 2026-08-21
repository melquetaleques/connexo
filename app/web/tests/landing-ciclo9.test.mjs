import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(root, "../src/index.css"), "utf8");
const landingPage = readFileSync(join(root, "../src/pages/LandingPage.tsx"), "utf8");
const landingDir = join(root, "../src/components/landing");
const magBotao = readFileSync(join(landingDir, "MagBotao.tsx"), "utf8");
const ctrlBotao = readFileSync(join(landingDir, "controls/CtrlBotaoPrimario.tsx"), "utf8");

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) out.push(p);
  }
  return out;
}

const landingSrc = walk(landingDir)
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");
const tsx = `${landingPage}\n${landingSrc}`;

test("ciclo 9: campo pinta, titulos vinho, CTA de marketing em ink", () => {
  const fieldBlock = css.match(/\.mag-field\s*\{[^}]+\}/);
  assert.ok(fieldBlock, ".mag-field nao encontrado em index.css");
  assert.doesNotMatch(fieldBlock[0], /position\s*:/, ".mag-field ainda declara position");

  const veilBlock = css.match(/\.mag-veil\s*\{[^}]+\}/);
  assert.ok(veilBlock, ".mag-veil nao definido em index.css");
  assert.match(veilBlock[0], /position\s*:\s*absolute/, ".mag-veil sem position:absolute");
  assert.match(veilBlock[0], /inset\s*:\s*0/, ".mag-veil sem inset:0");

  assert.match(landingPage, /mag-field mag-veil landing-field-hero/, "hero sem mag-veil");
  assert.match(tsx, /mag-field mag-veil landing-field-fecho/, "fecho sem mag-veil");

  assert.match(css, /\.mag-title-vinho\s*\{[^}]*#40101E/, "mag-title-vinho sem #40101E");
  const ivoryH2 = [
    "Um só lugar para todo o rito",
    "Escolha um módulo, comece o rito",
    "Da nomeação ao trânsito em julgado",
    "Respostas às perguntas mais comuns",
    "Comece simples.",
    "Integrado a tudo que o rito exige",
    "Feito no Connexo",
  ];
  for (const title of ivoryH2) {
    const idx = tsx.indexOf(title);
    assert.ok(idx > 0, `titulo ausente: ${title}`);
    const window = tsx.slice(Math.max(0, idx - 280), idx);
    assert.ok(
      window.includes("text-mg-vinho") || window.includes("mag-title-vinho"),
      `h2 "${title}" sem vinho`,
    );
  }

  assert.match(magBotao, /mag-botao-solid/, "MagBotao sem mag-botao-solid");
  assert.match(magBotao, /bg-mg-ink/, "MagBotao solida sem bg-mg-ink");
  assert.doesNotMatch(magBotao, /bg-mg-indigo/, "MagBotao ainda usa indigo");
  assert.match(ctrlBotao, /bg-mg-indigo/, "CtrlBotaoPrimario perdeu indigo dos mocks");
  assert.match(css, /\.mag-botao-solid\s*\{[^}]*#141414/, "mag-botao-solid sem #141414");
});
