import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import api from "@/services/api";

export type Role = "advogado" | "cliente" | "contador" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  isAuthenticated: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: Role;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "connexo_token";
const USER_KEY = "connexo_user";

function loadInitialState(): AuthState {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    if (token && userStr) {
      return { token, user: JSON.parse(userStr) };
    }
  } catch {}
  return { token: null, user: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadInitialState);

  const persist = useCallback((token: string, user: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setState({ token, user });
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post<{ token: string; user: AuthUser }>(
        "/auth/login",
        { email, password }
      );
      persist(res.data.token, res.data.user);
    },
    [persist]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      const res = await api.post<{ token: string; user: AuthUser }>(
        "/auth/register",
        data
      );
      persist(res.data.token, res.data.user);
    },
    [persist]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({ token: null, user: null });
  }, []);

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const user = { ...prev.user, ...patch };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return { ...prev, user };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!state.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
