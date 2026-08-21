import { NavLink, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Icon, Avatar } from "@/components/ui/connexo-primitives";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types";

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

const NAV: Record<Role, NavItem[]> = {
  advogado: [
    { to: "/adv/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/adv/clientes", label: "Clientes", icon: "group" },
    { to: "/adv/processos", label: "Processos", icon: "balance" },
    { to: "/adv/usuarios", label: "Equipe", icon: "badge" },
    { to: "/adv/configuracoes", label: "Configurações", icon: "settings" },
  ],
  contador: [
    { to: "/acc/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/acc/processos", label: "Perícias Ativas", icon: "history_edu" },
    { to: "/acc/servicos", label: "Meus Serviços", icon: "business_center" },
    { to: "/acc/postagens", label: "Postagens", icon: "article" },
    { to: "/acc/perfil", label: "Perfil Público", icon: "person" },
    { to: "/acc/configuracoes", label: "Configurações", icon: "settings" },
  ],
  cliente: [
    { to: "/cli/dashboard", label: "Painel", icon: "dashboard" },
    { to: "/cli/processos", label: "Processos", icon: "balance" },
    { to: "/cli/catalogo", label: "Contratar", icon: "search" },
    { to: "/cli/documentos", label: "Documentos", icon: "folder_open" },
    { to: "/cli/notificacoes", label: "Avisos", icon: "notifications" },
  ],
  admin: [
    { to: "/adv/dashboard", label: "Painel", icon: "admin_panel_settings" },
    { to: "/adv/clientes", label: "Clientes", icon: "group" },
    { to: "/adv/usuarios", label: "Usuários", icon: "person" },
  ],
};

const ROLE_LABELS: Record<Role, string> = {
  advogado: "Painel do Advogado",
  contador: "Portal do Contador",
  cliente: "Área do Cliente",
  admin: "Administrador",
};

interface AppShellProps {
  role?: Role;
}

export function AppShell({ role = "advogado" }: AppShellProps) {
  const { user, logout } = useAuth();
  const nav = NAV[role] ?? NAV.advogado;
  const location = useLocation();
  const displayName = user?.name ?? "Usuario";
  const initials = displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const subtitle = role === "advogado" ? "Advogado" : role === "contador" ? "Contador" : role === "cliente" ? "Cliente" : "";

  return (
    <div className="min-h-screen flex bg-surface-1 font-theme-body">
      <aside className="w-72 shrink-0 bg-primary text-white flex flex-col relative z-20 shadow-2xl">
        <div className="p-8 pb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shadow-lg shadow-secondary/20">
              <Icon name="balance" className="text-white text-base" />
            </div>
            <span className="text-xl font-semibold tracking-tight uppercase font-theme-display">Connexo</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
            {ROLE_LABELS[role]}
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-300 ease-out group relative overflow-hidden motion-reduce:transition-none",
                  isActive
                    ? "bg-white/12 text-white shadow-inner ring-1 ring-white/15"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )
              }
            >
              <Icon name={item.icon} fill={location.pathname === item.to} className="text-xl shrink-0" />
              <span>{item.label}</span>
              {location.pathname === item.to && (
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-secondary" />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 pb-3">
          <div className="rounded-2xl p-4 border border-white/10 bg-white/5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Plano</p>
            <p className="text-sm font-semibold font-theme-display">Profissional</p>
            <p className="text-[10px] text-white/40 mt-1">Vitrine e prazos no mesmo expediente.</p>
          </div>
        </div>

        <div className="p-4 mt-auto">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/10 transition-colors duration-300 hover:bg-white/8 motion-reduce:transition-none">
            <Avatar initials={initials} size="md" tone="gold" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate font-theme-display">{displayName}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{subtitle}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-secondary transition-colors duration-300 rounded-full hover:bg-white/5 motion-reduce:transition-none"
          >
            <Icon name="logout" className="text-lg" />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-20 shrink-0 border-b border-outline bg-white/70 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-10 cx-glass">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-primary/40">Visão Geral</h2>
            <p className="text-sm font-semibold text-ink font-theme-display">Sexta-feira, 04 de Maio de 2026</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-outline">
              <Icon name="search" className="text-primary/40" />
              <input
                type="text"
                placeholder="Pesquisar..."
                className="bg-transparent border-none p-0 text-xs font-medium text-ink placeholder:text-primary/30 focus:ring-0 w-32 font-theme-body"
              />
            </div>

            <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white border border-outline hover:border-secondary transition-all duration-300 group motion-reduce:transition-none">
              <Icon name="notifications" className="text-primary/60 group-hover:text-secondary transition-colors" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary border-2 border-white" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar bg-surface-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
