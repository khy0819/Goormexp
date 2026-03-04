import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import MemoListPage from "./pages/MemoListPage.jsx";
import MemoDetailPage from "./pages/MemoDetailPage.jsx";
import MemoFormPage from "./pages/MemoFormPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* location.key를 key로 주면 경로 이동마다 MemoListPage 강제 리마운트 */}
        <Route index element={<MemoListPage key={location.key} />} />
        <Route path="memos/new" element={<MemoFormPage />} />
        <Route path="memos/:id" element={<MemoDetailPage />} />
        <Route path="memos/:id/edit" element={<MemoFormPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
