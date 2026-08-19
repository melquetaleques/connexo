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

/** Extrai mensagem de erro de uma falha Axios/Fetch para exibir na UI. */
export function apiErrorMessage(err: unknown, fallback = "Erro inesperado. Tente novamente."): string {
  if (!err || typeof err !== "object") return fallback;
  const anyErr = err as {
    message?: string;
    response?: { data?: unknown };
  };
  const data = anyErr.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data && typeof data === "object") {
    const rec = data as { error?: unknown; message?: unknown };
    if (typeof rec.error === "string" && rec.error.trim()) return rec.error;
    if (typeof rec.message === "string" && rec.message.trim()) return rec.message;
  }
  if (typeof anyErr.message === "string" && anyErr.message.trim()) return anyErr.message;
  return fallback;
}
