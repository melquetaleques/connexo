import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const files = [
  "src/components/lgpd/DocPermissionPanel.tsx",
  "src/pages/cli/ClientProcessDetail.tsx",
  "src/pages/adv/LawyerSubscriptionPage.tsx",
];

test("feedback de erro não envia o objeto da API diretamente para a interface", () => {
  for (const file of files) {
    const source = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
    assert.doesNotMatch(
      source,
      /set(?:Error|ReviewError)\(err(?:\?|\.)[^\n;]*response\?\.data/,
      `${file} deve converter a resposta da API em texto antes de renderizá-la`,
    );
  }
});
