import api from "./api";
import { Accountant } from "@/types";

export interface AccountantCatalogItem extends Accountant {
  name: string;
  avatar_url?: string;
}

export interface AccountantFilterParams {
  specialty?: string;
  city?: string;
  state?: string;
  q?: string;
}

export async function listAccountants(filters: AccountantFilterParams = {}) {
  const { data } = await api.get<AccountantCatalogItem[]>("/public/accountants", {
    params: filters,
  });
  return data;
}

export async function getAccountantProfile(slug: string) {
  const { data } = await api.get<AccountantCatalogItem>(`/public/accountants/${slug}`);
  return data;
}
