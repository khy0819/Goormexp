import { useState, useEffect, useCallback, useMemo } from "react";
import { getMemos, createMemo, updateMemo, deleteMemo } from "./api/memos";
import MemoForm from "./components/MemoForm";
import MemoItem from "./components/MemoItem";
import "./App.css";

function App() {
  const [memos, setMemos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 검색 및 정렬 상태 (입력값과 검색어 분리)
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");

  // 페이지네이션 상태 (확장 과제)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 5;

  // 선택 삭제 상태 (확장 과제)
  const [selectedIds, setSelectedIds] = useState([]);

  // --- 1. 데이터 조회 (페이지네이션 & 검색 반영) ---
  const fetchMemos = useCallback(async (q = "", page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      // API 명세서의 page, pageSize 파라미터 사용
      const data = await getMemos({ q, page, pageSize: PAGE_SIZE });
      setMemos(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError("데이터를 불러오는 중 문제가 발생했습니다."); // 에러 UI 제공
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemos(searchQuery, currentPage);
  }, [searchQuery, currentPage, fetchMemos]);

  // --- 2. 정렬 로직 (핀 고정 우선 + 시간순) ---
  const sortedMemos = useMemo(() => {
    return [...memos].sort((a, b) => {
      // 📌 1순위: 핀 고정 여부 (pinned가 위로)
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      // 🕒 2순위: 작성 시간순
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });
  }, [memos, sortOrder]);

  // --- 3. 이벤트 핸들러 ---
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // 검색 시 1페이지로 이동
    setSearchQuery(inputValue.trim()); // 버튼 클릭 시에만 검색어 적용
  };

  const handleAdd = async (title, content) => {
    try {
      const newMemo = await createMemo({ title, content });
      setMemos((prev) => [newMemo, ...prev]); // 최신 메모를 맨 앞으로
    } catch (err) {
      alert("추가 실패");
    }
  };

  const handleUpdate = async (id, changes) => {
    try {
      const updated = await updateMemo(id, changes);
      setMemos((prev) => prev.map((m) => (m.id === id ? updated : m))); // map 패턴 사용
    } catch (err) {
      alert("수정 실패");
    }
  };

  const handleTogglePin = async (id, currentPinned) => {
    try {
      const updated = await updateMemo(id, { isPinned: !currentPinned });
      setMemos((prev) => prev.map((m) => (m.id === id ? updated : m)));
    } catch (err) {
      alert("핀 설정 실패");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteMemo(id);
      setMemos((prev) => prev.filter((m) => m.id !== id)); // filter 패턴 사용
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    } catch (err) {
      alert("삭제 실패");
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`${selectedIds.length}개를 삭제할까요?`)) return;
    try {
      await Promise.all(selectedIds.map((id) => deleteMemo(id)));
      setMemos((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
      setSelectedIds([]);
    } catch (err) {
      alert("일괄 삭제 실패");
    }
  };

  return (
    <div id="root">
      <h1>🗒️ 메모 관리 앱</h1>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          className="search-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="메모 검색..."
        />
        <button type="submit" className="search-btn">
          🔍 검색
        </button>
      </form>

      <MemoForm onAdd={handleAdd} />

      <div className="list-controls">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-select"
        >
          <option value="latest">⬇️ 최신순</option>
          <option value="oldest">⬆️ 오래된순</option>
        </select>
        {selectedIds.length > 0 && (
          <button className="batch-delete-btn" onClick={handleBatchDelete}>
            🗑️ 선택 삭제 ({selectedIds.length})
          </button>
        )}
      </div>

      {/* 상태 UI 3종 세트 분기 (Loading -> Error -> Empty) */}
      {isLoading && (
        <div className="status-msg">
          <div className="spinner"></div>로딩 중...
        </div>
      )}

      {!isLoading && error && (
        <div className="status-msg error-msg">
          <p>⚠️ {error}</p>
          <button
            className="retry-btn"
            onClick={() => fetchMemos(searchQuery, currentPage)}
          >
            🔄 다시 시도
          </button>
        </div>
      )}

      {!isLoading && !error && sortedMemos.length === 0 && (
        <div className="status-msg">📝 메모가 없습니다.</div>
      )}

      {!isLoading && !error && sortedMemos.length > 0 && (
        <>
          <ul className="memo-list" style={{ padding: 0 }}>
            {sortedMemos.map((memo) => (
              <MemoItem
                key={memo.id} // item.id를 key로 사용
                memo={memo}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
                onSelect={(id) =>
                  setSelectedIds((prev) =>
                    prev.includes(id)
                      ? prev.filter((i) => i !== id)
                      : [...prev, id],
                  )
                }
                isSelected={selectedIds.includes(memo.id)}
              />
            ))}
          </ul>
          {/* 페이지네이션 컨트롤러 */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="page-btn"
            >
              이전
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="page-btn"
            >
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
}
export default App;
