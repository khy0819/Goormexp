import { useState } from "react";

function MemoForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 제목과 내용이 비어있지 않은지 체크 (명세서 빈 문자열 불가 원칙) [cite: 240]
    if (!title.trim() || !content.trim())
      return alert("제목과 내용을 모두 입력해주세요!");

    onAdd(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <div className="memo-form-container">
      <h3 className="form-title">새 메모 작성</h3>
      <form onSubmit={handleSubmit} className="memo-form">
        <div className="input-group">
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            placeholder="메모 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            placeholder="메모 내용을 입력하세요"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-btn">
          추가하기
        </button>
      </form>
    </div>
  );
}

export default MemoForm;
