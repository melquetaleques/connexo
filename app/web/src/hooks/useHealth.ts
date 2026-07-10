import { useEffect, useState } from "react";
import { getHealth } from "@/services/api";

export function useHealth() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHealth()
      .then((r) => {
        if (!cancelled) setStatus(r.status);
      })
      .catch(() => {
        if (!cancelled) setError("API indisponível");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { status, error };
}
