// hud.js
// Логика HUD-интерфейса для игрока
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getDatabase, ref, onValue, set, push } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js';

// Проверка авторизации
const playerNumber = localStorage.getItem('playerNumber');
if (!playerNumber) {
  window.location.href = 'login.html';
}

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCv0aQq6jTRdPPcTi8yjH4K9goky1IcHqQ',
  authDomain: 'among-us-3c0e0.firebaseapp.com',
  databaseURL: 'https://among-us-3c0e0-default-rtdb.firebaseio.com',
  projectId: 'among-us-3c0e0',
  storageBucket: 'among-us-3c0e0.firebasestorage.app',
  messagingSenderId: '430810539681',
  appId: '1:430810539681:web:6b87449fd40e17cb0b72e0'
};

// Инициализация
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Элементы HUD
const statusValue = document.getElementById('player-status');
const timerBox = document.getElementById('timer-box');
const taskList = document.getElementById('task-list');
const voteBtn = document.getElementById('vote-btn');
const voteNotice = document.getElementById('vote-notice');

// Подписка на данные игрока
const playerRef = ref(db, `players/${playerNumber}`);
onValue(playerRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;
  statusValue.textContent = data.status === 'alive' ? 'Живой' : 'Мёртвый';
  taskList.innerHTML = '';
  (data.tasks || []).forEach(task => {
    const li = document.createElement('li');
    li.textContent = task;
    taskList.appendChild(li);
  });
});

// Кулдаун голосования
let cooldown = 0;
function startCooldown(seconds) {
  cooldown = seconds;
  voteBtn.disabled = true;
  updateTimer();
  const interval = setInterval(() => {
    cooldown--;
    updateTimer();
    if (cooldown <= 0) {
      clearInterval(interval);
      voteBtn.disabled = false;
      timerBox.textContent = 'Готово';
      voteNotice.textContent = '';
    }
  }, 1000);
}

function updateTimer() {
  const min = String(Math.floor(cooldown / 60)).padStart(2, '0');
  const sec = String(cooldown % 60).padStart(2, '0');
  timerBox.textContent = `${min}:${sec}`;
  voteNotice.textContent = `ГОЛОСОВАНИЕ ЧЕРЕЗ ${Math.ceil(cooldown / 60)} МИН.`;
}

voteBtn.addEventListener('click', () => {
  const voteRef = push(ref(db, 'votes'));
  set(voteRef, {
    from: playerNumber,
    timestamp: Date.now(),
    voteTarget: null
  });
  startCooldown(300);
});