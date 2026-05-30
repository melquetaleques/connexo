#!/usr/bin/env python3
"""PTY-based auth sender for agy CLI."""
import os
import sys
import time
import pty
import select

code = sys.argv[1] if len(sys.argv) > 1 else None
if not code:
    print("ERRO: Passe o código como argumento")
    sys.exit(1)

# Config
env = os.environ.copy()
env["PATH"] = f"{os.path.expanduser('~/.local/bin')}:{env.get('PATH', '')}"

master_fd, slave_fd = pty.openpty()

pid = os.fork()
if pid == 0:
    # Child: exec agy
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

# Parent
os.close(slave_fd)
output = []
auth_sent = False

try:
    start = time.time()
    while time.time() - start < 35:
        r, _, _ = select.select([master_fd], [], [], 0.5)
        if r:
            try:
                data = os.read(master_fd, 4096)
                if not data:
                    break
                text = data.decode("utf-8", errors="replace")
                output.append(text)
                # Quando aparecer o prompt, enviar o código
                if not auth_sent and "Enter:" in text:
                    time.sleep(0.5)
                    os.write(master_fd, (code + "\n").encode())
                    auth_sent = True
                    time.sleep(0.3)
            except OSError:
                break
    
    # Wait a bit more for response
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
    os.waitpid(pid, 0)

result = "".join(output)
print(result)
print("=== AUTH SENT:", auth_sent, "===")
sys.exit(0 if "authentication failed" not in result and "Error" not in result else 1)
