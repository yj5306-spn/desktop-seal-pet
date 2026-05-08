# Desktop Seal Pet 🦭

책상 위에 사는 작은 베이지색 물범 위젯입니다. 투명한 창에 떠서 다른 모든 창 위에 조용히 앉아있고, 가끔 눈을 깜빡이고, 자리를 비우면 잠들고, 마우스가 가까이 오면 살짝 옆을 봅니다.

---

## 특징

- 투명 창에 띄워지는 데스크톱 위젯 (Windows)
- 마우스 드래그로 화면 어디든 이동 가능
- 우클릭으로 종료
- 항상 다른 창 위에 떠있음
- 작업표시줄에 표시되지 않음

---

## 물범의 행동

- 평소엔 차분히 앉아 5~10초마다 눈을 한 번 깜빡임
- 마우스를 가까이 가져가면 옆을 살짝 봄
- 1분 동안 자리를 비우면 잠들기 시작
- 다시 마우스를 움직이면 깨어남
- 3초 주기로 천천히 호흡하듯 부드럽게 움직임

---

## 설치 방법

### 방법 1: 빌드된 .exe 다운로드 (가장 간단)

> 준비 중 — GitHub Releases 탭에 올라오면 여기에 링크 추가 예정

### 방법 2: 직접 빌드

**요구사항:** [Node.js 18 이상 (LTS)](https://nodejs.org)

1. 이 저장소 다운로드: `Code` → `Download ZIP` 후 압축 풀기  
   (또는 `git clone https://github.com/yj5306-spn/desktop-seal-pet.git`)
2. 압축을 푼 폴더 안에서 `Shift + 우클릭` → **PowerShell 창 열기**
3. 아래 명령어 순서대로 실행:

```powershell
npm install
```
> ⏳ 5~10분 소요 — Electron 바이너리(약 100MB)를 다운로드합니다. 멈춰 보여도 기다려 주세요.

```powershell
npm run build:win
```
> ⏳ 3~5분 소요

4. `dist` 폴더 안의 **`SealWidget Portable 1.0.0.exe`** 더블클릭 → 설치 없이 바로 실행

### 방법 3: 개발 모드로 실행

```powershell
npm install
npm start
```

---

## 종료 방법

물범을 **우클릭** → **종료** 클릭

---

## 문제 해결

**"npm 명령어를 찾을 수 없음"**  
→ [nodejs.org](https://nodejs.org) 에서 LTS 설치 후 PowerShell을 새로 열고 다시 시도

**npm install 도중 멈춤**  
→ Electron 바이너리 다운로드 중. 인터넷 확인 후 10분 기다리기

**실행했는데 아무것도 안 보임**  
→ 투명 창이라 눈에 잘 안 띌 수 있음. 작업 관리자(`Ctrl+Shift+Esc`)에서 `SealWidget` 프로세스 확인, 모니터 모서리나 다른 창 뒤 확인

**"Windows에서 PC를 보호했습니다" 경고**  
→ 코드 서명 없는 앱의 일반적인 경고. **추가 정보** → **실행** 클릭

**electron-builder 권한 오류**  
→ PowerShell을 **관리자 권한으로 실행** (시작 메뉴 → PowerShell 우클릭 → 관리자 권한으로 실행)

---

## 파일 구조

```
desktop-seal-pet/
├── main.js                 # Electron 메인 프로세스
├── index.html              # 앱 HTML
├── renderer.js             # 렌더러 (표정, 애니메이션, 이벤트)
├── style.css               # 스타일 & 애니메이션
├── seal.png                # 눈 감은 모습 (깜빡임 / 졸기)
├── seal_eyes_open.png      # 눈 뜬 모습 (기본)
├── seal_looking_side.png   # 옆 보는 모습 (호버)
└── package.json
```
