chrome.commands.onCommand.addListener((command) => {
  if (command === 'convert_text') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0] && tabs[0].url) {
              const tabId = tabs[0].id;
              const tabUrl = tabs[0].url;

              // 1. 브라우저 내부 페이지(chrome://, edge:// 등)인지 사전 검사
              if (tabUrl.startsWith('chrome://') || tabUrl.startsWith('edge://') || tabUrl.startsWith('about:')) {
                  console.warn('보안상 브라우저 내부 페이지에서는 실행할 수 없습니다.');
                  return; // 함수 실행을 여기서 바로 종료
              }

              // 2. 일반 웹페이지(http, https)인 경우에만 content.js 주입
              chrome.scripting.executeScript({
                  target: { tabId: tabId },
                  files: ['content.js']
              }).catch((error) => {
                  // 혹시라도 발생할 수 있는 비동기(Promise) 에러를 잡아줍니다.
                  console.error('스크립트 주입 에러:', error);
              });
          }
      });
  }
});