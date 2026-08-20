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

const landingSrc = walk(landingDir)
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");
const tsx = `${landingPage}\n${landingSrc}`;

const PHOTOS = [
  "hero-campo.jpg",
  "painel-retrato.jpg",
  "tile-advocacia.jpg",
  "tile-laudo.jpg",
  "tile-consentimento.jpg",
  "tile-vitrine.jpg",
  "bento-advogado.jpg",
  "bento-contador.jpg",
  "fecho-campo.jpg",
  "tile-suave.jpg",
];

test("landing usa as 10 fotos locais de public/landing", () => {
  assert.equal(PHOTOS.length, 10);
  for (const name of PHOTOS) {
    assert.ok(existsSync(join(photosDir, name)), `faltando public/landing/${name}`);
  }
  assert.ok(existsSync(join(photosDir, "CREDITS.md")), "faltando public/landing/CREDITS.md");

  const credits = readFileSync(join(photosDir, "CREDITS.md"), "utf8");
  assert.match(credits, /Pexels/i, "CREDITS.md sem Pexels");

  let hits = 0;
  for (const name of PHOTOS) {
    if (tsx.includes(`/landing/${name}`)) hits += 1;
  }
  assert.ok(hits >= 8, `fotos referenciadas nos TSX: ${hits} (min 8)`);

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
