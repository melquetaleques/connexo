import api from "./api";

export interface InvitePayload {
  email: string;
  name: string;
  permission: string;
}

export async function listUsers() {
  const res = await api.get("/adv/usuarios");
  return res.data;
}

export async function inviteUser(payload: InvitePayload) {
  const res = await api.post("/adv/usuarios/invite", payload);
  return res.data;
}
