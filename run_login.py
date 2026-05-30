import subprocess
import time
import sys

print("Spawning agy...")
proc = subprocess.Popen(
    ["agy"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
    bufsize=1
)

time.sleep(2)
print("Sending /login...")
proc.stdin.write("/login\n")
proc.stdin.flush()

time.sleep(5)
# read whatever is available in stdout
import select
outputs = []
while True:
    r, _, _ = select.select([proc.stdout], [], [], 1.0)
    if r:
        line = proc.stdout.readline()
        if not line:
            break
        print("OUT:", line.strip())
        outputs.append(line)
    else:
        break

print("Done")
