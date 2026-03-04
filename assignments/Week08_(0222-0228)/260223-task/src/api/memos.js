import client from "./client.js";

// 전체 메모 목록 조회
export async function getMemos({ search = "", category = "" } = {}) {
  const params = {};
  if (search) params.q = search;
  if (category) params.category = category;

  const res = await client.get("/memos", { params });
  return res.data.items ?? [];
}

// 단일 메모 조회
export async function getMemo(id) {
  const res = await client.get(`/memos/${id}`);
  return res.data;
}

// 메모 생성
export async function createMemo({ title, content, category }) {
  const now = new Date().toISOString();
  const res = await client.post("/memos", {
    title,
    content,
    category,
    isPinned: false,
    createdAt: now,
    updatedAt: now,
  });
  return res.data;
}

// 메모 수정
export async function updateMemo(id, { title, content, category }) {
  const res = await client.patch(`/memos/${id}`, {
    title,
    content,
    category,
    updatedAt: new Date().toISOString(),
  });
  return res.data;
}

// 메모 삭제
export async function deleteMemo(id) {
  await client.delete(`/memos/${id}`);
  return true;
}

// 핀 토글
export async function togglePin(id, currentPinned) {
  const res = await client.patch(`/memos/${id}`, {
    isPinned: !currentPinned,
    updatedAt: new Date().toISOString(),
  });
  return res.data;
}

// 카테고리 목록
export const CATEGORIES = ["학습", "개인", "아이디어"];
