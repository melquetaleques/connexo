import api from "./api";
import type { PublicAccountantProfile } from "@/types";

/**
 * AccountantService: API calls for accountant profile management.
 */

export interface AccountantDashboardData {
  stats: {
    pending_links: number;
    active_processes: number;
    completed_cases: number;
    rating: number;
  };
  pending_requests: {
    id: string;
    process_number: string;
    process_type: string;
    client_name: string;
    created_at: string;
  }[];
}

export async function getAccountantDashboard(): Promise<AccountantDashboardData> {
  const res = await api.get<AccountantDashboardData>("/acc/dashboard");
  return res.data;
}

export async function acceptLinkRequest(linkId: string) {
  const res = await api.post(`/acc/links/${linkId}/accept`);
  return res.data;
}

export async function rejectLinkRequest(linkId: string) {
  const res = await api.post(`/acc/links/${linkId}/reject`);
  return res.data;
}

export interface ProfileUpdateData {
  name?: string;
  bio?: string;
  specialty?: string;
  city?: string;
  state?: string;
}

export interface AvailabilityUpdate {
  availability: "disponivel" | "parcial" | "indisponivel";
}

/**
 * Busca o perfil do contador autenticado.
 */
export async function getMyProfile() {
  const res = await api.get("/acc/profile");
  return res.data;
}

/**
 * Atualiza o perfil do contador autenticado.
 */
export async function updateMyProfile(data: ProfileUpdateData) {
  const res = await api.put("/acc/profile", data);
  return res.data;
}

/**
 * Envia o arquivo de logo (multipart) para o backend.
 */
export async function uploadLogo(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/acc/media/logo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

/**
 * Envia o arquivo de foto (multipart) para o backend.
 */
export async function uploadPhoto(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/acc/media/photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

/**
 * Atualiza o status de disponibilidade do contador.
 */
export async function updateAvailability(status: AvailabilityUpdate) {
  const res = await api.put("/acc/availability", status);
  return res.data;
}

/**
 * Busca o perfil público de um contador pelo slug/id.
 */
export async function getPublicProfile(slug: string) {
  const res = await api.get<{
    profile: PublicAccountantProfile;
    posts: any[];
    logo_url: string;
    photo_urls: string[];
    availability: string;
  }>(`/public/accountants/${slug}`);
  return res.data;
}

// ---------------------------------------------------------------------------
// Review / Avaliação types
// ---------------------------------------------------------------------------

export interface ReviewData {
  id: string;
  accountant_id: string;
  client_id: string;
  link_id: string;
  rating: number;
  comment: string;
  reply_text: string;
  submitted_at: string;
  replied_at: string | null;
}

export interface ReviewWithClient extends ReviewData {
  client_name: string;
}

export interface CreateReviewPayload {
  link_id: string;
  rating: number;
  comment: string;
}

export interface ReviewStatusResponse {
  has_review: boolean;
  review: ReviewData | null;
}

// ---------------------------------------------------------------------------
// Review API calls
// ---------------------------------------------------------------------------

/**
 * Cria uma avaliação para um vínculo concluído (cliente autenticado).
 * POST /api/cli/reviews
 */
export async function createReview(data: CreateReviewPayload) {
  const res = await api.post<{ success: boolean; review: ReviewData }>(
    "/cli/reviews",
    data,
  );
  return res.data;
}

/**
 * Busca avaliações públicas de um contador.
 * GET /api/public/accountants/{slug}/reviews
 */
export async function getReviews(
  slug: string,
  params?: { limit?: number; offset?: number },
) {
  const res = await api.get<{
    reviews: ReviewWithClient[];
    total: number;
    limit: number;
    offset: number;
  }>(`/public/accountants/${slug}/reviews`, { params });
  return res.data;
}

/**
 * Verifica se o cliente autenticado já avaliou um determinado link.
 * GET /api/cli/reviews/check/{link_id}
 */
export async function checkReviewStatus(linkId: string) {
  const res = await api.get<ReviewStatusResponse>(
    `/cli/reviews/check/${linkId}`,
  );
  return res.data;
}

// ---------------------------------------------------------------------------
// Processos do contador
// ---------------------------------------------------------------------------

export interface AccountantProcess {
  id: string;
  process_id?: string;
  process_number?: string;
  process_type?: string;
  client_name?: string;
  status?: string;
  link_id?: string;
  court?: string;
}

export type AccountantProcessDetail = AccountantProcess & {
  documents?: unknown[];
  deliverables?: unknown[];
  events?: unknown[];
};

export async function listAccountantProcesses(): Promise<AccountantProcess[]> {
  const res = await api.get<{ processes?: AccountantProcess[] } | AccountantProcess[]>(
    "/acc/processes",
  );
  const data = res.data;
  if (Array.isArray(data)) return data;
  return data.processes ?? [];
}

export async function getAccountantProcess(id: string): Promise<AccountantProcessDetail> {
  const res = await api.get<AccountantProcessDetail>(`/acc/processes/${id}`);
  return res.data;
}

/** Alias used by older pages */
export async function updateAccountantProfile(data: ProfileUpdateData) {
  return updateMyProfile(data);
}
