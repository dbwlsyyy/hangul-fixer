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

// 1. 테마 초기화 로직
const initializeTheme = () => {
  const savedTheme = localStorage.getItem("hangulFixerTheme") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    toggleTheme.textContent = "◽️";
  } else {
    toggleTheme.textContent = "◼️";
  }
};

initializeTheme();

// 자동 포커싱
input.focus();

// 테마 토글 버튼 이벤트
toggleTheme.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  toggleTheme.textContent = isDark ? "◽️" : "◼️";
  localStorage.setItem("hangulFixerTheme", isDark ? "dark" : "light");
});

// 언어 전환 버튼 이벤트
switchLangBtn.addEventListener("click", () => {
  [sourceLang, targetLang] = [targetLang, sourceLang];
  langLabel.textContent = sourceLang === "ko" ? "한 ➝ 영" : "영 ➝ 한";
  input.placeholder = sourceLang === "ko" ? "입력하세요..." : "Enter text...";
  input.focus();
});

// 구글 번역 API 파싱 함수
function extractTranslatedText(payload) {
  const segments = Array.isArray(payload?.[0]) ? payload[0] : [];
  return segments
    .map((segment) => (Array.isArray(segment) ? segment[0] : ""))
    .filter(Boolean)
    .join("");
}

// 번역 메인 로직
async function translateText(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url);

  if (response.status === 429) {
    throw new Error("429_TOO_MANY_REQUESTS");
  }
  if (!response.ok) {
    throw new Error(`Status: ${response.status}`);
  }

  const payload = await response.json();
  return extractTranslatedText(payload);
}

translateBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  if (!text) return;

  try {
    result.textContent = "번역 중...";
    result.textContent = await translateText(text);
  } catch (err) {
    if (err.message === "429_TOO_MANY_REQUESTS") {
      result.textContent =
        "⏳ 너무 많은 요청으로 일시 차단되었습니다. 잠시 후 다시 시도해주세요.";
    } else {
      result.textContent = "❌ 번역에 실패했습니다. (네트워크 오류)";
    }
    console.error("번역 API 에러:", err);
  }
});

// 복사 버튼
copyBtn.addEventListener("click", () => {
  const text = result.textContent;
  if (text && !text.startsWith("❌") && text !== "번역 중...") {
    navigator.clipboard.writeText(text);

    copyBtn.textContent = "완료";
    copyBtn.classList.add("success");
    copyBtn.disabled = true;

    setTimeout(() => {
      copyBtn.textContent = "복사";
      copyBtn.classList.remove("success");
      copyBtn.disabled = false;
    }, 1500);
  }
});

// 삭제 버튼
clearBtn.addEventListener("click", () => {
  input.value = "";
  result.textContent = "";
  input.focus();
});
