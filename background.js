chrome.commands.onCommand.addListener((command) => {
  if (command === "convert_text") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url) {
        const tabId = tabs[0].id;
        const tabUrl = tabs[0].url;

        // [보안 처리] 크롬 설정 페이지(chrome://)나 빈 탭 등은 스크립트 주입이 불가능하므로 사전에 차단
        if (
          tabUrl.startsWith("chrome://") ||
          tabUrl.startsWith("edge://") ||
          tabUrl.startsWith("about:")
        ) {
          console.warn("보안상 브라우저 내부 페이지에서는 실행할 수 없습니다.");
          return;
        }

        // 일반 웹페이지(http, https)인 경우에만 content.js 주입
        chrome.scripting
          .executeScript({
            target: { tabId: tabId },
            files: ["content.js"],
          })
          .catch((error) => {
            console.error("스크립트 주입 에러:", error);
          });
      }
    });
  }
});
