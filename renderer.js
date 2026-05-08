const { ipcRenderer } = require('electron');

const seal = document.getElementById('seal');

const IMG = {
  open:  'seal_eyes_open.png',
  sleep: 'seal.png',
  side:  'seal_looking_side.png',
};

// --- 상태 관리 ---
let state = 'awake'; // 'awake' | 'sleeping' | 'hovering' | 'clicking'
let currentTx = 0;
let isBreathing = true;

// --- 이미지 전환 (opacity fade로 깜빡임 없이) ---
function setImage(src) {
  if (seal.src.endsWith(src)) return;
  seal.style.opacity = '0';
  setTimeout(() => {
    seal.src = src;
    seal.style.opacity = '1';
  }, 80);
}

// --- 호흡 (모든 상태에서 계속) ---
function startBreathing() {
  if (seal.classList.contains('breathing')) return;
  seal.classList.add('breathing');
}

startBreathing();

// --- 우클릭 컨텍스트 메뉴 ---
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  ipcRenderer.send('show-context-menu');
});

// --- 좌우 슬쩍 이동 (10초마다 5px) ---
let targetTx = 5;

function nudgeHorizontal() {
  currentTx = targetTx;
  targetTx = targetTx === 5 ? -5 : 5;
  seal.style.setProperty('--tx', `${currentTx}px`);
}

setTimeout(() => {
  nudgeHorizontal();
  setInterval(nudgeHorizontal, 10000);
}, 10000);

// --- 1. 깜빡임 ---
let blinkTimer = null;

function scheduleNextBlink() {
  const delay = 5000 + Math.random() * 10000; // 5~15초
  blinkTimer = setTimeout(() => {
    if (state === 'awake') {
      setImage(IMG.sleep);
      setTimeout(() => {
        if (state === 'awake') setImage(IMG.open);
        scheduleNextBlink();
      }, 200);
    } else {
      scheduleNextBlink();
    }
  }, delay);
}

scheduleNextBlink();
setImage(IMG.open);

// --- 2. 자리 비움 / 졸기 모드 ---
let idleTimer = null;
const IDLE_TIMEOUT = 60000; // 60초

function resetIdle() {
  clearTimeout(idleTimer);
  if (state === 'sleeping') {
    state = 'awake';
    setImage(IMG.open);
    scheduleNextBlink();
  }
  idleTimer = setTimeout(() => {
    if (state === 'awake') {
      state = 'sleeping';
      clearTimeout(blinkTimer);
      setImage(IMG.sleep);
    }
  }, IDLE_TIMEOUT);
}

window.addEventListener('mousemove', resetIdle);
window.addEventListener('keydown', resetIdle);
resetIdle();

// --- 3. 마우스 호버 ---
seal.addEventListener('mouseenter', () => {
  if (state === 'clicking' || state === 'sleeping') return;
  state = 'hovering';
  setImage(IMG.side);
});

seal.addEventListener('mouseleave', () => {
  if (state === 'hovering') {
    state = 'awake';
    setImage(IMG.open);
  }
});

// --- 4. 클릭 반응 ---
seal.addEventListener('click', () => {
  if (state === 'sleeping') return;
  state = 'clicking';

  setImage(IMG.open);

  seal.classList.remove('breathing', 'jumping');
  void seal.offsetWidth;
  seal.classList.add('jumping');

  seal.addEventListener('animationend', () => {
    seal.classList.remove('jumping');
    startBreathing();
  }, { once: true });

  setTimeout(() => {
    state = 'awake';
    setImage(IMG.open);
  }, 1000);
});
