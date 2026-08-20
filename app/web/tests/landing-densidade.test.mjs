import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = dirname(fileURLToPath(import.meta.url));
const landingPage = readFileSync(join(root, "../src/pages/LandingPage.tsx"), "utf8");
const landingDir = join(root, "../src/components/landing");

test("landing tem mockups de produto e trilho narrativo", () => {
  const mocks = [
    "MockCatalogo",
    "MockConsentimento",
    "MockTimeline",
    "MockLaudo",
    "MockVitrine",
  ];
  for (const name of mocks) {
    assert.match(
      landingPage,
      new RegExp(`import \\{ ${name} \\} from`),
      `faltando import de ${name}`,
    );
    assert.match(landingPage, new RegExp(`<${name}\\b`), `faltando uso <${name}`);
  }

  assert.ok(
    landingPage.includes('data-testid="landing-rito"'),
    'faltando data-testid="landing-rito"',
  );
  assert.ok(
    landingPage.includes('data-testid="landing-quebra-clara"'),
    'faltando data-testid="landing-quebra-clara"',
  );

  const times = landingPage.match(/\b\d{2}h\d{2}\b/g) || [];
  assert.ok(times.length >= 4, `horários NNhNN: ${times.length} (mín 4)`);

  const files = readdirSync(landingDir).filter((f) => /\.(tsx|ts|jsx|js)$/.test(f));
  assert.ok(files.length > 0, "src/components/landing/ vazio");
  const all = files.map((f) => readFileSync(join(landingDir, f), "utf8")).join("\n");
  assert.doesNotMatch(all, /lorem/i, "lorem nos mocks");
  assert.doesNotMatch(all, /Item 1/, "Item 1 nos mocks");
  assert.doesNotMatch(all, /Exemplo 1/, "Exemplo 1 nos mocks");
  assert.doesNotMatch(all, /placeholder/i, "placeholder nos mocks");
  assert.doesNotMatch(all, /<img\b/i, "<img nos mocks");
  assert.doesNotMatch(all, /https?:\/\//i, "URL externa nos mocks");
});
