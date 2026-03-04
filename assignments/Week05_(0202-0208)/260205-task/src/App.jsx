import React, { useState } from 'react';
import Header from './components/Header';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  // 추가: 원본 수정 없이 새로운 배열 생성 (불변성)
  const handleAdd = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setError('내용을 입력해주세요!');
      return;
    }
    const newTodo = { id: Date.now(), text: inputValue, completed: false };
    setTodos([newTodo, ...todos]);
    setInputValue('');
    setError(''); // 성공 시 에러 제거
  };

  // 삭제: 해당 아이템만 필터링
  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 토글: 객체 복사를 통한 수정
  const handleToggle = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 계산 데이터: state가 아닌 계산으로 처리
  const completedCount = todos.filter(t => t.completed).length;
  const percent = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className="todo-card">
      <Header />
      <TodoForm 
        inputValue={inputValue} 
        setInputValue={setInputValue} 
        onAdd={handleAdd} 
        error={error} 
      />
      <TodoList 
        todos={todos} 
        onToggle={handleToggle} 
        onDelete={handleDelete} 
        percent={percent} 
        completedCount={completedCount} 
      />
    </div>
  );
}

export default App;