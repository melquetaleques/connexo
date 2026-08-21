import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(fileURLToPath(import.meta.url));
const landingPage = readFileSync(join(root, "../src/pages/LandingPage.tsx"), "utf8");
const icons = readFileSync(join(root, "../src/components/ui/connexo-icons.tsx"), "utf8");
const landingDir = join(root, "../src/components/landing");

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
const all = `${landingPage}\n${landingSrc}\n${icons}`;

function innerByTestId(source, testid) {
  const attr = `data-testid="${testid}"`;
  const attrAt = source.indexOf(attr);
  assert.ok(attrAt >= 0, `faltando data-testid="${testid}"`);
  const tagStart = source.lastIndexOf("<", attrAt);
  const firstGt = source.indexOf(">", attrAt);
  assert.ok(tagStart >= 0 && firstGt >= 0, `tag malformada para ${testid}`);
  const tagName = source.slice(tagStart + 1, attrAt).trim().split(/[\s>/]/)[0];
  const openEnd = firstGt + 1;
  const closer = `</${tagName}`;
  let depth = 1;
  let i = openEnd;
  while (i < source.length && depth > 0) {
    const nextOpen = source.indexOf(`<${tagName}`, i);
    const nextClose = source.indexOf(closer, i);
    if (nextClose < 0) break;
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + tagName.length + 1;
    } else {
      depth -= 1;
      if (depth === 0) return source.slice(openEnd, nextClose);
      i = nextClose + closer.length;
    }
  }
  return source.slice(openEnd);
}

test("landing usa glass, chips de icone e controles de aplicacao", () => {
  assert.match(icons, /export function IconChip\b/, "IconChip nao exportado");
  const chipUses = all.match(/<IconChip\b/g) || [];
  assert.ok(chipUses.length >= 8, `IconChip usado ${chipUses.length}x (min 8)`);

  for (const name of ["CtrlSelect", "CtrlSlider", "CtrlToggle", "CtrlBotaoPrimario"]) {
    assert.match(landingSrc, new RegExp(`export function ${name}\\b`), `faltando ${name}`);
    assert.match(landingSrc, new RegExp(`<${name}\\b`), `faltando uso <${name}`);
  }

  assert.match(landingSrc, /export function MockAppShell\b/, "faltando MockAppShell");
  assert.match(landingSrc, /export function MockPainelFerramenta\b/, "faltando MockPainelFerramenta");
  assert.match(landingSrc, /<MockAppShell\b/, "MockAppShell nao usado");
  assert.match(landingSrc, /<MockPainelFerramenta\b/, "MockPainelFerramenta nao usado");

  assert.match(landingSrc, /Advogado/, "landing sem Advogado");
  assert.match(landingSrc, /Perito|Contador/, "landing sem Perito/Contador");
  assert.match(landingSrc, /Cliente/, "landing sem Cliente");

  const glassHits = all.match(/backdrop-blur|backdrop-filter/g) || [];
  assert.ok(glassHits.length >= 8, `glass no fonte: ${glassHits.length} (min 8)`);

  assert.doesNotMatch(landingSrc, /<img\b/i, "<img em components/landing");
  assert.doesNotMatch(landingSrc, /https?:\/\//i, "URL externa em components/landing");
});
