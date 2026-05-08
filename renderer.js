const { ipcRenderer } = require('electron');

const seal = document.getElementById('seal');

const IMG = {
  open:  'seal_eyes_open.png',
  sleep: 'seal.png',
  side:  'seal_looking_side.png',
};

// 현재 상태: 'idle' | 'blinking' | 'looking' | 'clicked' | 'sleeping'
let state = 'idle';

function log(s) {
  console.log(`[seal] state: ${s}`);
}

// --- 이미지 전환 (opacity fade) ---
function setImage(src) {
  if (seal.src.endsWith(src)) return;
  seal.style.opacity = '0';
  setTimeout(() => {
    seal.src = src;
    seal.style.opacity = '1';
  }, 75);
}

// --- 호흡 애니메이션 시작 ---
seal.classList.add('breathing');

// --- 우클릭 컨텍스트 메뉴 ---
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  ipcRenderer.send('show-context-menu');
});

// --- 좌우 슬쩍 이동 (10초마다 5px) ---
let currentTx = 0;
let targetTx  = 5;

function nudgeHorizontal() {
  currentTx = targetTx;
  targetTx  = targetTx === 5 ? -5 : 5;
  seal.style.setProperty('--tx', `${currentTx}px`);
}

setTimeout(() => {
  nudgeHorizontal();
  setInterval(nudgeHorizontal, 10000);
}, 10000);

// --- 깜빡임 ---
let blinkTimer = null;

function scheduleNextBlink() {
  clearTimeout(blinkTimer);
  const delay = 5000 + Math.random() * 5000; // 5~10초 랜덤 간격
  blinkTimer = setTimeout(() => {
    if (state !== 'idle') {
      scheduleNextBlink();
      return;
    }
    state = 'blinking';
    log('blinking');
    setImage(IMG.sleep);

    // 눈 감은 상태는 0.12초만 유지
    setTimeout(() => {
      if (state === 'blinking') {
        state = 'idle';
        log('idle');
        setImage(IMG.open);
        scheduleNextBlink();
      }
    }, 120);
  }, delay);
}

// 초기화
setImage(IMG.open);
log('idle');
scheduleNextBlink();

// --- 졸기 모드 (60초 자리 비움) ---
let idleTimer = null;
const IDLE_TIMEOUT = 60000;

function resetIdle() {
  clearTimeout(idleTimer);
  if (state === 'sleeping') {
    state = 'idle';
    log('idle');
    setImage(IMG.open);
    scheduleNextBlink();
  }
  idleTimer = setTimeout(() => {
    if (state === 'idle' || state === 'blinking') {
      clearTimeout(blinkTimer);
      state = 'sleeping';
      log('sleeping');
      setImage(IMG.sleep);
    }
  }, IDLE_TIMEOUT);
}

window.addEventListener('mousemove', resetIdle);
window.addEventListener('keydown',   resetIdle);
resetIdle();

// --- 마우스 호버 ---
seal.addEventListener('mouseenter', () => {
  if (state === 'sleeping' || state === 'clicked') return;
  clearTimeout(blinkTimer); // 호버 중 깜빡임 일시 중지
  state = 'looking';
  log('looking');
  setImage(IMG.side);
});

seal.addEventListener('mouseleave', () => {
  if (state === 'looking') {
    state = 'idle';
    log('idle');
    setImage(IMG.open);
    scheduleNextBlink(); // 호버 해제 후 깜빡임 재개
  }
});

// --- 클릭 반응 (놀람 + 점프) ---
seal.addEventListener('click', () => {
  if (state === 'sleeping') return;
  clearTimeout(blinkTimer);
  state = 'clicked';
  log('clicked');
  setImage(IMG.open);

  seal.classList.remove('breathing', 'jumping');
  void seal.offsetWidth; // reflow
  seal.classList.add('jumping');

  seal.addEventListener('animationend', () => {
    seal.classList.remove('jumping');
    seal.classList.add('breathing');
  }, { once: true });

  setTimeout(() => {
    if (state === 'clicked') {
      state = 'idle';
      log('idle');
      setImage(IMG.open);
      scheduleNextBlink();
    }
  }, 1000);
});
