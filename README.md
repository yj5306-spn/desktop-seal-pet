# 🦭 Seal Widget

귀여운 물범이 바탕화면 위에 떠있는 Electron 데스크톱 위젯입니다.

## 기능

- 투명한 배경, 테두리 없음
- 항상 모든 창 위에 떠있음
- 작업표시줄에 표시되지 않음
- 마우스로 드래그해서 위치 이동
- 우클릭 → 종료
- 10초마다 좌우로 슬쩍 움직임
- 30초마다 살짝 숨 쉬는 애니메이션

## 실행 방법 (Windows)

### 요구사항

- [Node.js](https://nodejs.org/) 18 이상

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/<your-username>/seal-widget.git
cd seal-widget

# 2. 의존성 설치
npm install

# 3. 앱 실행
npm start
```

### Windows 실행 파일로 빌드 (선택)

```bash
npm run build:win
```

빌드 완료 후 `dist/` 폴더에 설치 파일이 생성됩니다.

## 파일 구조

```
seal-widget/
├── main.js        # Electron 메인 프로세스
├── index.html     # 앱 HTML
├── renderer.js    # 렌더러 프로세스 (애니메이션, 이벤트)
├── style.css      # 스타일
├── seal.png       # 물범 이미지
└── package.json
```

## 종료 방법

물범을 **우클릭** → **종료** 클릭
