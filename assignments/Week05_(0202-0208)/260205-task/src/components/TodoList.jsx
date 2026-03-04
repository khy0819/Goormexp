import React from 'react';

const TodoList = ({ todos, onToggle, onDelete, percent, completedCount }) => {
  return (
    <>
      {/* 진행도 섹션: state가 아닌 계산값 전달받음 */}
      <div className="progress-section">
        <div className="progress-info">
          <span>완료: {completedCount} / {todos.length}</span>
          <span>({percent}%)</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
        </div>
      </div>

      <ul className="todo-list">
        {/* 할 일이 0개일 때 EmptyState 표시 */}
        {todos.length === 0 ? (
          <p className="empty-state">할 일이 없습니다. 새로운 할 일을 추가해보세요!</p>
        ) : (
          todos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input 
                type="checkbox" 
                checked={todo.completed} 
                onChange={() => onToggle(todo.id)} 
              />
              <span className="todo-text">{todo.text}</span>
              <button className="del-btn" onClick={() => onDelete(todo.id)}>삭제</button>
            </li>
          ))
        )}
      </ul>
    </>
  );
};

export default TodoList;