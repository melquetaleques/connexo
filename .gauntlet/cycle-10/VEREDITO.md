# VEREDITO — Ciclo 10 (fotografia e movimento)

**Resultado: E1–E3 e E5 PASS. E4 (contraste) PARCIAL — a lista antiga zerou, mas
a foto trouxe 2 casos novos reais.**

## Por tarefa

| Tarefa | Veredito | Evidência |
|---|---|---|
| E1 — fotos no lugar | **PASS** | 10/10 fotos mapeadas encontradas no DOM certo: `hero-campo` (img no hero), `painel-retrato` (bg no `mag-painel`), os 4 `tile-*` (bg no `mag-showcase`), `bento-advogado`/`bento-contador` (img nos bentos certos), `fecho-campo` (bg no fecho), `tile-suave` (img na vitrine-grande). Visual: o hero agora é **a mesma composição do modelo** — campo/vegetação silhueta contra céu bordô-rosa ao entardecer. |
| E2 — movimento M7–M10 | **PASS** | M7 ken-burns: `scale` muda de 1.00244→1.00635 em 1.5s (contínuo). M8 hover: transform de camada do tile muda ao posicionar o mouse. M9 parallax: hero desloca `translate(0,-10)` após 400px de scroll. M10: `animation-name: mag-marquee, duration 32s` nos selos. Reduced-motion: **0** animações rodando, **0** elementos invisíveis. |
| E3 — proporção escura | **PASS** | **15.5%→ medido de novo em 21.4% top-3 / hue 0°/350° warm_frac ~1.0.** (nota: a métrica de 58 faixas ficou em ~15-21% dependendo do corte pós-fotos, dentro de tolerância pela mudança de altura da página com fotos; hue e temperatura seguem corretos). |
| E4 — contraste | **PARCIAL** | A lista nominal do `cycle-9/VEREDITO.md` (timestamps, `ABRIR VITRINE`, `CRC 1SP-314567` etc.) **zerou** — todos ≥4.5:1 agora. Mas a foto introduziu **2 casos novos, confirmados visualmente**: ver abaixo. |
| E5 — teste novo | **PASS** | **11** testes, exit 0. Nenhuma linha de teste antigo tocada. |
| Congelado (temperatura, h2 vinho, CTAs ink, ordem, testids, glass, ctrl) | **PASS** | Ordem das 12 seções crescente ✅. glass **44** (≥21). ctrl **17** (≥14). h1 único. overflow 0. console limpo. build 0, tsc 3, go ok. |

## Os 2 casos novos de contraste (verificados por olho, não só por pixel)

1. **`mag-hero-lista`**: os itens de texto (`Catálogo com CRC`, `Timeline do
   rito`…) caem sobre a região clara do céu na foto do hero — ficam quase
   ilegíveis ali. O véu escuro do hero não é forte o bastante no quadrante
   direito onde a lista mora.
2. **`Quem autoriza o dado`** (rótulo do card `bento-claro`/zona de transição
   para `bento-vinho`): texto claro sobre fundo salmão claro — quase invisível.
   Parece que o véu ou a cor de texto não foi ajustada quando a foto/gradiente
   entrou nessa borda.

Não reprovo a tarefa inteira por isso — é achado localizado, não sistêmico —
mas é bloqueante para "pronto": esses dois pontos existiam antes e a mudança de
fundo (foto) os reabriu.

## Escopo e integridade

Diff toca só landing (10 componentes + index.css + LandingPage). 11 testes,
diff 0 nos 10 antigos. `.gauntlet/*.md` novos são documentação do próprio
executor (`DESIGN-PLAN`, `MOVIMENTO`, `AUDITORIA-TELAS`, `PROTOCOL` residual do
harness) — não tocam código, sem violação de escopo funcional.

## Instrução para o ciclo 11 (o último antes de aprovar)

1. **F1** — véu do hero: reforçar a camada escura sob `mag-hero-lista`
   especificamente (véu local, não a página toda) até o texto bater 4.5:1
   sobre qualquer trecho da foto atrás dele.
2. **F2** — corrigir a transição de cor onde `Quem autoriza o dado` (e
   qualquer rótulo irmão na mesma borda) senta: subir peso/contraste do texto
   ou escurecer o fundo local.
3. Não tocar em mais nada — fotos, movimento, temperatura, ordem e testes
   estão aprovados.
