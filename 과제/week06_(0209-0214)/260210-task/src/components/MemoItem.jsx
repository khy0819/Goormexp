import { useState } from 'react';

function MemoItem({ memo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(memo.title);
  const [editContent, setEditContent] = useState(memo.content);
  const [isCompleted, setIsCompleted] = useState(false); // 체크박스 상태

  // 수정 완료 핸들러 (PATCH 요청 성공 시 로컬 상태 갱신) [cite: 100, 110]
  const handleUpdate = () => {
    onUpdate(memo.id, { title: editTitle, content: editContent });
    setIsEditing(false);
  };

  return (
    <li className="memo-item">
      {isEditing ? (
        /* 1. 수정 모드 UI (카드 내부 모달 스타일) */
        <div className="edit-mode-container">
          <div className="edit-header">✏️ 메모 수정</div>
          <input 
            className="edit-input"
            value={editTitle} 
            onChange={(e) => setEditTitle(e.target.value)} 
            placeholder="제목을 입력하세요"
          />
          <textarea 
            className="edit-textarea"
            value={editContent} 
            onChange={(e) => setEditContent(e.target.value)} 
            placeholder="내용을 입력하세요"
            rows="5"
          />
          <div className="edit-actions">
            <button className="save-btn" onClick={handleUpdate}>저장하기</button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>취소</button>
          </div>
        </div>
      ) : (
        /* 2. 일반 보기 모드 */
        <>
          <div className="button-group">
            <button className="icon-btn btn-pin">📌</button>
            <button className="icon-btn btn-edit" onClick={() => setIsEditing(true)}>✏️</button>
            <button className="icon-btn btn-delete" onClick={() => onDelete(memo.id)}>🗑️</button>
          </div>

          <div className="memo-header">
  <input 
    type="checkbox" 
    className="memo-checkbox" 
    checked={isCompleted}
    onChange={(e) => setIsCompleted(e.target.checked)}
  />
  <span className={`memo-title ${isCompleted ? 'completed' : ''}`}>
    {memo.title}
  </span>
</div>

          <div className={`memo-content ${isCompleted ? 'completed-text' : ''}`}>
            {memo.content}
          </div>

          <div className="memo-date">
            생성: {new Date(memo.createdAt).toLocaleString()}
          </div>

          <div className="tag-container">
            {memo.tags?.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </>
      )}
    </li>
  );
}

export default MemoItem;