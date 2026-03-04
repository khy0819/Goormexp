# 메모앱 — React Router 과제 (260223)

## 실행 방법

```bash
npm install
npm run dev   # http://localhost:5173
```

> 백엔드 서버: `http://54.180.25.65:3002/api/memos`  
> Vite proxy를 통해 `/api` → `http://54.180.25.65:3002/api` 로 전달

---

## 파일 구조

```
src/
├── main.jsx          # ✅ 1단계: BrowserRouter 적용
├── App.jsx           # ✅ 3단계: Routes/Route 매핑 + 404 처리
├── App.css           # 전역 스타일 + CSS 변수
├── api/
│   ├── client.js     # axios 인스턴스 (baseURL: /api → 포트 3002)
│   └── memos.js      # CRUD API 함수 (인메모리 → 서버 연동으로 교체)
└── pages/
    ├── Layout.jsx            # ✅ 8단계: Outlet 중첩 라우트
    ├── MemoListPage.jsx      # ✅ 4단계 + useSearchParams (선택)
    ├── MemoDetailPage.jsx    # ✅ 6단계: useParams + useNavigate
    ├── MemoFormPage.jsx      # ✅ 7단계: 작성/수정 겸용
    └── NotFoundPage.jsx      # ✅ 3단계: 404 처리
```

---

## 페이지 구조

| URL | 역할 |
|-----|------|
| `/` | 메모 목록 (검색, 카테고리 필터, 페이지네이션) |
| `/memos/new` | 새 메모 작성 |
| `/memos/:id` | 메모 상세 조회 |
| `/memos/:id/edit` | 메모 수정 |
| `*` | 404 Not Found |

---

## 수정 사항 요약

| 파일 | 문제 | 수정 내용 |
|------|------|----------|
| `main.jsx` | handleSubmit 코드만 있었음 | BrowserRouter + createRoot로 교체 |
| `App.css` | CSS 변수 없어서 module.css가 깨짐 | `:root` 변수 전체 추가 |
| `api/client.js` | axios import 주석, 포트 미설정 | axios import 복원, /api proxy 설정 |
| `api/memos.js` | 인메모리 데이터 | axios 기반 실서버 API 연동으로 교체 |
| `vite.config.js` | proxy 없음 | `/api` → `http://54.180.25.65:3002` proxy 추가 |

---

## 핵심 훅 사용 위치

| 훅 | 파일 |
|----|------|
| `useParams` | MemoDetailPage, MemoFormPage |
| `useNavigate` | Layout, MemoDetailPage, MemoFormPage, NotFoundPage |
| `useSearchParams` | MemoListPage |
| `Link` | MemoListPage, MemoDetailPage, MemoFormPage, NotFoundPage |
| `NavLink` | Layout |
| `Outlet` | Layout |
