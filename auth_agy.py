#!/usr/bin/env python3
"""Script para enviar código de autorização para o agy via PTY."""
import subprocess
import sys
import os
import time

code = sys.argv[1] if len(sys.argv) > 1 else None
if not code:
    print("ERRO: Passe o código como argumento")
    sys.exit(1)

env = os.environ.copy()
env["PATH"] = f"{os.path.expanduser('~/.local/bin')}:{env.get('PATH', '')}"

proc = subprocess.Popen(
    ["agy", "--print", "autenticacao ok"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    cwd="/opt/data/connexo",
    env=env,
    text=True
)

# Esperar o prompt de autenticação aparecer
time.sleep(3)

# Enviar o código
proc.stdin.write(code + "\n")
proc.stdin.flush()

try:
    output, _ = proc.communicate(timeout=35)
    print(output)
except subprocess.TimeoutExpired:
    proc.kill()
    print("TIMEOUT")
    sys.exit(1)
