import React, { useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: '노션 스타일 UI 완성하기', completed: true },
    { id: 2, text: '리액트 불변성 유지 공부', completed: false },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(''); // 에러 메시지 상태

  // 1. 할 일 추가 (preventDefault, Controlled Input, 불변성 유지)
  const handleAdd = (e) => {
    e.preventDefault(); // submit 시 페이지 새로고침 방지

    if (!inputValue.trim()) {
      setError('내용을 입력해주세요!'); // 빈 값 입력 시 에러 메시지 노출
      return;
    }

    // setState에서 원본 배열 수정 없이 새로운 배열 생성 (spread operator)
    const newTodo = {
      id: Date.now(), // id 기반 key 사용 준비
      text: inputValue,
      completed: false
    };

    setTodos([newTodo, ...todos]);
    setInputValue(''); // input 초기화
    setError(''); // 성공 시 에러 메시지 제거
  };

  // 2. 할 일 삭제 (해당 아이템만 삭제)
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 3. 할 일 토글
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 4. 완료 개수 계산 (state가 아닌 계산으로 처리)
  const completedCount = todos.filter(t => t.completed).length;
  const percent = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className="todo-card">
      <header className="header">
        <h1>To-do List</h1>
        <p>오늘의 할 일은?</p>
      </header>

      {/* 입력 섹션 */}
      <form className="input-section" onSubmit={handleAdd}>
        <input 
          type="text" 
          value={inputValue} // Controlled Component
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="새 할 일 입력..." 
        />
        <button type="submit" className="add-btn">Add</button>
      </form>

      {/* 에러 메시지 표시 */}
      {error && <p className="error-msg" style={{color: '#eb5757', fontSize: '12px', marginTop: '-20px', marginBottom: '20px'}}>{error}</p>}

      {/* 진행도 섹션 */}
      <div className="progress-section">
        <div className="progress-info">
          <span>Progress</span>
          <span>{percent}%</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
        </div>
      </div>

      {/* 리스트 섹션 (EmptyState 처리) */}
      <ul className="todo-list">
        {todos.length === 0 ? (
          <p className="empty-state" style={{textAlign: 'center', color: '#9b9a97', padding: '40px 0'}}>
            할 일이 없습니다. 새로운 할 일을 추가해보세요!
          </p>
        ) : (
          todos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input 
                type="checkbox" 
                checked={todo.completed} 
                onChange={() => toggleTodo(todo.id)} 
              />
              <span className="todo-text">{todo.text}</span>
              <button className="del-btn" onClick={() => deleteTodo(todo.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;