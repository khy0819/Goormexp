import React from 'react';

const TodoForm = ({ inputValue, setInputValue, onAdd, error }) => {
  return (
    <div className="input-area">
      <form className="input-section" onSubmit={onAdd}>
        <input 
          type="text" 
          value={inputValue} // Controlled Component
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="새 할 일 입력..." 
        />
        <button type="submit" className="add-btn">추가</button>
      </form>
      {/* 빈 값 입력 시 에러 메시지 표시 */}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
};

export default TodoForm;