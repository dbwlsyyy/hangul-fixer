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

function extractTranslatedText(payload) {
  const segments = Array.isArray(payload?.[0]) ? payload[0] : [];
  return segments
    .map((segment) => (Array.isArray(segment) ? segment[0] : ""))
    .filter(Boolean)
    .join("");
}

async function translateText(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Translate API failed: ${response.status}`);
  }

  const payload = await response.json();
  const translated = extractTranslatedText(payload);
  if (!translated) {
    throw new Error("Translate API returned empty result");
  }
  return translated;
}

translateBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  if (!text) return;

  try {
    result.textContent = "번역 중...";
    result.textContent = await translateText(text);
  } catch (err) {
    result.textContent = "❌ 번역 실패";
    console.error(err);
  }
});

// 복사하기
copyBtn.addEventListener("click", () => {
  const text = result.textContent;
  if (text && !text.startsWith("❌") && text !== "번역 중...") {
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
