// chrome.commands = 크롬의 commands API(단축키 관리 API)
// onCommand = 사용자가 단축키를 누를 때 실행되는 이벤트
chrome.commands.onCommand.addListener((command) => {
    if (command === 'convert_text') {
        // json 파일에서 convert_text를 키값으로 지정해놓음
        console.log('한영 변환 실행');

        // 현재 열려있는 탭 중 특정 조건에 맞는 탭을 찹음
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            // tabs 베열 반환
            // active: true 현재 선택된 챕(모든 창에서 활성탭 1개씩)
            // currentWindow: true 현재 창의 모든 탭 가져옴
            // 두개 조합 >> 현재 창에서 선택된 활성챕 1개만 찾음
            if (tabs[0]) {
                // 활성탭이 있는지 확인
                console.log('활성 탭 발견:', tabs[0]);
                const tabId = tabs[0].id;
                const tabUrl = tabs[0].url;
                console.log('탭 id:', tabId);
                console.log('탭 URL:', tabUrl);

                // 크롬 내부 페이지에서는 실행되지 않도록 제한 (보안 정책 때문에)
                if (tabUrl) {
                    console.log('chrome.scripting API 존재');

                    //json에 'scripting'권한이 있어야 사용 가능
                    chrome.scripting.executeScript({
                        target: { tabId: tabId }, // 어느 탭에서 코드를 실행할지
                        files: ['content.js'], // 웹페이지에서 실행할 스크립트 파일 지정
                    });
                } else {
                    console.warn('chrome:// URL에서는 실행할 수 없습니다.');
                }
            } else {
                console.error('활성 탭을 찾을 수 없습니다.');
            }
        });
    }
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "toggleConversion") {
//         const newState = !message.currentState; // 설정 값 변경
//         chrome.storage.local.set({ isEnabled: newState });
//         sendResponse({ isEnabled: newState });
//     }
// });
