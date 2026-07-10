import api from "./api";

export interface ServiceItem {
  id: string;
  accountant_id: string;
  title: string;
  description: string;
  icon: string;
  areas: string[];
  price_from: number;
  avg_days: number;
  is_visible: boolean;
  created_at: string;
}

export async function listMyServices() {
  const { data } = await api.get<ServiceItem[]>("/acc/servicos");
  return data;
}

export async function createService(svc: Partial<ServiceItem>) {
  const { data } = await api.post<ServiceItem>("/acc/servicos", svc);
  return data;
}
