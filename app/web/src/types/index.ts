export type Role = "advogado" | "contador" | "cliente" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string;
  avatar?: string;
}

export interface Client {
  id: string;
  lawyer_id: string;
  user_id?: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  type: "PF" | "PJ";
  status: "active" | "inactive" | "pending";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Process {
  id: string;
  lawyer_id: string;
  client_id: string;
  number: string;
  type: string;
  court: string;
  stage: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Accountant {
  id: string;
  user_id: string;
  crc_number: string;
  crc_state: string;
  bio: string;
  specialties: string[];
  city: string;
  state: string;
  slug: string;
  is_public: boolean;
  rating: number;
  completed_cases: number;
  logo_url?: string;
  photo_urls?: string[];
  availability?: string;
}

export interface PublicAccountantProfile {
  id: string;
  name: string;
  email: string;
  specialty: string;
  city: string;
  state: string;
  bio: string;
  logo_url: string;
  photo_urls: string[];
  availability: string;
  posts?: any[];
}

// Phase 11: LGPD + Document Management Types
export interface DocPermission {
  id: string;
  document_id: string;
  link_id: string;
  granted_by: string;
  granted_at: string;
  revoked_at: string | null;
}

export interface DocumentRequest {
  id: string;
  process_id: string;
  requested_by: string;
  client_id: string;
  description: string;
  status: "pendente" | "atendido" | "cancelado";
  created_at: string;
  updated_at: string;
}

export interface ConsentRecord {
  id: string;
  client_id: string;
  link_id: string;
  consented_at: string;
  ip_address: string;
  user_agent: string;
  text_version: string;
}
