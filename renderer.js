const container = document.getElementById('seal-container');
const layers    = document.querySelectorAll('.seal-layer');

// --- 상태 머신 ---
const STATES = { IDLE: 'idle', BLINK: 'blink', LOOKING: 'looking', SLEEPING: 'sleeping' };

// sleeping 상태는 시각적으로 blink 레이어(눈 감은 모습)를 사용
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

// --- 드래그 (IPC 기반, -webkit-app-region 완전 제거) ---
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let hasMoved   = false;

container.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  hasMoved   = false;
  isDragging = true;
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  lastActivityTime = Date.now();
  if (currentState === STATES.SLEEPING) setState(STATES.IDLE);

  if (!isDragging) return;
  const dx = Math.abs(e.clientX - dragStartX);
  const dy = Math.abs(e.clientY - dragStartY);
  if (dx > 2 || dy > 2) {
    hasMoved = true;
    window.electron.dragWindow({ mouseX: e.clientX, mouseY: e.clientY });
  }
});

document.addEventListener('mouseup', (e) => {
  if (!isDragging || e.button !== 0) return;
  isDragging = false;
  if (!hasMoved) handleClick();
});

// --- 클릭 반응 (놀람 + 점프) ---
function handleClick() {
  if (currentState === STATES.SLEEPING) return;
  setState(STATES.IDLE);
  container.classList.remove('jumping');
  void container.offsetWidth; // reflow
  container.classList.add('jumping');
  container.addEventListener('animationend', () => {
    container.classList.remove('jumping');
  }, { once: true });
  setTimeout(() => {
    if (currentState !== STATES.SLEEPING) setState(STATES.IDLE);
  }, 1000);
}

// --- 우클릭 종료 메뉴 ---
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  window.electron.showContextMenu();
});

// --- 호버 ---
container.addEventListener('mouseenter', () => {
  if (isDragging || currentState === STATES.SLEEPING) return;
  setState(STATES.LOOKING);
});

container.addEventListener('mouseleave', () => {
  if (currentState === STATES.LOOKING) setState(STATES.IDLE);
});

// --- 깜빡임 (5~10초마다 0.12초) ---
function scheduleBlink() {
  const delay = 5000 + Math.random() * 5000;
  setTimeout(() => {
    if (currentState === STATES.IDLE && !isDragging) {
      setState(STATES.BLINK);
      setTimeout(() => {
        if (currentState === STATES.BLINK) setState(STATES.IDLE);
      }, 120);
    }
    scheduleBlink(); // 항상 다음 깜빡임 예약
  }, delay);
}

scheduleBlink();

// --- 졸기 모드 (60초 무활동) ---
let lastActivityTime = Date.now();

setInterval(() => {
  if (
    Date.now() - lastActivityTime > 60000 &&
    currentState !== STATES.SLEEPING &&
    !isDragging
  ) {
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
