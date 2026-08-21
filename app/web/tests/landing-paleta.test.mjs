import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(fileURLToPath(import.meta.url));
const landingPage = readFileSync(join(root, "../src/pages/LandingPage.tsx"), "utf8");
const landingDir = join(root, "../src/components/landing");
const tw = readFileSync(join(root, "../tailwind.config.js"), "utf8");

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
const all = `${landingPage}\n${landingSrc}`;

test("landing usa a paleta do modelo e nao usa mais o ouro", () => {
  assert.doesNotMatch(landingPage, /C59D5C/, "C59D5C em LandingPage.tsx");
  assert.doesNotMatch(landingSrc, /C59D5C/, "C59D5C em components/landing");
  assert.doesNotMatch(landingPage, /\btext-secondary\b/, "text-secondary em LandingPage.tsx");
  assert.doesNotMatch(landingPage, /\bbg-secondary\b/, "bg-secondary em LandingPage.tsx");
  assert.doesNotMatch(landingSrc, /\btext-secondary\b/, "text-secondary em components/landing");
  assert.doesNotMatch(landingSrc, /\bbg-secondary\b/, "bg-secondary em components/landing");

  assert.doesNotMatch(landingPage, /GoldButton/, "GoldButton em LandingPage.tsx");
  assert.doesNotMatch(landingSrc, /GoldButton/, "GoldButton em components/landing");

  assert.match(landingSrc, /export function MagBotao\b/, "MagBotao nao exportado");
  const uses = all.match(/<MagBotao\b/g) || [];
  assert.ok(uses.length >= 6, `MagBotao usado ${uses.length}x (min 6)`);

  assert.ok(all.includes('data-testid="mag-confianca"'), "faltando mag-confianca");
  assert.ok(all.includes('data-testid="mag-showcase"'), "faltando mag-showcase");

  for (const token of [
    "mg-ivory",
    "mg-ink",
    "mg-indigo",
    "mg-magenta",
    "mg-blue",
    "mg-warm",
  ]) {
    assert.match(tw, new RegExp(`["']${token}["']`), `faltando token ${token}`);
  }
  for (const hex of ["#F0F0E8", "#141414", "#5060E0", "#E040A0", "#5090F0", "#E08070"]) {
    assert.ok(tw.includes(hex), `faltando hex ${hex}`);
  }
});
