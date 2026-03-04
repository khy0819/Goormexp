import client from './client.js'

// ✅ 기존 memoApi.js(인메모리)를 실제 서버 API 호출로 교체
//    서버 엔드포인트: http://54.180.25.65:3002/api/memos

// 전체 메모 목록 조회 (검색/카테고리 필터)
export async function getMemos({ search = '', category = '' } = {}) {
  const params = {}
  if (search)   params.q        = search
  if (category) params.category = category

  const res = await client.get('/memos', { params })
  return res.data
}

// 단일 메모 조회
export async function getMemo(id) {
  const res = await client.get(`/memos/${id}`)
  return res.data
}

// 메모 생성
export async function createMemo({ title, content, category }) {
  const now = new Date().toISOString()
  const res = await client.post('/memos', {
    title,
    content,
    category,
    pinned: false,
    createdAt: now,
    updatedAt: now,
  })
  return res.data
}

// 메모 수정
export async function updateMemo(id, { title, content, category }) {
  const res = await client.patch(`/memos/${id}`, {
    title,
    content,
    category,
    updatedAt: new Date().toISOString(),
  })
  return res.data
}

// 메모 삭제
export async function deleteMemo(id) {
  await client.delete(`/memos/${id}`)
  return true
}

// 핀 토글
export async function togglePin(id, currentPinned) {
  const res = await client.patch(`/memos/${id}`, {
    pinned: !currentPinned,
    updatedAt: new Date().toISOString(),
  })
  return res.data
}

// 카테고리 목록
export const CATEGORIES = ['학습', '개인', '아이디어']
