#!/usr/bin/env python3
"""Gera o link OAuth, espera o código do usuário, envia para o agy."""
import os
import sys
import time
import pty
import select
import json

# Arquivo pra comunicação
CODE_FILE = "/opt/data/connexo/.auth_code.txt"
LINK_FILE = "/opt/data/connexo/.auth_link.txt"

# Limpar arquivos antigos
for f in [CODE_FILE, LINK_FILE]:
    if os.path.exists(f):
        os.remove(f)

env = os.environ.copy()
env["PATH"] = f"{os.path.expanduser('~/.local/bin')}:{env.get('PATH', '')}"

master_fd, slave_fd = pty.openpty()

# Capturar o link do agy
pid = os.fork()
if pid == 0:
    os.close(master_fd)
    os.setsid()
    os.dup2(slave_fd, 0)
    os.dup2(slave_fd, 1)
    os.dup2(slave_fd, 2)
    if slave_fd > 2:
        os.close(slave_fd)
    os.execve(
        os.path.expanduser("~/.local/bin/agy"),
        ["agy", "--print", "autenticacao ok"],
        env
    )
    sys.exit(1)

os.close(slave_fd)
output = []
link = None

try:
    start = time.time()
    read_timeout = 35  # agy timeout interno
    
    while time.time() - start < read_timeout:
        r, _, _ = select.select([master_fd], [], [], 0.3)
        if r:
            try:
                data = os.read(master_fd, 4096)
                if not data:
                    break
                text = data.decode("utf-8", errors="replace")
                output.append(text)
                
                # Extrair o link
                if link is None and "accounts.google.com" in text:
                    for line in text.split("\n"):
                        if "accounts.google.com" in line:
                            link = line.strip()
                            # Salvar link para o usuário
                            with open(LINK_FILE, "w") as f:
                                f.write(link)
                            print(f"=== LINK SALVO EM {LINK_FILE} ===")
                            print(f"=== AGUARDANDO CÓDIGO DO USUÁRIO... ===", flush=True)
                
                # Verificar se já pediu o código
                if "paste the authorization code" in text or "Enter:" in text:
                    # Esperar o código ser escrito no arquivo pelo usuário
                    code_wait_start = time.time()
                    while time.time() - code_wait_start < 180:  # 3 min pra usuário colar
                        if os.path.exists(CODE_FILE):
                            with open(CODE_FILE, "r") as f:
                                code = f.read().strip()
                            if code:
                                time.sleep(0.5)
                                os.write(master_fd, (code + "\n").encode())
                                print(f"=== CÓDIGO ENVIADO ===", flush=True)
                                time.sleep(0.5)
                                break
                        time.sleep(0.5)
                    
                    # Se chegou aqui sem código, timeout
                    if not os.path.exists(CODE_FILE) or not open(CODE_FILE).read().strip():
                        print("=== TIMEOUT: código não recebido ===", flush=True)
                        break
            except OSError:
                break
    
    # Coletar resposta
    time.sleep(3)
    while True:
        r, _, _ = select.select([master_fd], [], [], 1)
        if r:
            try:
                data = os.read(master_fd, 4096)
                if not data:
                    break
                output.append(data.decode("utf-8", errors="replace"))
            except OSError:
                break
        else:
            break
finally:
    os.close(master_fd)
    try:
        os.waitpid(pid, 0)
    except:
        pass

result = "".join(output)
print("\n=== RESULTADO ===")
print(result)
print("=== FIM ===")

# Limpar arquivos
for f in [CODE_FILE, LINK_FILE]:
    if os.path.exists(f):
        os.remove(f)
