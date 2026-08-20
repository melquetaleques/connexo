import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(fileURLToPath(import.meta.url));
const tw = readFileSync(join(root, "../tailwind.config.js"), "utf8");
const css = readFileSync(join(root, "../src/index.css"), "utf8");
const landingPage = readFileSync(join(root, "../src/pages/LandingPage.tsx"), "utf8");
const landingDir = join(root, "../src/components/landing");
const heroLista = readFileSync(join(landingDir, "MagHeroLista.tsx"), "utf8");

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

test("landing usa a temperatura e as superficies do modelo", () => {
  assert.match(tw, /["']mg-vinho["']/, "faltando token mg-vinho no tailwind");
  assert.match(tw, /#40101E/, "mg-vinho fora de #40101E");

  assert.match(css, /\.mag-field\b/, "mag-field nao definido em index.css");
  assert.match(css, /\.mag-grain\b/, "mag-grain nao definido em index.css");
  assert.match(css, /feTurbulence/, "grain sem feTurbulence em index.css");

  const fieldUses = tsx.match(/\bmag-field\b/g) || [];
  const grainUses = tsx.match(/\bmag-grain\b/g) || [];
  assert.ok(fieldUses.length >= 6, `mag-field usado ${fieldUses.length}x nos TSX (min 6)`);
  assert.ok(grainUses.length >= 6, `mag-grain usado ${grainUses.length}x nos TSX (min 6)`);

  assert.ok(tsx.includes('data-testid="mag-hero-confianca"'), "faltando mag-hero-confianca");
  for (const id of ["bento-claro", "bento-ink", "bento-vinho", "bento-teal"]) {
    assert.ok(tsx.includes(`data-testid="${id}"`), `faltando data-testid="${id}"`);
  }

  assert.doesNotMatch(heroLista, /\bbg-mg-ink\b/, "MagHeroLista com bg-mg-ink");
  assert.doesNotMatch(heroLista, /\bbg-black\b/, "MagHeroLista com bg-black");
});
