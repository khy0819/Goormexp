import { useState } from 'react'
import _ from 'lodash' // lodash 라이브러리 임포트
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // 1. lodash 사용 예시: 문자열 첫 글자 대문자 변환 (upperFirst)
  const title = _.upperFirst('welcome to my react bookshelf');

  // 2. lodash 사용 예시: 배열 셔플 (shuffle)
  const originalList = ['React', 'Vite', 'Lodash', 'JavaScript', 'Tailwind'];
  const shuffledList = _.shuffle(originalList);

  // 콘솔 출력 (요구사항)
  console.log("Lodash upperFirst:", title);
  console.log("Lodash shuffle:", shuffledList);

  return (
    <div className="App">
      <header>
        <h1>{title}</h1>
        <p>Lodash 라이브러리 테스트 중...</p>
      </header>
      
      <div className="card">
        <h3>오늘 배울 목록 (셔플됨):</h3>
        <ul>
          {shuffledList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <button onClick={() => setCount((count) => count + 1)}>
          현재 클릭 수: {count}
        </button>
      </div>

      <p className="read-the-docs">
        브라우저 콘솔(F12)을 확인하여 lodash 출력 결과를 보세요!
      </p>
    </div>
  )
}

export default App