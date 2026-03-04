const input = document.getElementById("searchInput");
const results = document.getElementById("results");
const statusEl = document.getElementById("status");
const recentDropdown = document.getElementById("recentDropdown");
const recentList = document.getElementById("recentList");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

let timer; 
let controller; // 요구사항 7-4: 이전 요청 무시용 AbortController
let currentQuery = "";
let selectedIndex = -1; // 요구사항 7-2: 키보드 선택 인덱스

/* ======================
    요구사항 6: 검색 기록 관리 (localStorage) 
    ====================== */
// 요구사항 6-1: 검색 기록 저장
const getHistory = () => JSON.parse(localStorage.getItem("bookHistory") || "[]");
const saveHistory = (query) => {
    let history = getHistory();
    history = [query, ...history.filter(h => h !== query)].slice(0, 5);
    localStorage.setItem("bookHistory", JSON.stringify(history));
};

// 요구사항 6-2: 최근 검색어 표시 렌더링
const renderHistory = () => {
    const history = getHistory();
    if (history.length === 0) {
        recentList.innerHTML = '<li style="color:var(--text-sub); font-size:0.8rem;">최근 기록이 없습니다.</li>';
        return;
    }
    recentList.innerHTML = history.map(h => `<li>${h}</li>`).join("");
    setupListEvents(false); 
};

/* ======================
    요구사항 6-3: 검색어 자동완성 (추천 검색어)
====================== */
async function fetchSuggestions(query) {
    try {
        // 빠른 응답을 위해 limit 5개 제한
        const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        
        if (data.docs.length > 0) {
            recentList.innerHTML = data.docs.map(book => `
                <li class="suggestion-item">
                    <span style="display:block; font-size:0.95rem;">🔍 ${book.title}</span>
                    <small style="color:var(--text-sub); font-size:0.75rem;">${book.author_name?.[0] || '저자 미상'}</small>
                </li>
            `).join("");
            setupListEvents(true);
        }
    } catch (e) {
        console.error("추천 검색어 로드 실패");
    }
}

// 리스트 아이템(최근/추천) 클릭 시 검색 실행 공통 함수
function setupListEvents(isSuggestion) {
    const items = recentList.querySelectorAll("li");
    items.forEach(li => {
        li.onclick = (e) => {
            e.stopPropagation();
            const text = isSuggestion ? li.querySelector('span').innerText.replace('🔍 ', '') : li.innerText;
            input.value = text;
            initSearch(text);
            closeDropdown();
        };
    });
}

/* ======================
    요구사항 1, 2, 7-4: 검색 엔진 (디바운싱 & 취소)
====================== */
// 요구사항 1-2: 입력 즉시 검색
input.addEventListener("input", () => {
    const query = input.value.trim();

    // 요구사항 1-3: 최소 2글자 이상 검사
    if (query.length < 2) {
        statusEl.textContent = "검색어를 2글자 이상 입력하세요"; // 요구사항 3-1
        results.innerHTML = "";
        closeDropdown();
        return;
    }

    // 요구사항 2-1, 2-2, 2-3: 300ms 디바운싱 구현
    clearTimeout(timer);
    timer = setTimeout(() => {
        fetchSuggestions(query); // 요구사항 6-3 자동완성 호출
        initSearch(query);
    }, 300);
});

function initSearch(query) {
    currentQuery = query;
    results.innerHTML = "";
    saveHistory(query); // 요구사항 6-1 저장
    searchBooks();
}

async function searchBooks() {
    // 요구사항 7-4: 검색 중 새 검색어 입력 시 이전 요청 무시
    if (controller) controller.abort();
    controller = new AbortController();

    statusEl.textContent = "검색 중..."; // 요구사항 3-2: 로딩 중

    try {
        const res = await fetch(
            `https://openlibrary.org/search.json?title=${encodeURIComponent(currentQuery)}&limit=12`,
            { signal: controller.signal }
        );
        const data = await res.json();

        // 요구사항 3-4: 결과 없음 처리
        if (data.docs.length === 0) {
            statusEl.textContent = "검색 결과가 없습니다";
            return;
        }

        renderBooks(data.docs); // 요구사항 3-3: 결과 있음
        statusEl.textContent = `${data.numFound}개의 검색 결과`;
    } catch (e) {
        // 요구사항 3-5: 에러 발생 처리
        if (e.name !== "AbortError") {
            statusEl.textContent = "데이터를 불러오는 중 에러가 발생했습니다.";
        }
    }
}

