import api from "./api";
import type { PublicAccountantProfile } from "@/types";

/**
 * AccountantService: API calls for accountant profile management.
 */

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
