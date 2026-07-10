type ClassValue = string | number | boolean | null | undefined | ClassValue[];

function flatten(inputs: ClassValue[], out: string[]): void {
  for (const x of inputs) {
    if (x === null || x === undefined || x === false || x === true) continue;
    if (Array.isArray(x)) {
      flatten(x, out);
      continue;
    }
    out.push(String(x));
  }
}

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  flatten(inputs, out);
  return out.join(" ");
}
