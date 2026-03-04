const form = document.getElementById("event-form");
const eventList = document.getElementById("event-list");
const searchInput = document.getElementById("search-input");
const clearAllBtn = document.getElementById("clear-all-btn");

const totalCount = document.getElementById("total-count");
const upcomingCount = document.getElementById("upcoming-count");
const passedCount = document.getElementById("passed-count");

let events = JSON.parse(localStorage.getItem("ddayEvents")) || [];

function saveEvents() {
    localStorage.setItem("ddayEvents", JSON.stringify(events));
}

function calculateDDay(date) {
    const today = new Date();
    const target = new Date(date);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff;
}

function calculateProgress(date) {
    const today = new Date();
    const target = new Date(date);
    const start = new Date(today.getFullYear(), 0, 1);
    const total = target - start;
    const passed = today - start;
    let percent = (passed / total) * 100;
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    return percent;
}

function updateStats() {
    totalCount.textContent = events.length;
    const upcoming = events.filter(e => calculateDDay(e.date) >= 0).length;
    const passed = events.filter(e => calculateDDay(e.date) < 0).length;
    upcomingCount.textContent = upcoming;
    passedCount.textContent = passed;
}

function renderEvents(filter = "") {
    eventList.innerHTML = "";

    events
        .filter(e => e.name.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .forEach(event => {

            const dday = calculateDDay(event.date);
            const progress = calculateProgress(event.date).toFixed(1);

            const item = document.createElement("div");
            item.className = `event-item ${event.category}`;
            if (dday < 0) item.classList.add("passed");
            if (dday >= 0 && dday <= 3) item.classList.add("urgent");

            item.innerHTML = `
                <div class="event-info">
                    <span class="cat-tag">${event.category}</span>
                    <h3>${event.name}</h3>
                    <p>${event.date}</p>

                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${progress}%"></div>
                        </div>
                    </div>
                </div>

                <div class="d-day-tag">
                    ${dday < 0 ? `D+${Math.abs(dday)}` : dday === 0 ? "D-Day" : `D-${dday}`}
                </div>

                <button class="del-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke-width="2"
                         stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14H6L5 6"/>
                        <path d="M10 11v6"/>
                        <path d="M14 11v6"/>
                        <path d="M9 6V4h6v2"/>
                    </svg>
                </button>
            `;

            item.querySelector(".del-btn").addEventListener("click", () => {
                item.classList.add("removing");
                setTimeout(() => {
                    events = events.filter(e => e !== event);
                    saveEvents();
                    renderEvents(searchInput.value);
                    updateStats();
                }, 300);
            });

            eventList.appendChild(item);
        });

    updateStats();
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("event-name").value;
    const date = document.getElementById("event-date").value;
    const category = document.getElementById("event-category").value;

    events.push({ name, date, category });
    saveEvents();
    renderEvents();
    form.reset();
});

searchInput.addEventListener("input", () => {
    renderEvents(searchInput.value);
});

clearAllBtn.addEventListener("click", () => {
    if (confirm("전체 삭제하시겠습니까?")) {
        events = [];
        saveEvents();
        renderEvents();
    }
});

renderEvents();
