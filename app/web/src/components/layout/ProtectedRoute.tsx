import { Navigate, Outlet } from "react-router-dom";
import { useAuth, type Role } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  redirectTo?: string;
}

/**
 * ProtectedRoute — redireciona para /login se não autenticado.
 * Se `allowedRoles` for fornecido, também verifica o role do usuário.
 */
export function ProtectedRoute({
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redireciona para o painel correspondente ao role do usuário
    return <Navigate to={dashboardForRole(user.role)} replace />;
  }

  return <Outlet />;
}

function dashboardForRole(role: Role): string {
  switch (role) {
    case "advogado":
      return "/adv/dashboard";
    case "contador":
      return "/acc/dashboard";
    case "cliente":
      return "/cli/dashboard";
    case "admin":
      return "/adv/dashboard";
  }
}
