import { useState, useEffect } from 'react';
import { getMemos, createMemo, updateMemo, deleteMemo } from './api/memos';
import MemoForm from './components/MemoForm';
import MemoItem from './components/MemoItem';

function App() {
  const [memos, setMemos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMemos = async (q = '') => {
    try {
      setIsLoading(true);
      const data = await getMemos({ q });
      setMemos(data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemos(searchQuery);
  }, [searchQuery]);

  const handleAdd = async (title, content) => {
    try {
      const newMemo = await createMemo({ title, content });
      setMemos(prev => [newMemo, ...prev]); // 최신 메모를 맨 앞으로 [cite: 97]
    } catch (err) { alert('생성 실패'); }
  };

  const handleUpdate = async (id, changes) => {
    try {
      const updated = await updateMemo(id, changes);
      setMemos(prev => prev.map(m => m.id === id ? updated : m)); // map 패턴 [cite: 98]
    } catch (err) { alert('수정 실패'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteMemo(id);
      setMemos(prev => prev.filter(m => m.id !== id)); // filter 패턴 [cite: 106]
    } catch (err) { alert('삭제 실패'); }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>메모 관리 앱</h1>
      <MemoForm onAdd={handleAdd} />
      
      {isLoading && <p>로딩 중...</p>}
      {error && <p>에러 발생: {error} <button onClick={() => fetchMemos()}>재시도</button></p>}
      
      {!isLoading && !error && (
        <ul style={{ padding: 0 }}>
          {memos.map(memo => (
            <MemoItem 
              key={memo.id} 
              memo={memo} 
              onUpdate={handleUpdate} 
              onDelete={handleDelete} 
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;