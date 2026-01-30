let events = [];

// [요구사항 1-4] 데이터 불러오기 및 에러 처리
function init() {
    try {
        const data = localStorage.getItem('ddayEvents');
        events = data ? JSON.parse(data) : [];
        render();
    } catch (e) {
        console.error("데이터 로드 실패:", e);
        events = [];
        render();
    }
}

// [요구사항 1-2] D-Day 및 경과율 계산
function getDdayInfo(targetDateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDateStr);
    target.setHours(0, 0, 0, 0);

    const diff = target - today;
    const daysDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    // 경과율 (1년 전 기준 0%)
    const start = new Date(target);
    start.setFullYear(start.getFullYear() - 1);
    const total = target - start;
    const elapsed = today - start;
    const progress = Math.min(100, Math.max(0, (elapsed / total) * 100)).toFixed(0);

    let dDayText = daysDiff > 0 ? `D-${daysDiff}` : (daysDiff === 0 ? "D-Day" : `D+${Math.abs(daysDiff)}`);
    return { dDayText, daysDiff, progress };
}

// [요구사항 1-1, 1-6] 이벤트 추가 및 유효성 검사
document.getElementById('event-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('event-name').value.trim();
    const date = document.getElementById('event-date').value;
    const category = document.getElementById('event-category').value;

    if (!name || !date) return alert("값을 모두 입력해주세요.");

    // 유효성 검사: 10년 후 체크
    const tenYearsLater = new Date();
    tenYearsLater.setFullYear(tenYearsLater.getFullYear() + 10);
    if (new Date(date) > tenYearsLater) return alert("너무 먼 미래의 날짜입니다 (최대 10년)");

    // 중복 체크
    if (events.some(ev => ev.name === name && ev.date === date)) return alert("중복된 이벤트가 있습니다.");

    const newEvent = { id: Date.now(), name, date, category, createdAt: Date.now() };
    events.push(newEvent);
    save();
});

function save() {
    try {
        localStorage.setItem('ddayEvents', JSON.stringify(events));
        render();
    } catch (e) {
        alert("저장에 실패했습니다.");
    }
}

// [요구사항 1-3, 1-5, 2] 렌더링 및 필터링
function render() {
    const list = document.getElementById('event-list');
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    // 정렬 (날짜순)
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    let html = '';
    let upcomingCount = 0;
    let passedCount = 0;

    const filtered = events.filter(ev => ev.name.toLowerCase().includes(searchTerm));

    filtered.forEach((ev, index) => {
        const { dDayText, daysDiff, progress } = getDdayInfo(ev.date);
        const isPassed = daysDiff < 0;
        const isHighlight = !isPassed && upcomingCount === 0 && searchTerm === ''; // 가장 가까운 미래 이벤트

        if (isPassed) passedCount++; else upcomingCount++;

        html += `
            <div class="event-item ${ev.category} ${isPassed ? 'passed' : ''} ${isHighlight ? 'highlight' : ''}">
                <div>
                    <small>${ev.category}</small>
                    <h3 style="margin: 5px 0;">${ev.name}</h3>
                    <div style="font-size: 0.8rem; color: var(--gray);">${ev.date}</div>
                    <div class="progress-bar"><div class="progress-fill" style="width: ${progress}%"></div></div>
                    <small>${progress}% 경과</small>
                </div>
                <div style="text-align: right;">
                    <div class="d-day-tag">${dDayText}</div>
                    <button onclick="deleteEvent(${ev.id})" style="background:none; border:none; color:var(--danger); cursor:pointer;">삭제</button>
                </div>
            </div>
        `;
    });

    list.innerHTML = html;
    document.getElementById('total-count').innerText = events.length;
    document.getElementById('upcoming-count').innerText = upcomingCount;
    document.getElementById('passed-count').innerText = passedCount;
}

function deleteEvent(id) {
    if (!confirm("정말 삭제할까요?")) return;
    events = events.filter(ev => ev.id !== id);
    save();
}

document.getElementById('search-input').addEventListener('input', render);
document.getElementById('clear-all-btn').addEventListener('click', () => {
    if(confirm("전체 삭제하시겠습니까?")) { events = []; save(); }
});

init();