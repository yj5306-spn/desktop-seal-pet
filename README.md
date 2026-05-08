# 🦭 Seal Widget

귀여운 물범이 바탕화면 위에 떠있는 Electron 데스크톱 위젯입니다.

## 기능

- 투명한 배경, 테두리 없음
- 항상 모든 창 위에 떠있음
- 작업표시줄에 표시되지 않음
- 마우스로 드래그해서 위치 이동
- 우클릭 → 종료
- 10초마다 좌우로 슬쩍 움직임
- 호흡 애니메이션 (3초 주기, scale 1.0 → 1.04 → 1.0)

---

## v1.1 업데이트 — 표정 변화 & 인터랙션

### 눈 깜빡임
- 평소 기본 이미지: `seal_eyes_open.png` (눈 뜬 모습)
- 5~15초마다 랜덤 간격으로 0.2초 동안 눈을 감음 (`seal.png`)
- 이미지 전환 시 fade 처리로 자연스러운 깜빡임

### 자리 비움 감지 (졸기 모드)
- 마우스/키보드 입력이 **60초** 이상 없으면 졸기 모드 진입
- 졸기 모드에서는 눈 감은 이미지(`seal.png`) 고정
- 마우스를 다시 움직이면 깨어나서 깜빡임 모드로 복귀

### 마우스 호버 반응
- 물범 위로 마우스를 올리면 `seal_looking_side.png`(옆 보는 모습)로 전환
- 마우스가 떠나면 눈 뜬 모습 + 깜빡임 모드로 복귀

### 클릭 반응
- 물범을 클릭하면 눈을 크게 뜨고 5px 위로 살짝 점프 (0.3초)
- 1초 후 깜빡임 모드로 자동 복귀

### 호흡 애니메이션 강화
- 모든 상태(평소, 졸기, 호버, 클릭)에서 호흡 애니메이션 지속

### 이미지 파일
| 파일 | 설명 |
|---|---|
| `seal.png` | 눈 감고 자는 모습 (깜빡임 + 졸기) |
| `seal_eyes_open.png` | 눈 뜬 평온한 모습 (기본) |
| `seal_looking_side.png` | 옆 보는 모습 (호버 시) |

---

## 바로 실행 (개발 모드)

### 요구사항

- [Node.js](https://nodejs.org/) 18 이상 (LTS 권장)

```bash
git clone https://github.com/yj5306-spn/desktop-seal-pet.git
cd desktop-seal-pet
npm install
npm start
```

---

## Windows .exe 빌드 단계별 가이드

### 1단계 — 소스코드 받기

**방법 A: ZIP 다운로드**
1. GitHub 저장소 페이지에서 `Code` → `Download ZIP` 클릭
2. 다운로드된 ZIP 파일 압축 풀기

**방법 B: git clone**
```bash
git clone https://github.com/yj5306-spn/desktop-seal-pet.git
```

### 2단계 — PowerShell 열기

압축을 푼(또는 clone한) 폴더 안에서:
- `Shift + 우클릭` → **PowerShell 창 열기** 선택

### 3단계 — 의존성 설치

```bash
npm install
```

> ⏳ **5~10분 소요** — Electron 바이너리(약 100MB)를 다운로드합니다. 진행 표시줄이 멈춰 보여도 기다려 주세요.

### 4단계 — .exe 빌드

```bash
npm run build:win
```

> ⏳ **3~5분 소요**

### 5단계 — 실행

`dist` 폴더 안의 **`SealWidget Portable 1.0.0.exe`** 를 더블클릭하면 설치 없이 바로 실행됩니다.

---

## 종료 방법

물범을 **우클릭** → **종료** 클릭

---

## 자주 겪는 문제 해결

### "node 명령어를 찾을 수 없음" / "'npm'은 내부 또는 외부 명령이 아닙니다"
Node.js가 설치되어 있지 않습니다.
👉 [https://nodejs.org](https://nodejs.org) 에서 **LTS** 버전을 설치한 뒤 PowerShell을 **새로 열고** 다시 시도하세요.

### npm install 도중 멈추거나 아무 반응이 없음
Electron 바이너리(약 100MB)를 다운로드하는 중입니다. 인터넷 연결을 확인하고 10분 정도 기다려 보세요.

### .exe를 실행했는데 아무것도 안 보임
창이 투명하기 때문에 보이지 않을 수 있습니다.
- 작업 관리자(`Ctrl+Shift+Esc`) → 프로세스 탭에서 `SealWidget` 프로세스가 실행 중인지 확인
- 모니터 모서리나 다른 창 뒤에 숨어 있을 수 있으니 화면 구석구석을 확인해 보세요.

### Windows Defender "PC를 보호했습니다" 경고창
코드 서명이 없는 앱에서 나타나는 일반적인 경고입니다.
👉 **추가 정보** 클릭 → **실행** 클릭

### electron-builder 권한 오류
👉 PowerShell을 **관리자 권한으로 실행**한 뒤 다시 시도하세요.
(시작 메뉴에서 PowerShell 우클릭 → 관리자 권한으로 실행)

---

## 파일 구조

```
desktop-seal-pet/
├── main.js        # Electron 메인 프로세스
├── index.html     # 앱 HTML
├── renderer.js    # 렌더러 프로세스 (애니메이션, 이벤트)
├── style.css      # 스타일
├── seal.png       # 물범 이미지
└── package.json
```
