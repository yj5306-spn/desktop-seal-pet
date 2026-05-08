const container = document.getElementById('seal-container');
const layers    = document.querySelectorAll('.seal-layer');

// --- 상태 머신 ---
const STATES = { IDLE: 'idle', BLINK: 'blink', LOOKING: 'looking', SLEEPING: 'sleeping' };

// sleeping은 시각적으로 blink 레이어(눈 감은 모습) 사용
const STATE_LAYER = {
  [STATES.IDLE]:     'idle',
  [STATES.BLINK]:    'blink',
  [STATES.LOOKING]:  'looking',
  [STATES.SLEEPING]: 'blink',
};

let currentState = STATES.IDLE;

function setState(newState) {
  if (newState === currentState) return;
  console.log(`[seal] ${currentState} → ${newState}`);
  const target = STATE_LAYER[newState] || 'idle';
  layers.forEach(img => img.classList.toggle('active', img.dataset.state === target));
  currentState = newState;
}

// --- 우클릭 종료 메뉴 ---
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  window.electron.showContextMenu();
});

// --- 호버 (mouseenter/mouseleave는 -webkit-app-region: drag와 충돌 없음) ---
container.addEventListener('mouseenter', () => {
  if (currentState === STATES.SLEEPING) return;
  setState(STATES.LOOKING);
});

container.addEventListener('mouseleave', () => {
  if (currentState === STATES.LOOKING) setState(STATES.IDLE);
});

// --- 깜빡임 (5~10초마다 120ms, idle 상태에서만) ---
function scheduleBlink() {
  const delay = 5000 + Math.random() * 5000;
  setTimeout(() => {
    if (currentState === STATES.IDLE) {
      setState(STATES.BLINK);
      setTimeout(() => {
        if (currentState === STATES.BLINK) setState(STATES.IDLE);
      }, 120);
    }
    scheduleBlink();
  }, delay);
}

scheduleBlink();

// --- 졸기 모드 (60초 무활동) ---
let lastActivityTime = Date.now();

document.addEventListener('mousemove', () => {
  lastActivityTime = Date.now();
  if (currentState === STATES.SLEEPING) setState(STATES.IDLE);
});

setInterval(() => {
  if (Date.now() - lastActivityTime > 60000 && currentState !== STATES.SLEEPING) {
    setState(STATES.SLEEPING);
  }
}, 1000);

// --- 좌우 슬쩍 이동 (10초마다 5px) ---
let currentTx = 0;
let targetTx  = 5;

function nudgeHorizontal() {
  currentTx = targetTx;
  targetTx  = targetTx === 5 ? -5 : 5;
  container.style.setProperty('--tx', `${currentTx}px`);
}

setTimeout(() => {
  nudgeHorizontal();
  setInterval(nudgeHorizontal, 10000);
}, 10000);
