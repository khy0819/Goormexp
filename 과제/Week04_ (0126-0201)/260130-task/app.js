const input = document.getElementById("searchInput");
const results = document.getElementById("results");
const statusEl = document.getElementById("status");
const observerEl = document.getElementById("observer");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

let timer;
let controller;
let page = 1;
let currentQuery = "";
let isLoading = false;
let lastQuery = "";

/* ======================
   디바운싱 (600ms)
====================== */
input.addEventListener("input", () => {
  const query = input.value.trim();

  if (query.length < 2) {
    statusEl.textContent = "검색어를 2글자 이상 입력하세요";
    results.innerHTML = "";
    return;
  }

  if (query === lastQuery) return;
  lastQuery = query;

  clearTimeout(timer);
  timer = setTimeout(() => {
    page = 1;
    currentQuery = query;
    results.innerHTML = "";
    searchBooks();
  }, 600);
});

/* ======================
   API 호출
====================== */
async function searchBooks() {
  if (isLoading) return;
  isLoading = true;

  if (controller) controller.abort();
  controller = new AbortController();

  statusEl.textContent = "검색 중...";

  try {
    const res = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(currentQuery)}&page=${page}`,
      { signal: controller.signal }
    );

    if (!res.ok) throw new Error();

    const data = await res.json();

    if (page === 1 && data.docs.length === 0) {
      statusEl.textContent = "검색 결과가 없습니다";
      isLoading = false;
      return;
    }

    renderBooks(data.docs.slice(0, 8));
    statusEl.textContent = `${data.numFound}개 검색 결과`;
    page++;

  } catch (e) {
    if (e.name !== "AbortError") {
      statusEl.textContent = "에러가 발생했습니다";
    }
  }

  isLoading = false;
}

/* ======================
   렌더링
====================== */
function renderBooks(books) {
  const fragment = document.createDocumentFragment();

  books.forEach(book => {
    const card = document.createElement("div");
    card.className = "card";

    let imageHTML = `<div class="no-image">📖</div>`;

    if (book.cover_i) {
      const imgURL = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
      imageHTML = `
        <img src="${imgURL}" 
             onerror="this.parentElement.innerHTML='<div class=no-image>📖</div>'">
      `;
    }

    card.innerHTML = `
      ${imageHTML}
      <h3>${book.title}</h3>
      <p>${book.author_name?.[0] || "저자 정보 없음"}</p>
      <p>${book.first_publish_year || ""}</p>
    `;

    card.onclick = () => openModal(book);
    fragment.appendChild(card);
  });

  results.appendChild(fragment);
}

/* ======================
   무한 스크롤
====================== */
const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && currentQuery) {
    searchBooks();
  }
});

observer.observe(observerEl);

/* ======================
   모달
====================== */
function openModal(book) {
  modalBody.innerHTML = `
    <h2>${book.title}</h2>
    <p><strong>저자:</strong> ${book.author_name?.join(", ") || "-"}</p>
    <p><strong>출판연도:</strong> ${book.first_publish_year || "-"}</p>
    <p><strong>출판사:</strong> ${book.publisher?.join(", ") || "-"}</p>
  `;
  modal.classList.remove("hidden");
}

closeModal.onclick = () => modal.classList.add("hidden");

modal.onclick = e => {
  if (e.target === modal) modal.classList.add("hidden");
};
