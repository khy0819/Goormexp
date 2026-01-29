// 1. 초기 데이터 불러오기
let events = loadEvents();

const eventForm = document.getElementById('eventForm');
const eventList = document.getElementById('eventList');
const statsContainer = document.getElementById('stats');

// 2. 이벤트 리스너 등록
eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addEvent();
});

// 3. 기능 구현: 이벤트 추가
function addEvent() {
    const name = document.getElementById('eventName').value;
    const date = document.getElementById('eventDate').value;
    const category = document.getElementById('eventCategory').value;

    // 유효성 검사
    if (!name || !date) return;

    const targetDate = new Date(date);
    const tenYearsLater = new Date();
    tenYearsLater.setFullYear(tenYearsLater.getFullYear() + 10);

    if (targetDate > tenYearsLater) {
        alert("너무 먼 미래의 날짜입니다 (최대 10년).");
        return;
    }

    const isDuplicate = events.some(ev => ev.name === name && ev.date === date);
    if (isDuplicate) {
        alert("동일한 이름과 날짜의 이벤트가 이미 존재합니다.");
        return;
    }

    const newEvent = {
        id: Date.now(),
        name,
        date,
        category,
        createdAt: Date.now()
    };

    events.push(newEvent);
    if (saveEvents(events)) {
        render();
        eventForm.reset();
    }
}

// 4. 기능 구현: D-Day 및 경과율 계산
function calculateDday(targetDate) {
    const today = new Date();
    const target = new Date(targetDate);
    today.setHours(0,0,0,0);
    target.setHours(0,0,0,0);

    const diff = target - today;
    const daysDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (daysDiff > 0) return { text: `D-${daysDiff}`, isPast: false, days: daysDiff };
    if (daysDiff === 0) return { text: "D-Day", isPast: false, days: 0 };
    return { text: `D+${Math.abs(daysDiff)}`, isPast: true, days: daysDiff };
}

function calculateProgress(targetDate) {
    const target = new Date(targetDate);
    const start = new Date(target);
    start.setFullYear(start.getFullYear() - 1); // 1년 전을 0%로 기준
    const today = new Date();

    if (today < start) return "0%";
    if (today > target) return "100%";

    const total = target - start;
    const current = today - start;
    const percentage = Math.floor((current / total) * 100);
    return `${percentage}% 경과`;
}

// 5. 기능 구현: 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
}

// 6. 기능 구현: 저장 및 불러오기 (Try-Catch 적용)
function saveEvents(data) {
    try {
        localStorage.setItem('ddayEvents', JSON.stringify(data));
        return true;
    } catch (e) {
        alert("데이터 저장 용량이 부족하거나 오류가 발생했습니다.");
        return false;
    }
}

function loadEvents() {
    try {
        const data = localStorage.getItem('ddayEvents');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

// 7. 기능 구현: 렌더링 (통계 및 목록)
function render() {
    // 날짜순 정렬
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 통계 계산
    const totalCount = events.length;
    const upcoming = events.filter(ev => calculateDday(ev.date).isPast === false).length;
    const pastCount = totalCount - upcoming;

    statsContainer.innerHTML = `
        <span>전체: <b>${totalCount}</b></span>
        <span>다가오는: <b>${upcoming}</b></span>
        <span>지난: <b>${pastCount}</b></span>
    `;

    eventList.innerHTML = '';

    // 가장 가까운 이벤트 찾기 (하이라이트용)
    const futureEvents = events.filter(ev => calculateDday(ev.date).days >= 0);
    const nearestId = futureEvents.length > 0 ? futureEvents[0].id : null;

    events.forEach(ev => {
        const ddayInfo = calculateDday(ev.date);
        const progress = calculateProgress(ev.date);
        
        const li = document.createElement('li');
        li.className = `event-item ${ev.category} ${ddayInfo.isPast ? 'past' : ''} ${ev.id === nearestId ? 'highlight' : ''}`;
        
        li.innerHTML = `
            <div class="info">
                <h3>${ev.name}</h3>
                <p>${formatDate(ev.date)}</p>
                <button class="del-btn" onclick="deleteEvent(${ev.id})">삭제</button>
            </div>
            <div class="d-day-box">
                <span class="d-day-text">${ddayInfo.text}</span>
                <span class="progress-text">${progress}</span>
            </div>
        `;
        eventList.appendChild(li);
    });
}

function deleteEvent(id) {
    if (confirm("정말 삭제하시겠습니까?")) {
        events = events.filter(ev => ev.id !== id);
        saveEvents(events);
        render();
    }
}

// 초기 실행
render();