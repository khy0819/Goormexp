import client from "./client.js";

export async function getMemos({ search = "", category = "" } = {}) {
  const params = {};
  if (search) params.q = search;
  if (category) params.category = category;

  const res = await client.get("/memos", { params });
  const items = res.data.items ?? [];
  return items.map((m) => ({ ...m, pinned: m.isPinned }));
}

export async function getMemo(id) {
  const res = await client.get(`/memos/${id}`);
  const m = res.data;
  return { ...m, pinned: m.isPinned };
}

export async function createMemo({ title, content, category }) {
  const res = await client.post("/memos", { title, content, category });
  return res.data;
}

export async function updateMemo(id, { title, content, category }) {
  const res = await client.patch(`/memos/${id}`, { title, content, category });
  return res.data;
}

export async function deleteMemo(id) {
  await client.delete(`/memos/${id}`);
  return true;
}

export async function togglePin(id, currentPinned) {
  const res = await client.patch(`/memos/${id}/pin`, {
    isPinned: !currentPinned,
  });
  return res.data;
}

export const CATEGORIES = ["학습", "개인", "아이디어"];
