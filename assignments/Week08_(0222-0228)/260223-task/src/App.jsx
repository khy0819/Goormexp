import { Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout.jsx'
import MemoListPage from './pages/MemoListPage.jsx'
import MemoDetailPage from './pages/MemoDetailPage.jsx'
import MemoFormPage from './pages/MemoFormPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

// ✅ 3단계: Routes / Route로 URL-컴포넌트 매핑 테이블 작성
export default function App() {
  return (
    <Routes>
      {/* ✅ 8단계: Layout을 부모 Route로 — Outlet으로 자식 렌더링 */}
      <Route path="/" element={<Layout />}>
        <Route index element={<MemoListPage />} />
        <Route path="memos/new" element={<MemoFormPage />} />
        <Route path="memos/:id" element={<MemoDetailPage />} />
        <Route path="memos/:id/edit" element={<MemoFormPage />} />
        {/* ✅ 3단계: 존재하지 않는 경로 → 404 처리 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
