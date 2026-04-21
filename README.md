# ⌨️ Hangul Fixer (한영 오타 변환기 & 간편 번역기)

영문 키보드 상태로 잘못 입력한 한글(예: `dkssud` ➝ `안녕`)을 드래그 한 번으로 즉시 변환해 주는 크롬 확장 프로그램입니다. 부가 기능으로 Apple 네이티브 스타일의 미니멀 팝업 번역기를 제공합니다.

<br />

## ✨ 주요 기능 (Features)

### 1. 🚀 즉각적인 한영 오타 변환 (Shortcut)
* **단축키(`Cmd + Shift + K` / `Ctrl + Shift + K`)**를 눌러 드래그된 영문 오타를 한글로 즉시 변환합니다.
* **자체 제작 파싱 로직 (FSM):** 외부 API 의존 없이 순수 JavaScript 배열과 객체를 활용해 한글 유니코드(초/중/종성)를 실시간으로 조합합니다.
* **고급 한글 처리:** * 겹받침 병합 및 연음 분리 완벽 지원 (예: `ekfr` ➝ `닭`, `ekfrk` ➝ `달가`)
  * Caps Lock 활성화 시 발생하는 대소문자 섞임 예외 처리 완벽 대응.

### 2. 🌐 미니멀 간편 번역기 (Popup UI)
* 아이콘 클릭 시 열리는 Apple Human Interface Guidelines 기반의 깔끔한 번역기 팝업.
* **Light / Dark 모드 지원:** 시스템 테마에 맞춘 최적화된 색상 대비 적용 및 로컬 스토리지(`localStorage`)를 통한 사용자 테마 상태 유지.
* **자동 클립보드 복사:** 번역 결과 클릭 시 즉시 복사 및 직관적인 상태(Success Green) 피드백 제공.
* 구글 비공식 API(`client=gtx`)를 활용한 빠르고 가벼운 번역 기능.

<br />

## 🛠️ 기술 스택 (Tech Stack)
* **Frontend:** Vanilla JavaScript, HTML5, CSS3
* **Environment:** Chrome Extension Manifest V3
* **Design:** Apple System Design (SF Typography, Native Gray/Blue Colors)
> **💡 Note:** 크롬 확장 프로그램의 특성상 잦은 팝업 렌더링과 직접적인 DOM 제어(`document.execCommand`)가 필요하여, 번들 사이즈를 키우는 React 대신 순수 JS 환경으로 최적화하여 개발했습니다.

<br />

## 🔗 다운로드 (Download)
* [Chrome 웹스토어에서 설치하기](여기에_웹스토어_링크_입력)

<br />

## 💻 개발자용 로컬 실행 방법 (How to run locally)
코드를 직접 수정하거나 로컬 환경에서 테스트하고 싶으신 분들은 아래 방법을 참고해 주세요.
1. 이 레포지토리를 클론(`git clone`)합니다.
2. 크롬 주소창에 `chrome://extensions/`를 입력하여 접속합니다.
3. 우측 상단의 **'개발자 모드'**를 활성화합니다.
4. **'압축해제된 확장 프로그램을 로드합니다'**를 클릭하고, 클론한 폴더를 선택합니다.

<br />

## 💡 사용 방법 (Usage)

**[오타 변환]**
1. 텍스트 입력 중 영문으로 잘못 친 한글(`rkatkgkqslek`)을 마우스로 드래그하여 선택합니다. 드래그 대신 아래 내장 단축키들을 활용하여 빠르게 선택해보세요.
    - `Ctrl + A` 로 전체 선택<br />
    - `Ctrl + Shift + ⬅️ 화살표`로 한 줄 선택<br />
    - `Ctrl + Option + ⬅️ 화살표`로 단어 선택
2. `Cmd + Shift + K` (Mac) 또는 `Ctrl + Shift + K` (Windows)를 누릅니다.
3. 텍스트가 정상적인 한글(`감사합니다`)로 덮어씌워집니다.

**[팝업 번역]**
1. 우측 상단의 확장 프로그램 아이콘을 클릭합니다.
2. 번역할 텍스트를 입력하고 `Enter` 또는 `번역하기` 버튼을 누릅니다.
3. `복사` 버튼을 눌러 결과물을 클립보드에 담아 사용합니다.

<br />

## ⚠️ 알려진 한계점 (Known Issues)
* **특수 에디터 미지원:** `document.execCommand` 웹 표준의 한계로 인해 자체 렌더링 엔진이나 Virtual DOM을 강하게 통제하는 일부 웹사이트(Notion, Google Docs, X 등)에서는 텍스트 변환 덮어씌우기가 동작하지 않을 수 있습니다.
* **API Rate Limit:** 팝업 번역기는 무료 API 엔드포인트를 사용하므로 단기간에 너무 많은 요청을 보낼 경우 IP 기반 일시 차단(429 Error)이 발생할 수 있도록 안전하게 방어 코드가 작성되어 있습니다.

<br />

## 👩🏻‍💻 Author
**홍유진 (dbwlsyyy)** * Frontend Developer
