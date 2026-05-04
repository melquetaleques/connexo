import { NavLink, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Icon, Avatar } from "@/components/ui/connexo-primitives";
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
    { to: "/adv/assinatura", label: "Plano & Cobrança", icon: "payments" },
    { to: "/adv/configuracoes", label: "Configurações", icon: "settings" },
  ],
  contador: [
    { to: "/cnt/dashboard", label: "Dashboard", icon: "dashboard" },
    { to: "/cnt/convites", label: "Convites", icon: "mail" },
    { to: "/cnt/processos", label: "Perícias Ativas", icon: "history_edu" },
    { to: "/cnt/servicos", label: "Meus Serviços", icon: "business_center" },
    { to: "/cnt/postagens", label: "Postagens", icon: "article" },
    { to: "/cnt/perfil", label: "Perfil Público", icon: "person" },
    { to: "/cnt/configuracoes", label: "Configurações", icon: "settings" },
  ],
  cliente: [
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
  const nav = NAV[role] ?? NAV.advogado;
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-surface-1 font-['Plus_Jakarta_Sans']">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 bg-primary text-white flex flex-col relative z-20 shadow-2xl">
        {/* Branding Area */}
        <div className="p-8 pb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center shadow-lg shadow-secondary/20">
              <Icon name="balance" className="text-white text-base" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">Connexo</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary/60">
            {ROLE_LABELS[role]}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all group relative overflow-hidden",
                  isActive 
                    ? "bg-secondary text-white shadow-lg shadow-secondary/20" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )
              }
            >
              <Icon name={item.icon} fill={location.pathname === item.to} className="text-xl shrink-0" />
              <span>{item.label}</span>
              {location.pathname === item.to && (
                <div className="absolute left-0 top-0 w-1 h-full bg-white/20" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Hook */}
        <div className="p-4 mt-auto">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 border border-white/5">
            <Avatar initials="MS" size="md" tone="gold" />
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">Dr. Marcelo Silva</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-secondary/80">OAB/SP 123.456</p>
            </div>
          </div>
          
          <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-rose-400 transition-colors">
            <Icon name="logout" className="text-lg" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-20 shrink-0 border-b border-outline/80 bg-white/60 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-primary/40">Visão Geral</h2>
            <p className="text-sm font-extrabold text-primary">Sexta-feira, 04 de Maio de 2026</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-outline/50">
              <Icon name="search" className="text-primary/40" />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="bg-transparent border-none p-0 text-xs font-bold text-primary placeholder:text-primary/30 focus:ring-0 w-32"
              />
            </div>
            
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white border border-outline hover:border-secondary transition-all group">
              <Icon name="notifications" className="text-primary/60 group-hover:text-secondary" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
