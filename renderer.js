const { ipcRenderer } = require('electron');

// --- 레이어 요소 ---
const layers = {
  idle:    document.getElementById('img-idle'),
  blink:   document.getElementById('img-blink'),
  looking: document.getElementById('img-looking'),
};
const container = document.getElementById('container');

// 현재 상태: 'idle' | 'blinking' | 'looking' | 'clicked' | 'sleeping'
let state = 'idle';

function log(s) {
  console.log(`[seal] state: ${s}`);
}

// --- 레이어 전환 (active 클래스 토글) ---
function showLayer(name) {
  Object.values(layers).forEach((el) => el.classList.remove('active'));
  if (layers[name]) layers[name].classList.add('active');
}

// --- 호흡 애니메이션: idle 레이어에만 적용 ---
layers.idle.classList.add('breathing');

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
  Object.values(layers).forEach((el) =>
    el.style.setProperty('--tx', `${currentTx}px`)
  );
}

setTimeout(() => {
  nudgeHorizontal();
  setInterval(nudgeHorizontal, 10000);
}, 10000);

// --- 깜빡임 (5~10초마다 0.12초) ---
let blinkTimer = null;

function scheduleNextBlink() {
  clearTimeout(blinkTimer);
  const delay = 5000 + Math.random() * 5000;
  blinkTimer = setTimeout(() => {
    if (state !== 'idle') {
      scheduleNextBlink();
      return;
    }
    state = 'blinking';
    log('blinking');
    showLayer('blink');

    setTimeout(() => {
      if (state === 'blinking') {
        state = 'idle';
        log('idle');
        showLayer('idle');
        scheduleNextBlink();
      }
    }, 120);
  }, delay);
}

showLayer('idle');
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
    showLayer('idle');
    scheduleNextBlink();
  }
  idleTimer = setTimeout(() => {
    if (state === 'idle' || state === 'blinking') {
      clearTimeout(blinkTimer);
      state = 'sleeping';
      log('sleeping');
      showLayer('blink'); // 눈 감은 레이어 = blink
    }
  }, IDLE_TIMEOUT);
}

window.addEventListener('mousemove', resetIdle);
window.addEventListener('keydown',   resetIdle);
resetIdle();

// --- 마우스 호버 ---
container.addEventListener('mouseenter', () => {
  if (state === 'sleeping' || state === 'clicked') return;
  clearTimeout(blinkTimer);
  state = 'looking';
  log('looking');
  showLayer('looking');
});

container.addEventListener('mouseleave', () => {
  if (state === 'looking') {
    state = 'idle';
    log('idle');
    showLayer('idle');
    scheduleNextBlink();
  }
});

// --- 클릭 반응 (놀람 + 점프) ---
container.addEventListener('click', () => {
  if (state === 'sleeping') return;
  clearTimeout(blinkTimer);
  state = 'clicked';
  log('clicked');
  showLayer('idle');

  const activeLayer = layers.idle;
  activeLayer.classList.remove('breathing', 'jumping');
  void activeLayer.offsetWidth; // reflow
  activeLayer.classList.add('jumping');

  activeLayer.addEventListener('animationend', () => {
    activeLayer.classList.remove('jumping');
    activeLayer.classList.add('breathing');
  }, { once: true });

  setTimeout(() => {
    if (state === 'clicked') {
      state = 'idle';
      log('idle');
      showLayer('idle');
      scheduleNextBlink();
    }
  }, 1000);
});
