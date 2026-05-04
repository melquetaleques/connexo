import { useState, useEffect } from "react";
import type { User, Role } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("connexo_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erro ao parsear usuário", e);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("connexo_user", JSON.stringify(userData));
    localStorage.setItem("connexo_token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("connexo_user");
    localStorage.removeItem("connexo_token");
    window.location.href = "/login";
  };

  const hasRole = (roles: Role[]) => {
    return user && roles.includes(user.role);
  };

  return { user, loading, login, logout, hasRole };
}
