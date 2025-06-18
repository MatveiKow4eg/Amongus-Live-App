// login.js
// Логика экрана входа

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  startBtn.addEventListener('click', () => {
    const num = document.getElementById('player-input').value;
    if (num >= 1 && num <= 60) {
      localStorage.setItem('playerNumber', num);
      window.location.href = 'index.html';
    } else {
      alert('Введите корректный номер от 1 до 60.');
    }
  });
});