/* ======================
    요구사항 4, 5: 렌더링 및 하이라이트
====================== */
function renderBooks(books) {
    results.innerHTML = "";
    books.forEach(book => {
        const card = document.createElement("div");
        card.className = "card"; // 요구사항 9-3: Hover 애니메이션 (CSS)

        // 요구사항 5-1: 검색어 하이라이트 처리
        const regex = new RegExp(`(${currentQuery})`, 'gi');
        const highlightedTitle = book.title.replace(regex, '<span class="highlight">$1</span>');

        // 요구사항 4-1: 표지 이미지 처리
        let imageHTML = book.cover_i 
            ? `<img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="cover">`
            : `<div class="no-image">📖</div>`;

        // 요구사항 4-2, 4-3, 4-4: 상세 정보 구성
        card.innerHTML = `
            ${imageHTML}
            <div class="card-body">
                <h3>${highlightedTitle}</h3>
                <p>👤 저자: ${book.author_name?.[0] || "저자 정보 없음"}</p>
                <p>🏢 출판: ${book.publisher?.[0] || "정보 없음"}</p>
                <p>📅 연도: ${book.first_publish_year || "정보 없음"}</p>
                <div class="desc">${book.first_sentence || "설명이 포함되지 않은 도서입니다."}</div>
            </div>
        `;

        // 요구사항 8-1: 도서 클릭 시 모달 열기
        card.onclick = () => openModal(book);
        results.appendChild(card);
    });
}

/* ======================
    요구사항 7: UX 편의 기능 (포커스, 키보드, ESC)
====================== */
// 요구사항 7-1: 검색창 포커스 시 드롭다운 활성화
input.onfocus = () => {
    recentDropdown.classList.remove("hidden");
    results.style.opacity = "0.4"; // 시각적 피드백
    if (input.value.trim().length < 2) {
        renderHistory(); // 최근 검색어 (6-2)
    } else {
        fetchSuggestions(input.value.trim()); // 자동완성 (6-3)
    }
};

function closeDropdown() {
    recentDropdown.classList.add("hidden");
    results.style.opacity = "1";
    selectedIndex = -1;
}

// 드롭다운 외부 클릭 시 닫기
window.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !recentDropdown.contains(e.target)) {
        closeDropdown();
    }
});

// 요구사항 7-2, 7-3: 키보드 제어
window.addEventListener("keydown", (e) => {
    // 요구사항 7-3: ESC 키로 초기화
    if (e.key === "Escape") {
        input.value = "";
        results.innerHTML = "";
        statusEl.textContent = "검색어를 입력하세요";
        closeDropdown();
        if (modal) modal.classList.add("hidden");
    }

    // 요구사항 7-2: 화살표 키 네비게이션
    if (!recentDropdown.classList.contains("hidden")) {
        const items = recentList.querySelectorAll("li");
        if (e.key === "ArrowDown") {
            selectedIndex = (selectedIndex + 1) % items.length;
            updateSelection(items);
        } else if (e.key === "ArrowUp") {
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            updateSelection(items);
        } else if (e.key === "Enter" && selectedIndex > -1) {
            const selectedText = items[selectedIndex].querySelector('span') 
                ? items[selectedIndex].querySelector('span').innerText.replace('🔍 ', '')
                : items[selectedIndex].innerText;
            input.value = selectedText;
            initSearch(selectedText);
            closeDropdown();
        }
    }
});

function updateSelection(items) {
    items.forEach((item, idx) => item.classList.toggle("selected", idx === selectedIndex));
}

/* ======================
    요구사항 8: 상세 모달 및 이동
====================== */
function openModal(book) {
    // 요구사항 8-1: 상세 정보 모달
    // 요구사항 8-2: 상세 페이지 이동 (Open Library 링크)
    modalBody.innerHTML = `
        <h2 style="color:var(--accent);">${book.title}</h2>
        <p><strong>저자:</strong> ${book.author_name?.join(", ") || "정보 없음"}</p>
        <p><strong>출판 연도:</strong> ${book.first_publish_year || "정보 없음"}</p>
        <p><strong>출판사:</strong> ${book.publisher?.slice(0, 3).join(", ") || "정보 없음"}</p>
        <hr style="border:0.5px solid var(--border); margin:20px 0;">
        <p style="font-size:0.9rem; color:var(--text-sub);">상세 정보 조회를 위해 외부 페이지로 이동하시겠습니까?</p>
        <button onclick="window.open('https://openlibrary.org${book.key}')" 
                style="margin-top:10px; width:100%; padding:12px; background:var(--accent); border:none; border-radius:8px; cursor:pointer; color:white; font-weight:bold;">
                Open Library에서 상세 보기
        </button>
    `;
    modal.classList.remove("hidden");
}

closeModal.onclick = () => modal.classList.add("hidden");
window.onclick = (e) => { if (e.target === modal) modal.classList.add("hidden"); };

// 최근 검색어 기록 전체 삭제
document.getElementById("clearHistory").onclick = (e) => {
    e.stopPropagation();
    localStorage.removeItem("bookHistory");
    renderHistory();
    closeDropdown();
};