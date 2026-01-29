const API_URL = "http://54.180.25.65:3030/api/messages";
let myNickname = "";
let lastId = 0;
let pollTimer = null;
let isTyping = false;
let typingTimeout = null;

// DOM 요소
const loginSection = document.getElementById('login-section');
const chatSection = document.getElementById('chat-section');
const chatWindow = document.getElementById('chat-window');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const nicknameInput = document.getElementById('nickname-input');

// 요구사항 1-1, 1-2, 1-3
document.getElementById('login-btn').addEventListener('click', login);
nicknameInput.addEventListener('keypress', (e) => e.key === 'Enter' && login());

function login() {
    const val = nicknameInput.value.trim();
    if (val.length < 2 || val.length > 20) return alert("닉네임은 2~20자 사이여야 합니다.");
    myNickname = val;
    localStorage.setItem('chat-nick', myNickname);
    enterChatRoom();
}

async function enterChatRoom() {
    loginSection.classList.add('hidden');
    chatSection.classList.remove('hidden');
    document.getElementById('room-title').innerText = `채팅방 - ${myNickname}`;
    // 요구사항 2-1, 6-2
    await fetchInitialMessages();
    // 요구사항 4-1
    startPolling();
    // 요구사항 8-1 알림 권한
    if (Notification.permission !== "granted") Notification.requestPermission();
}

async function fetchInitialMessages() {
    try {
        const res = await fetch(`${API_URL}?limit=50`);
        const result = await res.json();
        if (result.success) {
            // 요구사항 5-1
            document.getElementById('loading-spinner')?.remove();
            // 요구사항 2-2
            const data = result.data.reverse();
            data.forEach(msg => renderMessage(msg));
            if (data.length > 0) lastId = data[data.length - 1].id;
            scrollToBottom();
        }
    } catch (err) { showSystemMsg("요구사항 5-4: 연결 오류"); }
}

// 요구사항 3-1, 3-2, 3-3, 3-4, 5-2
messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = messageInput.value.trim();
    if (!content) return;
    try {
        sendBtn.disabled = true;
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname: myNickname, content })
        });
        if (res.ok) {
            messageInput.value = "";
            messageInput.focus();
        }
    } catch (err) { alert("요구사항 8-3: 다시 시도"); }
    finally { sendBtn.disabled = false; }
});

// 요구사항 4-1, 4-2, 6-1, 8-1, 8-2
function startPolling() {
    pollTimer = setInterval(async () => {
        try {
            const res = await fetch(`${API_URL}/new?after=${lastId}`);
            const result = await res.json();
            if (result.success && result.data.length > 0) {
                result.data.forEach(msg => {
                    renderMessage(msg);
                    if (document.hidden && msg.nickname !== myNickname) {
                        new Notification("새 메시지", { body: `${msg.nickname}: ${msg.content}` });
                    }
                });
                lastId = result.data[result.data.length - 1].id;
                scrollToBottom();
            }
            // 요구사항 8-2 시뮬레이션
            const stats = await fetch(`${API_URL}/stats`).then(r => r.json());
            document.getElementById('typing-display').classList.toggle('hidden', stats.data.activeUsers <= 1);
        } catch (e) { console.error(e); }
    }, 3000);
}

// 요구사항 2-3, 2-4, 7-1, 7-2, 9-1, 9-2, 10-2, 10-4
function renderMessage(msg) {
    const isMine = msg.nickname === myNickname;
    const time = new Date(msg.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    const row = document.createElement('div');
    row.className = `bubble-row ${isMine ? 'mine' : 'other'} fade-in`;
    row.dataset.id = msg.id;

    // 요구사항 9-1, 9-2
    const imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i;
    let contentHTML = msg.content;
    if (imageRegex.test(msg.content)) {
        contentHTML = `<img src="${msg.content}" class="chat-img" onclick="window.open(this.src)">`;
    }

    // 요구사항 10-4
    const color = `hsl(${msg.nickname.length * 137 % 360}, 60%, 40%)`;

    row.innerHTML = `
        ${!isMine ? `<span class="nick-label" style="color:${color}">${msg.nickname}</span>` : ''}
        <div class="bubble-container">
            ${isMine ? `<button class="del-btn" onclick="deleteMsg(${msg.id})">✕</button>` : ''}
            <div class="bubble" onclick="copyText('${msg.content}')">${contentHTML}</div>
        </div>
        <span class="time-label">${time}</span>
    `;
    chatWindow.appendChild(row);
}

// 요구사항 7-1, 7-2, 9-3, 7-3, 4-3 관련 유틸리티
async function deleteMsg(id) {
    if (confirm("삭제?")) {
        await fetch(`${API_URL}/${id}?nickname=${myNickname}`, { method: 'DELETE' });
        document.querySelector(`[data-id="${id}"]`).remove();
    }
}
function copyText(t) { navigator.clipboard.writeText(t).then(() => alert("복사됨")); }
document.getElementById('search-input').addEventListener('input', (e) => {
    const term = e.target.value;
    document.querySelectorAll('.bubble').forEach(b => {
        b.innerHTML = term ? b.textContent.replace(term, `<span class="highlight">${term}</span>`) : b.textContent;
    });
});
document.getElementById('emoji-open-btn').addEventListener('click', () => document.getElementById('emoji-picker').classList.toggle('hidden'));
document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        messageInput.value += btn.textContent;
        document.getElementById('emoji-picker').classList.add('hidden');
    });
});
function scrollToBottom() { chatWindow.scrollTop = chatWindow.scrollHeight; }
function showSystemMsg(t) { chatWindow.innerHTML += `<div class="system-msg">${t}</div>`; }
document.getElementById('back-btn').addEventListener('click', () => { clearInterval(pollTimer); location.reload(); });