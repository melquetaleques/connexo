import api from "./api";

export interface PostPayload {
  title: string;
  excerpt: string;
  content: string;
  tag: string;
  cover_url: string;
}

export async function listMyPosts() {
  const res = await api.get("/acc/postagens");
  return res.data;
}

export async function createPost(payload: PostPayload) {
  const res = await api.post("/acc/postagens", payload);
  return res.data;
}
