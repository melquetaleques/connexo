import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const src = readFileSync(new URL("../src/pages/LandingPage.tsx", import.meta.url), "utf8");

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

function visibleText(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^}]+\}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(html) {
  const text = visibleText(html);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function countLi(html) {
  return (html.match(/<li\b/g) || []).length;
}

test("landing apresenta os três atores com dor, benefício, funcionalidades e CTA", () => {
  const atores = ["cliente", "advogado", "contador"];

  for (const ator of atores) {
    const prefixes = [
      `persona-${ator}`,
      `persona-${ator}-dor`,
      `persona-${ator}-beneficio`,
      `persona-${ator}-funcionalidades`,
      `persona-${ator}-cta`,
    ];
    for (const id of prefixes) {
      assert.ok(src.includes(`data-testid="${id}"`), `faltando data-testid="${id}"`);
    }

    assert.ok(
      src.includes(`/register?role=${ator}`),
      `faltando rota /register?role=${ator}`,
    );

    const dor = innerByTestId(src, `persona-${ator}-dor`);
    const beneficio = innerByTestId(src, `persona-${ator}-beneficio`);
    const nDor = wordCount(dor);
    const nBen = wordCount(beneficio);
    assert.ok(nDor > 0 && nDor <= 20, `${ator} dor tem ${nDor} palavras (máx 20)`);
    assert.ok(nBen > 0 && nBen <= 25, `${ator} beneficio tem ${nBen} palavras (máx 25)`);

    const funcs = innerByTestId(src, `persona-${ator}-funcionalidades`);
    const nLi = countLi(funcs);
    assert.ok(nLi >= 3 && nLi <= 5, `${ator} funcionalidades tem ${nLi} <li> (3 a 5)`);
    for (const li of funcs.match(/<li\b[^>]*>[\s\S]*?<\/li>/g) || []) {
      const n = wordCount(li);
      assert.ok(n > 0 && n <= 10, `${ator} <li> tem ${n} palavras (máx 10): ${visibleText(li)}`);
    }
  }

  assert.equal((src.match(/blur-\[1[0-9]{2}px\]/g) || []).length, 0, "blur-[1XXpx] proibido");
  assert.ok((src.match(/\bitalic\b/g) || []).length <= 1, "no máximo 1 italic");

  const opacities = src.match(/(text-white|text-primary)\/(\d+)/g) || [];
  for (const token of opacities) {
    const n = Number(token.split("/")[1]);
    assert.ok(n >= 70, `opacidade baixa em texto: ${token}`);
  }
});
