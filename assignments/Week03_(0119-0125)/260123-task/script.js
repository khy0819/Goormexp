/**
 * 1. TO-DO LIST LOGIC
 * 필수: 추가/삭제/완료 및 통계 데이터 바인딩
 */
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const totalCnt = document.getElementById("total-count");
const doneCnt = document.getElementById("done-count");
let todos = [];

function updateTodo() {
  todoList.innerHTML = "";
  todos.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${t.done ? "checked" : ""} onchange="toggleTodo(${i})">
            <span class="todo-text ${t.done ? "completed" : ""}" onclick="toggleTodo(${i})">${t.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${i})">🗑️</button>
        `;
    todoList.appendChild(li);
  });
  totalCnt.innerText = todos.length;
  doneCnt.innerText = todos.filter((t) => t.done).length;
}

const addTodo = () => {
  const text = todoInput.value.trim();
  if (!text) return; // 필수: 빈 문자열 방지
  todos.push({ text, done: false });
  todoInput.value = ""; // 필수: 추가 후 입력창 비움
  updateTodo();
};

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
};
document.getElementById("clear-done").onclick = () => {
  todos = todos.filter((t) => !t.done);
  updateTodo();
};

/**
 * 2. CALCULATOR LOGIC
 * 필수: 사칙연산, 초기화, 예외 처리
 */
let expression = "0";
const display = document.getElementById("calc-display");

document.getElementById("calc-btns").onclick = (e) => {
  if (!e.target.matches("button")) return;
  const val = e.target.innerText;

  if (val === "C") expression = "0";
  else if (val === "←")
    expression = expression.length > 1 ? expression.slice(0, -1) : "0";
  else if (val === "+/-") {
    if (expression !== "0" && expression !== "Error") {
      expression = expression.startsWith("-")
        ? expression.slice(1)
        : "-" + expression;
    }
  } else if (val === "=") {
    try {
      if (expression.includes("/0")) throw new Error("Infinity");
      let result = eval(
        expression.replace("÷", "/").replace("×", "*").replace("−", "-"),
      );
      expression = Number.isFinite(result) ? result.toString() : "Error";
    } catch {
      expression = "Error";
    }
  } else {
    if (expression === "0" || expression === "Error") expression = val;
    else expression += val;
  }
  display.innerText = expression;
};

/**
 * 3. STOPWATCH LOGIC
 * 필수: 시간 측정, 시작/정지 토글, 리셋, 랩 타임
 */
let swInterval,
  swTime = 0,
  running = false,
  laps = [];
const swDisplay = document.getElementById("sw-display");
const lapList = document.getElementById("lap-list");

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

document.getElementById("sw-toggle").onclick = (e) => {
  if (!running) {
    running = true;
    e.target.innerText = "정지";
    e.target.className = "btn-stop";
    swInterval = setInterval(() => {
      swTime += 10;
      swDisplay.innerText = formatTime(swTime);
    }, 10);
  } else {
    running = false;
    e.target.innerText = "시작";
    e.target.className = "btn-start";
    clearInterval(swInterval);
  }
};

document.getElementById("sw-lap").onclick = () => {
  if (swTime === 0) return;
  laps.unshift(formatTime(swTime));
  lapList.innerHTML = laps
    .map(
      (l, i) => `
        <li class="lap-item">
            <span style="color:var(--text-sub)">Lap ${laps.length - i}</span>
            <b>${l}</b>
        </li>
    `,
    )
    .join("");
};

document.getElementById("sw-reset").onclick = () => {
  clearInterval(swInterval);
  running = false;
  swTime = 0;
  laps = [];
  swDisplay.innerText = "00:00:00";
  lapList.innerHTML = "";
  const toggleBtn = document.getElementById("sw-toggle");
  toggleBtn.innerText = "시작";
  toggleBtn.className = "btn-start";
};
