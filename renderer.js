const { ipcRenderer } = require('electron');

const seal = document.getElementById('seal');

// --- 우클릭 컨텍스트 메뉴 ---
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  ipcRenderer.send('show-context-menu');
});

// --- 좌우 슬쩍 움직임 (10초마다 5px) ---
let currentTx = 0;
let targetTx = 5;

function nudgeHorizontal() {
  currentTx = targetTx;
  targetTx = targetTx === 5 ? -5 : 5;

  seal.style.setProperty('--tx', `${currentTx}px`);

  if (!seal.classList.contains('breathing')) {
    seal.style.transform = `translateX(${currentTx}px) scale(1)`;
  }
}

// 처음 10초 후 시작, 이후 10초마다 반복
setTimeout(() => {
  nudgeHorizontal();
  setInterval(nudgeHorizontal, 10000);
}, 10000);

// --- 호흡 애니메이션 (30초마다) ---
function triggerBreathe() {
  if (seal.classList.contains('breathing')) return;

  seal.style.setProperty('--tx', `${currentTx}px`);
  seal.classList.add('breathing');

  seal.addEventListener(
    'animationend',
    () => {
      seal.classList.remove('breathing');
      seal.style.transform = `translateX(${currentTx}px) scale(1)`;
    },
    { once: true }
  );
}

setTimeout(() => {
  triggerBreathe();
  setInterval(triggerBreathe, 30000);
}, 30000);
