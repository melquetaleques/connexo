import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const src = readFileSync(new URL("../src/pages/LandingPage.tsx", import.meta.url), "utf8");
const tw = readFileSync(new URL("../tailwind.config.js", import.meta.url), "utf8");

const NAMED_PX = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
  "6xl": 60,
  "7xl": 72,
};

function declaredTextSizes(source) {
  const sizes = new Set();
  for (const m of source.matchAll(/\btext-\[(\d+(?:\.\d+)?)(px|rem)\]/g)) {
    const n = Number(m[1]);
    sizes.add(m[2] === "rem" ? n * 16 : n);
  }
  for (const m of source.matchAll(
    /\b(?:sm:|md:|lg:|xl:|2xl:)?text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)\b/g,
  )) {
    sizes.add(NAMED_PX[m[1]]);
  }
  return sizes;
}

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

test("landing respeita tipografia, contraste e escala do ciclo 2", () => {
  assert.doesNotMatch(src, /Fraunces/, "Fraunces em LandingPage.tsx");
  assert.doesNotMatch(tw, /Fraunces/, "Fraunces em tailwind.config.js");

  const sizes = declaredTextSizes(src);
  assert.ok(
    sizes.size <= 6,
    `escala tipográfica tem ${sizes.size} degraus (máx 6): ${[...sizes].sort((a, b) => a - b).join("/")}`,
  );

  const bodyOpen = src.match(/<(p|li|span)\b[^>]*>/g) || [];
  for (const tag of bodyOpen) {
    assert.ok(
      !/\btext-secondary\b/.test(tag),
      `text-secondary em texto de corpo: ${tag}`,
    );
  }

  const fecho = readFileSync(
    new URL("../src/components/landing/MagFecho.tsx", import.meta.url),
    "utf8",
  );
  assert.ok(fecho.includes('data-testid="landing-cta-final"'), "faltando landing-cta-final");
  assert.match(fecho, /to="\/register"/, "landing-cta-final sem /register");

  const testids = [
    "landing-hero",
    "landing-faq",
  ];
  for (const id of testids) {
    assert.ok(src.includes(`data-testid="${id}"`), `faltando data-testid="${id}"`);
  }
});

const iconsSrc = readFileSync(
  new URL("../src/components/ui/connexo-icons.tsx", import.meta.url),
  "utf8",
);

function iconComponentSource(source, name) {
  const start = source.indexOf(`export function ${name}`);
  assert.ok(start >= 0, `faltando export function ${name}`);
  const next = source.indexOf("export function ", start + 1);
  return next >= 0 ? source.slice(start, next) : source.slice(start);
}

test("camada de massa dos icones nao usa fill-paper sobre paper", () => {
  const icons = [
    "IconAutorizacao",
    "IconLaudo",
    "IconAcompanhamento",
    "IconVitrine",
    "IconPrazo",
  ];
  for (const name of icons) {
    const block = iconComponentSource(iconsSrc, name);
    const firstPath = block.match(/<path\b[^>]*>/);
    assert.ok(firstPath, `${name} sem <path>`);
    assert.ok(
      !/\bfill-paper\b/.test(firstPath[0]),
      `${name}: primeiro path usa fill-paper (massa some no fundo paper)`,
    );
  }
});
