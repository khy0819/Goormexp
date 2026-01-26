// --- 1. To-Do List 로직 [cite: 43, 44] ---
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const totalCount = document.getElementById("total-count");
const doneCount = document.getElementById("done-count");

document.getElementById("add-btn").onclick = () => {
  if (!todoInput.value.trim()) return; // 빈 문자열 방지 [cite: 22]

  const li = document.createElement("li");
  li.className = "todo-item";
  li.innerHTML = `
        <span class="text">${todoInput.value}</span>
        <div>
            <button class="done-btn">완료</button>
            <button class="del-btn">삭제</button>
        </div>
    `;

  // 완료/삭제 이벤트
  li.querySelector(".done-btn").onclick = () => {
    li.querySelector(".text").classList.toggle("completed"); // 토글 [cite: 30, 47]
    updateStats();
  };
  li.querySelector(".del-btn").onclick = () => {
    li.remove(); // 삭제 [cite: 33]
    updateStats();
  };

  todoList.appendChild(li);
  todoInput.value = ""; // 입력창 초기화 [cite: 23]
  updateStats();
};

function updateStats() {
  totalCount.textContent = todoList.children.length;
  doneCount.textContent = todoList.querySelectorAll(".completed").length;
}

// --- 2. 계산기 로직 [cite: 78, 104] ---
const calcDisplay = document.getElementById("calc-display");
let currentInput = "0";

document.querySelector(".calc-buttons").onclick = (e) => {
  const val = e.target.innerText;
  if (!e.target.matches("button")) return;

  if (val === "C")
    currentInput = "0"; // 초기화 [cite: 85]
  else if (val === "=") {
    try {
      currentInput = eval(currentInput).toString();
    } catch {
      // 계산 실행
      currentInput = "Error";
    } // 예외 처리 [cite: 88]
  } else {
    if (currentInput === "0") currentInput = val;
    else currentInput += val;
  }
  calcDisplay.innerText = currentInput;
};

// --- 3. 스톱워치 로직 [cite: 151, 152] ---
let timer,
  ms = 0;
const swDisplay = document.getElementById("stopwatch-display");

document.getElementById("sw-start").onclick = (e) => {
  if (e.target.innerText === "시작") {
    e.target.innerText = "정지"; // 상태 변경 [cite: 133]
    timer = setInterval(() => {
      ms += 10;
      let m = Math.floor(ms / 60000)
        .toString()
        .padStart(2, "0");
      let s = Math.floor((ms % 60000) / 1000)
        .toString()
        .padStart(2, "0");
      let mil = Math.floor((ms % 1000) / 10)
        .toString()
        .padStart(2, "0"); // --- To-Do List ---
      const todoInput = document.getElementById("todo-input");
      const todoList = document.getElementById("todo-list");

      todoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && todoInput.value.trim() !== "") {
          const li = document.createElement("li");
          li.className = "todo-item";
          li.innerHTML = `
            <input type="checkbox">
            <span>${todoInput.value}</span>
        `;
          li.querySelector("input").onchange = (e) => {
            li.querySelector("span").classList.toggle(
              "completed",
              e.target.checked,
            );
          };
          todoList.appendChild(li);
          todoInput.value = "";
        }
      });

      // --- Calculator (Simple Logic) ---
      let calcVal = "0";
      const calcDisplay = document.getElementById("calc-display");

      document.querySelector(".calc-grid").onclick = (e) => {
        if (!e.target.matches("button")) return;
        const key = e.target.innerText;

        if (key === "C") calcVal = "0";
        else if (key === "=") {
          calcVal = eval(
            calcVal.replace("÷", "/").replace("×", "*").replace("−", "-"),
          ).toString();
        } else {
          calcVal = calcVal === "0" ? key : calcVal + key;
        }
        calcDisplay.innerText = calcVal;
      };

      // --- Stopwatch ---
      let timer,
        startTime,
        elapsedTime = 0;
      const timeDisplay = document.getElementById("sw-time");

      document.getElementById("sw-start").onclick = (e) => {
        if (e.target.innerText === "Start") {
          e.target.innerText = "Stop";
          startTime = Date.now() - elapsedTime;
          timer = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            let ms = Math.floor((elapsedTime % 1000) / 10);
            let s = Math.floor((elapsedTime / 1000) % 60);
            let m = Math.floor(elapsedTime / 60000);
            timeDisplay.innerText = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}:${ms.toString().padStart(2, "0")}`;
          }, 10);
        } else {
          e.target.innerText = "Start";
          clearInterval(timer);
        }
      };

      document.getElementById("sw-reset").onclick = () => {
        clearInterval(timer);
        elapsedTime = 0;
        timeDisplay.innerText = "00:00:00";
        document.getElementById("sw-start").innerText = "Start";
      };
      swDisplay.innerText = `${m}:${s}:${mil}`; // 포맷팅 [cite: 156]
    }, 10);
  } else {
    e.target.innerText = "시작";
    clearInterval(timer);
  }
};

document.getElementById("sw-reset").onclick = () => {
  clearInterval(timer);
  ms = 0;
  swDisplay.innerText = "00:00:00"; // 리셋 [cite: 138]
  document.getElementById("sw-start").innerText = "시작";
  document.getElementById("lap-list").innerHTML = "";
};
