import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(fileURLToPath(import.meta.url));
const landingPage = readFileSync(join(root, "../src/pages/LandingPage.tsx"), "utf8");
const landingDir = join(root, "../src/components/landing");
const photosDir = join(root, "../public/landing");

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) out.push(p);
  }
  return out;
}

const byName = Object.fromEntries(
  walk(landingDir).map((f) => [f.replace(/\\/g, "/").split("/").pop(), readFileSync(f, "utf8")]),
);
const ferramentas = byName["MagFerramentas.tsx"] ?? "";
const showcase = byName["MagShowcase.tsx"] ?? "";
const tsx = `${landingPage}\n${Object.values(byName).join("\n")}`;

test("hero usa a foto local e as secoes de produto usam mockup", () => {
  assert.ok(existsSync(join(photosDir, "hero-campo.jpg")), "faltando public/landing/hero-campo.jpg");
  assert.ok(existsSync(join(photosDir, "CREDITS.md")), "faltando public/landing/CREDITS.md");
  assert.match(landingPage, /\/landing\/hero-campo\.jpg/, "hero sem hero-campo.jpg");

  assert.doesNotMatch(ferramentas, /\/landing\/[^"' )]*\.jpg/, "Comece simples ainda aponta para /landing/*.jpg");
  assert.doesNotMatch(showcase, /\/landing\/[^"' )]*\.jpg/, "Da nomeacao ainda aponta para /landing/*.jpg");

  assert.match(ferramentas, /data-testid="mock-|testId="mock-|<Mock/, "Comece simples sem mockup de UI");
  assert.match(showcase, /data-testid="mock-|testId="mock-|<Mock/, "Da nomeacao sem mockup de UI");

  assert.doesNotMatch(
    tsx,
    /https?:\/\/[^"' )\]]+\.(jpg|jpeg|png|webp|gif|avif|svg)/i,
    "URL http externa de imagem nos TSX da landing",
  );
  assert.doesNotMatch(
    tsx,
    /src\s*=\s*["']https?:\/\//i,
    "src http externo nos TSX da landing",
  );
});
