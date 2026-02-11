import client from "./client";

// 목록 조회
export const getMemos = async (params = {}) => {
  const response = await client.get("/memos", { params });
  return response.data;
};

// 생성
export const createMemo = async (payload) => {
  const response = await client.post("/memos", payload);
  return response.data;
};

// 수정
export const updateMemo = async (id, payload) => {
  const response = await client.patch(`/memos/${id}`, payload);
  return response.data;
};

// 삭제
export const deleteMemo = async (id) => {
  await client.delete(`/memos/${id}`);
};
