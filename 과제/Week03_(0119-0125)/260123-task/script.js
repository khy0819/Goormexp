/**
 * 1. TO-DO LIST LOGIC */
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const totalCnt = document.getElementById("total-count");
const doneCnt = document.getElementById("done-count");
let todos = []; // 할 일 데이터를 담는 배열

// 화면을 다시 그리는 함수 (데이터와 UI의 동기화)
function updateTodo() {
  todoList.innerHTML = ""; // 리스트 초기화
  todos.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    // 템플릿 리터럴을 사용한 동적 DOM 생성
    li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${t.done ? "checked" : ""} onchange="toggleTodo(${i})">
            <span class="todo-text ${t.done ? "completed" : ""}" onclick="toggleTodo(${i})">${t.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${i})">🗑️</button>
        `;
    todoList.appendChild(li);
  });
  // 전체 및 완료 개수 실시간 갱신
  totalCnt.innerText = todos.length;
  doneCnt.innerText = todos.filter((t) => t.done).length;
}

// 할 일 추가 함수
const addTodo = () => {
  const text = todoInput.value.trim();
  if (!text) return; // 빈 문자열 방지 로직
  todos.push({ text, done: false }); // 배열에 새 데이터 추가
  todoInput.value = ""; // 추가 후 입력창 비우기
  updateTodo();
};

// 전역 윈도우 객체에 할당하여 인라인 이벤트 호출 가능하게 함
window.toggleTodo = (i) => {
  todos[i].done = !todos[i].done;
  updateTodo();
};
window.deleteTodo = (i) => {
  todos.splice(i, 1);
  updateTodo();
};
document.getElementById("add-btn").onclick = addTodo;
todoInput.onkeydown = (e) => {
  if (e.key === "Enter") addTodo();
}; // 선택: Enter 추가 기능
document.getElementById("clear-done").onclick = () => {
  todos = todos.filter((t) => !t.done); // 완료되지 않은 항목만 남기기
  updateTodo();
};

/* CALCULATOR LOGIC */
let expression = "0";
const display = document.getElementById("calc-display");

// 부모 컨테이너에 하나의 리스너를 등록하는 이벤트 위임 방식
document.getElementById("calc-btns").onclick = (e) => {
  if (!e.target.matches("button")) return; // 버튼이 아닌 영역 클릭 시 무시
  const val = e.target.innerText;

  if (val === "C")
    expression = "0"; // 필수: 초기화 로직
  else if (val === "←")
    expression = expression.length > 1 ? expression.slice(0, -1) : "0";
  else if (val === "=") {
    try {
      // 필수: 0으로 나누기 예외 처리
      if (expression.includes("/0")) throw new Error("Infinity");

      // 화면상 기호를 연산 기호로 치환 후 계산
      let result = eval(
        expression.replace("÷", "/").replace("×", "*").replace("−", "-"),
      );
      expression = Number.isFinite(result) ? result.toString() : "Error";
    } catch {
      expression = "Error";
    }

    // 잘못된 수식 입력 시 에러 처리
  } else {
    if (expression === "0" || expression === "Error") expression = val;
    else expression += val;
  }
  display.innerText = expression;
};

/* STOPWATCH LOGIC */
let swInterval,
  swTime = 0,
  running = false,
  laps = [];
const swDisplay = document.getElementById("sw-display");
const lapList = document.getElementById("lap-list");

// 밀리초 데이터를 분:초:밀리초 문자열로 변환하는 유틸리티 함수
const formatTime = (ms) => {
  const m = Math.floor(ms / 60000)
    .toString()
    .padStart(2, "0");
  const s = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  const mss = Math.floor((ms % 1000) / 10)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}:${mss}`;
};

//
document.getElementById("sw-toggle").onclick = (e) => {
  if (!running) {
    running = true;
    e.target.innerText = "정지";
    e.target.className = "btn-stop";
    // 10밀리초마다 swTime을 10씩 증가시키며 화면 갱신
    swInterval = setInterval(() => {
      swTime += 10;
      swDisplay.innerText = formatTime(swTime);
    }, 10);
  } else {
    running = false;
    e.target.innerText = "시작";
    e.target.className = "btn-start";
    clearInterval(swInterval); // 타이머 중지
  }
};

// 랩 타임 기록 기능
document.getElementById("sw-lap").onclick = () => {
  if (swTime === 0) return;
  laps.unshift(formatTime(swTime)); // 최신 기록이 위로 오도록 배열 앞에 추가
  lapList.innerHTML = laps
    .map(
      (l, i) => `
        <li class="lap-item">
            <span class="lap-label">Lap ${laps.length - i}</span>
            <b>${l}</b>
        </li>
    `,
    )
    .join("");
};

document.getElementById("sw-reset").onclick = () => {
  clearInterval(swInterval); // 진행 중인 타이머 정지 후 초기화
  running = false;
  swTime = 0;
  laps = [];
  swDisplay.innerText = "00:00:00";
  lapList.innerHTML = "";
  const toggleBtn = document.getElementById("sw-toggle");
  toggleBtn.innerText = "시작";
  toggleBtn.className = "btn-start";
};
