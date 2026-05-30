import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";

interface SubscriptionStatus {
  expired: boolean;
  expiresAt: string | null;
  daysRemaining: number;
  loading: boolean;
}

export function useExpiredSubscription(): SubscriptionStatus {
  const [expired, setExpired] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [loading, setLoading] = useState(true);

  const check = useCallback(async () => {
    try {
      const res = await api.get("/adv/subscription");
      const data = res.data;
      setExpired(data.status === "expirado");
      setExpiresAt(data.expires_at);
      setDaysRemaining(data.days_remaining ?? 0);
    } catch {
      // Silently fail — if there's no subscription data, don't show banner
      setExpired(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  return { expired, expiresAt, daysRemaining, loading };
}
