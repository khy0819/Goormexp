import { useState, useCallback, memo } from "react";

function MemoItem({
  memo,
  onUpdate,
  onDelete,
  onTogglePin,
  onSelect,
  isSelected = false, // JavaScript 기본 매개변수 사용
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(memo.title);
  const [editContent, setEditContent] = useState(memo.content);

  // Handle save with validation
  const handleSave = useCallback(() => {
    const trimmedTitle = editTitle.trim();
    const trimmedContent = editContent.trim();

    if (!trimmedTitle || !trimmedContent) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    onUpdate(memo.id, {
      title: trimmedTitle,
      content: trimmedContent,
    });
    setIsEditing(false);
  }, [editTitle, editContent, memo.id, onUpdate]);

  // Handle cancel editing
  const handleCancel = useCallback(() => {
    setEditTitle(memo.title);
    setEditContent(memo.content);
    setIsEditing(false);
  }, [memo.title, memo.content]);

  // Handle enter key to save
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && e.ctrlKey) {
        handleSave();
      } else if (e.key === "Escape") {
        handleCancel();
      }
    },
    [handleSave, handleCancel],
  );

  // Format date
  const formattedDate = new Date(memo.createdAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <li
      className={`memo-item ${memo.isPinned ? "pinned" : ""} ${isSelected ? "selected" : ""}`}
    >
      {isEditing ? (
        <div className="edit-mode-container">
          <input
            className="edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="제목을 입력하세요"
            autoFocus
          />
          <textarea
            className="edit-textarea"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="내용을 입력하세요 (Ctrl+Enter로 저장)"
            rows="4"
          />
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSave}>
              💾 저장
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              ❌ 취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="button-group">
            <button
              className={`icon-btn btn-pin ${memo.isPinned ? "active" : ""}`}
              onClick={() => onTogglePin(memo.id, memo.isPinned)}
              title={memo.isPinned ? "고정 해제" : "고정"}
              aria-label={memo.isPinned ? "고정 해제" : "고정"}
            >
              📌
            </button>
            <button
              className="icon-btn btn-edit"
              onClick={() => setIsEditing(true)}
              title="수정"
              aria-label="메모 수정"
            >
              ✏️
            </button>
            <button
              className="icon-btn btn-delete"
              onClick={() => onDelete(memo.id)}
              title="삭제"
              aria-label="메모 삭제"
            >
              🗑️
            </button>
          </div>

          <div className="memo-header">
            <input
              type="checkbox"
              className="memo-checkbox"
              checked={isSelected}
              onChange={() => onSelect(memo.id)}
              aria-label="메모 선택"
            />
            <span className={`memo-title ${isSelected ? "completed" : ""}`}>
              {memo.title}
            </span>
          </div>

          <p className={`memo-content ${isSelected ? "completed-text" : ""}`}>
            {memo.content}
          </p>

          <div className="memo-date">🕒 {formattedDate}</div>

          {memo.tags && memo.tags.length > 0 && (
            <div className="tag-container">
              {memo.tags.map((tag, i) => (
                <span key={`${tag}-${i}`} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </li>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(MemoItem);
