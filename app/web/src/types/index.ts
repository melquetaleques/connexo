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
