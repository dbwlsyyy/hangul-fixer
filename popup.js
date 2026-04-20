const input = document.getElementById("inputText");
const translateBtn = document.getElementById("translateBtn");
const result = document.getElementById("result");
const copyBtn = document.getElementById("copyBtn");
const toggleTheme = document.getElementById("toggleTheme");
const switchLangBtn = document.getElementById("switchLangBtn");
const langLabel = document.getElementById("langLabel");
const clearBtn = document.getElementById("clearBtn");

let sourceLang = "ko";
let targetLang = "en";

// 자동 포커싱
input.focus();

// 언어 전환
switchLangBtn.addEventListener("click", () => {
  // 언어 방향 전환
  [sourceLang, targetLang] = [targetLang, sourceLang];

  // 표시 변경
  if (sourceLang === "ko") {
    langLabel.textContent = "한 ➝ 영";
    input.placeholder = "번역할 한글 입력";
  } else {
    langLabel.textContent = "영 ➝ 한";
    input.placeholder = "Enter English";
  }

  // 입력창 리포커싱
  input.focus();
});

// 다크모드 토글
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleTheme.textContent = document.body.classList.contains("dark")
    ? "◽️ Light"
    : "◾️ Dark";
});

// 번역 요청
// popup.js 번역 요청 로직 수정 (가장 안정적인 무료 방식)
translateBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  if (!text) return;

  try {
    result.textContent = "번역 중...";

    // 구글 번역 비공식 무료 API 엔드포인트
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);
    const data = await response.json();

    // 응답 배열에서 번역된 텍스트만 추출
    result.textContent = data[0][0][0];
  } catch (err) {
    result.textContent = "❌ 네트워크 오류";
    console.error(err);
  }
});

// 복사하기
copyBtn.addEventListener("click", () => {
  const text = result.textContent;
  if (text) {
    navigator.clipboard.writeText(text);
    copyBtn.textContent = "✅ 복사됨!";
    setTimeout(() => (copyBtn.textContent = "📋 복사"), 1500);
  }
});

clearBtn.addEventListener("click", () => {
  input.value = "";
  result.textContent = "";
  input.focus();
});
