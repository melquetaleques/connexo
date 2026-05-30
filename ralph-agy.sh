#!/bin/bash
# Ralph Loop adaptado para agy + GSD
# Loop de instâncias fresh do agy até completar todas as tasks da fase
# Uso: ./ralph-agy.sh <fase> [max_iterations]

set -e

PHASE="${1:-7}"
MAX_ITERATIONS="${2:-20}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="/opt/data/connexo"
AGY="/opt/data/home/.local/bin/agy"
PROGRESS_FILE="$SCRIPT_DIR/.ralph-phase${PHASE}-progress.txt"
DONE_FILE="$SCRIPT_DIR/.ralph-phase${PHASE}-done.txt"
TASK_COUNT_FILE="$SCRIPT_DIR/.ralph-phase${PHASE}-tasks"

export HOME="/opt/data/home"
export PATH="/opt/data/home/.local/bin:$PATH"

echo "===== RALPH LOADER (agy) - FASE $PHASE ====="
echo "Max iterations: $MAX_ITERATIONS"
echo "Inicio: $(date)"
echo ""

# Inicializa progresso
echo "# Ralph Progress - Phase $PHASE" > "$PROGRESS_FILE"
echo "Inicio: $(date)" >> "$PROGRESS_FILE"
echo "---" >> "$PROGRESS_FILE"

for i in $(seq 1 $MAX_ITERATIONS); do
  echo ""
  echo "==============================================================="
  echo "  Ralph Iteration $i of $MAX_ITERATIONS - Phase $PHASE"
  echo "==============================================================="
  echo ""

  cd "$PROJECT_DIR"

  # Le o plano da fase e contextos para injetar no prompt
  PLAN_FILE="$PROJECT_DIR/.planning/phases/${PHASE}-completar-fundacao-quebrada/${PHASE}-PLAN.md"
  CONTEXT_FILE="$PROJECT_DIR/.planning/phases/${PHASE}-completar-fundacao-quebrada/${PHASE}-CONTEXT.md"
  PLAN_CONTENT=$(head -100 "$PLAN_FILE" 2>/dev/null || echo "")
  
  # Verifica commits recentes para saber o que ja foi feito
  RECENT_COMMITS=$(cd "$PROJECT_DIR" && git log --oneline -10 --format="%h %s" 2>/dev/null || echo "")
  FILES_CHANGED=$(cd "$PROJECT_DIR" && git diff HEAD~1 --name-only 2>/dev/null || echo "")
  
  # Prompt super direto - ja fornece todo contexto, sem necessidade de exploracao
  cat << PROMPT | $AGY --print "$(cat)" 2>&1 | tee -a "$PROGRESS_FILE"
Caveman mode ativado. Voce esta em /opt/data/connexo (projeto connexo).

CONTEXTO DA FASE $PHASE:
Tasks do plano: extraia do arquivo .planning/phases/${PHASE}-completar-fundacao-quebrada/${PHASE}-PLAN.md

COMMITS RECENTES:
$RECENT_COMMITS

ULTIMOS ARQUIVOS ALTERADOS:
$FILES_CHANGED

INSTRUCOES:
1. Verifique qual task da Fase $PHASE ainda NAO foi implementada comparando os commits com as tasks do plano
2. Se todas as tasks estao feitas, responda: TASK_DONE
3. Se task pendente, IMPLEMENTE AGORA e COMMITE
4. Responda com 1 linha do que fez

NAO explore o codebase. Nao liste diretorios. Nao leia arquivos alem dos mencionados na task. Va direto ao codigo.
PROMPT

  # Verifica se o agy disse que terminou
  if grep -qi "TASK_DONE" "$PROGRESS_FILE" 2>/dev/null; then
    echo ""
    echo "===== TODAS AS TAREFAS DA FASE $PHASE CONCLUIDAS ====="
    echo "Completado na iteracao $i de $MAX_ITERATIONS"
    echo "Fim: $(date)"
    echo "$(date) - COMPLETE" > "$DONE_FILE"
    exit 0
  fi

  # Verifica se o progresso do GSD indica completude
  STATE=$(cd "$PROJECT_DIR" && node .agent/get-shit-done/bin/gsd-tools.cjs state --pick "phases.7.progress" 2>/dev/null || echo "0")
  if [ "$STATE" = "100" ]; then
    echo ""
    echo "===== GSD REPORT A FASE $PHASE COMO 100% ====="
    echo "$(date) - COMPLETE" > "$DONE_FILE"
    exit 0
  fi

  echo ""
  echo "Iteracao $i completa. Proxima iteracao em 2s..."
  sleep 2
done

echo ""
echo "===== RALPH ATINGIU MAX_ITERATIONS ($MAX_ITERATIONS) ====="
echo "Fase $PHASE nao completada. Verifique $PROGRESS_FILE"
exit 1