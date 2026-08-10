import { Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LawyerDashboard } from "./pages/LawyerDashboard";
import { AccountantDashboard } from "./pages/AccountantDashboard";
import { AccountantCatalogPage } from "./pages/AccountantCatalogPage";
import { ClientsPage } from "./pages/ClientsPage";
import { ClientDetailPage } from "./pages/ClientDetailPage";
import { ProcessPage } from "./pages/ProcessPage";
import { PostsPage } from "./pages/PostsPage";
import { ServicesPage } from "./pages/ServicesPage";
import { UsersPage } from "./pages/UsersPage";
import { SettingsPage } from "./pages/SettingsPage";
import { PublicProfilePage } from "./pages/PublicProfilePage";
import { AccountantPublicProfile } from "./pages/AccountantPublicProfile";
import { AccountantProfileEdit } from "./pages/AccountantProfileEdit";
import { AccountantProcessesPage } from "./pages/AccountantProcessesPage";
import { AccountantProcessDetail } from "./pages/AccountantProcessDetail";
import { ClientDashboard } from "./pages/ClientDashboard";
import { ClientProcessDetail } from "./pages/ClientProcessDetail";
import { ClientDocumentsPage } from "./pages/ClientDocumentsPage";
import { ClientNotificationsPage } from "./pages/ClientNotificationsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LawyerProcessesPage } from "./pages/LawyerProcessesPage";
import { LawyerProcessDetail } from "./pages/adv/LawyerProcessDetail";
import { LawyerSubscriptionPage } from "./pages/LawyerSubscriptionPage";
import { LandingPage } from "./pages/LandingPage";
import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { ToastProvider } from "./contexts/ToastContext";

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Routes>
        {/* ── Raiz: landing page comercial pública ───────────────────────── */}
        <Route path="/" element={<LandingPage />} />

        {/* ── Rotas públicas ─────────────────────────────────────────────── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/public" element={<PublicProfilePage />} />
        {/* Perfil público de contador (catálogo) */}
        <Route
          path="/contadores/:slug"
          element={<AccountantPublicProfile />}
        />

        {/* ── Painel do Advogado /adv/* ──────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["advogado", "admin"]} />}>
          <Route element={<AppShell role="advogado" />}>
            <Route path="/adv/dashboard" element={<LawyerDashboard />} />
            <Route path="/adv/clientes" element={<ClientsPage />} />
            <Route path="/adv/clientes/:id" element={<ClientDetailPage />} />
            <Route path="/adv/processos" element={<LawyerProcessesPage />} />
            <Route path="/adv/processos/:id" element={<ProcessPage />} />
            <Route path="/adv/vinculos/:id" element={<LawyerProcessDetail />} />
            <Route path="/adv/usuarios" element={<UsersPage />} />
            <Route path="/adv/assinatura" element={<LawyerSubscriptionPage />} />
            <Route path="/adv/configuracoes" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* ── Painel do Contador /acc/* ──────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["contador", "admin"]} />}>
          <Route element={<AppShell role="contador" />}>
            <Route path="/acc/dashboard" element={<AccountantDashboard />} />
            <Route path="/acc/perfil" element={<AccountantProfileEdit />} />
            <Route path="/acc/processos" element={<AccountantProcessesPage />} />
            <Route path="/acc/processos/:id" element={<AccountantProcessDetail />} />
            <Route path="/acc/servicos" element={<ServicesPage />} />
            <Route path="/acc/postagens" element={<PostsPage />} />
            <Route path="/acc/configuracoes" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* ── Painel do Cliente /cli/* ───────────────────────────────────── */}
        <Route element={<ProtectedRoute allowedRoles={["cliente", "admin"]} />}>
          <Route element={<AppShell role="cliente" />}>
            <Route path="/cli/dashboard" element={<ClientDashboard />} />
            <Route path="/cli/processos" element={<ClientDashboard />} />
            <Route path="/cli/processos/:id" element={<ClientProcessDetail />} />
            <Route path="/cli/catalogo" element={<AccountantCatalogPage />} />
            <Route path="/cli/documentos" element={<ClientDocumentsPage />} />
            <Route path="/cli/notificacoes" element={<ClientNotificationsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </ToastProvider>
    </ErrorBoundary>
  );
}
