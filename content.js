function replaceSelectedText() {
    console.log('replaceSelectedText 실행됨');
    const selectedText = document.getSelection().toString();
    console.log('선택된 텍스트:', selectedText);

    if (selectedText) {
        let convertedText = convertEngToKor(selectedText);

        document.execCommand('insertText', false, convertedText);
    } else {
        console.log('선택된 텍스트가 없습니다.');
    }
}

// 영어 → 한글 변환 함수
function convertEngToKor(input) {
    console.log('convertEngToKor 함수가 호출되었습니다.');

    const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.split('');
    const JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'.split('');
    /* prettier-ignore */
    const JONG = [
        '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
        'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
    ];
    /* prettier-ignore */
    const engToKorMap = {
        r: 'ㄱ', R: 'ㄲ', s: 'ㄴ', e: 'ㄷ', E: 'ㄸ', f: 'ㄹ', a: 'ㅁ', q: 'ㅂ', Q: 'ㅃ', t: 'ㅅ', T: 'ㅆ',
        d: 'ㅇ',w: 'ㅈ', W: 'ㅉ', c: 'ㅊ', z: 'ㅋ', x: 'ㅌ', v: 'ㅍ', g: 'ㅎ', k: 'ㅏ', o: 'ㅐ',
        i: 'ㅑ', O: 'ㅒ', j: 'ㅓ', p: 'ㅔ', u: 'ㅕ', P: 'ㅖ', h: 'ㅗ', hk: 'ㅘ', ho: 'ㅙ', hl: 'ㅚ',
        y: 'ㅛ', n: 'ㅜ', nj: 'ㅝ', np: 'ㅞ', nl: 'ㅟ', b: 'ㅠ', m: 'ㅡ', ml: 'ㅢ', l: 'ㅣ',
    };

    let result = '';
    let buffer = []; // 초성, 중성, 종성을 저장할 배열
    let status = 0; // 0 : 비었음, 1 : 초성, 2 : 중성, 3 : 종성

    for (let i = 0; i < input.length; i++) {
        char = input[i];
        const preChar = input[i - 1];
        const nextChar = input[i + 1];

        let korChar = engToKorMap[char];
        const preKorChar = engToKorMap[preChar];
        const nextKorChar = engToKorMap[nextChar];
        console.log(korChar, nextKorChar, status);
        //console.log(char);

        if (korChar) {
            //if (char == ' ') result += ' ';
            if (
                status === 2 &&
                JONG.includes(korChar) &&
                (CHO.includes(nextKorChar) || nextKorChar === undefined)
            ) {
                switch (status) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        status = 3;
                        console.log(status);
                        result += assembleHangul(
                            buffer[0],
                            buffer[1],
                            JONG.indexOf(korChar)
                        );
                        buffer = [];

                        break;
                    case 3:
                        break;
                    default:
                        console.log('status 이상함');
                }
            } else if (CHO.includes(korChar)) {
                switch (status) {
                    case 0:
                        buffer.push(CHO.indexOf(korChar));
                        status = 1;
                        console.log(status);
                        break;
                    case 1:
                        result += preKorChar;
                        buffer = [CHO.indexOf(korChar)];
                        status = 1;
                        console.log(status);
                        break;
                    case 2:
                        result += assembleHangul(buffer[0], buffer[1]);
                        buffer = [CHO.indexOf(korChar)];
                        status = 1;
                        console.log(status);
                        break;
                    case 3:
                        buffer.push(CHO.indexOf(korChar));
                        status = 1;
                        console.log(status);
                        break;
                    default:
                        console.log('status 이상함');
                }
            } else if (JUNG.includes(korChar)) {
                switch (status) {
                    case 0:
                        // result += korChar;
                        buffer.push(JUNG.indexOf(korChar));
                        break;
                    case 1:
                        buffer.push(JUNG.indexOf(korChar));
                        break;
                    case 2:
                        if (
                            JUNG.includes(preKorChar) &&
                            JUNG.includes(korChar)
                        ) {
                            console.log('인식');
                            buffer.pop();
                            char = preChar + char;
                            korChar = engToKorMap[char];
                            buffer.push(JUNG.indexOf(korChar));
                        } else if (nextKorChar === undefined) {
                            console.log('인식2');
                            result += korChar;
                        } else {
                            console.log('인식3');
                            result += assembleHangul(buffer[0], buffer[1]);
                            result += korChar;
                        }
                        break;
                    case 3:
                        console.log('이럴수가 있나 ?');
                        break;
                    default:
                        console.log('status 이상함');
                }
                status = 2;
                console.log(status);
            } else {
                result += assembleHangul(buffer[0], buffer[1]);
                buffer = [];
                buffer.push(CHO.indexOf(korChar));
            }
        } else {
            result += char; // 변환할 수 없는 문자는 그대로 추가
        }
    }

    if (buffer.length > 0) {
        result += assembleHangul(buffer[0], buffer[1]);
        //result += buffer 여기고치기
    }

    console.log('변환된 텍스트:', result);
    return result;
}

// 초성 + 중성 + 종성을 하나의 완성된 한글로 변환
function assembleHangul(cho, jung, jong = 0) {
    if (cho === undefined || jung === undefined) return '^^';
    const unicode = 0xac00 + cho * 21 * 28 + jung * 28 + jong;
    console.log(unicode, String.fromCharCode(unicode));

    return String.fromCharCode(unicode);
}

// 변환 실행
replaceSelectedText();

// function replaceSelectedText() {
//     console.log('replaceSelectedText 실행됨');
//     const selectedText = document.getSelection().toString();
//     if (selectedText) {
//         document.execCommand('insertText', false, convertEngToKor(selectedText));
//     } else {
//         console.log('선택된 텍스트가 없습니다.');
//     }
// }

// function convertEngToKor(input) {
//     console.log('convertEngToKor 함수가 호출되었습니다.');

//     const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.split('');
//     const JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'.split('');
//     /* prettier-ignore */
//     const JONG = [
//         '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
//         'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
//     ];
//     /* prettier-ignore */
//     const engToKorMap = {
//         r: 'ㄱ', R: 'ㄲ', s: 'ㄴ', e: 'ㄷ', E: 'ㄸ', f: 'ㄹ', a: 'ㅁ', q: 'ㅂ', Q: 'ㅃ', t: 'ㅅ', T: 'ㅆ',
//         d: 'ㅇ',w: 'ㅈ', W: 'ㅉ', c: 'ㅊ', z: 'ㅋ', x: 'ㅌ', v: 'ㅍ', g: 'ㅎ', k: 'ㅏ', o: 'ㅐ',
//         i: 'ㅑ', O: 'ㅒ', j: 'ㅓ', p: 'ㅔ', u: 'ㅕ', P: 'ㅖ', h: 'ㅗ', hk: 'ㅘ', ho: 'ㅙ', hl: 'ㅚ',
//         y: 'ㅛ', n: 'ㅜ', nj: 'ㅝ', np: 'ㅞ', nl: 'ㅟ', b: 'ㅠ', m: 'ㅡ', ml: 'ㅢ', l: 'ㅣ',
//     };

//     let result = '';
//     let buffer = [];
//     let status = 0;

//     for (let i = 0; i < input.length; i++) {
//         let char = input[i];
//         let nextChar = input[i + 1] ? input[i] + input[i + 1] : null;
//         let korChar = engToKorMap[nextChar] || engToKorMap[char];
//         let nextKorChar = engToKorMap[input[i + 1]];

//         if (!korChar) {
//             result += finalizeBuffer(buffer);
//             buffer = [];
//             result += char;
//             status = 0;
//             continue;
//         }

//         if (JUNG.includes(korChar) && buffer.length === 2) {
//             buffer.pop();
//             buffer.push(JUNG.indexOf(korChar));
//             status = 2;
//             continue;
//         }

//         if (status === 2 && JONG.includes(korChar) && (!nextKorChar || CHO.includes(nextKorChar))) {
//             result += finalizeBuffer([...buffer, JONG.indexOf(korChar)]);
//             buffer = [];
//             status = 0;
//             continue;
//         }

//         if (CHO.includes(korChar)) {
//             result += finalizeBuffer(buffer);
//             buffer = [CHO.indexOf(korChar)];
//             status = 1;
//         } else if (JUNG.includes(korChar)) {
//             if (status === 1) {
//                 buffer.push(JUNG.indexOf(korChar));
//                 status = 2;
//             } else {
//                 result += finalizeBuffer(buffer);
//                 buffer = [JUNG.indexOf(korChar)];
//                 status = 2;
//             }
//         }
//     }

//     result += finalizeBuffer(buffer);
//     console.log('변환된 텍스트:', result);
//     return result;
// }

// function finalizeBuffer(buffer) {
//     if (buffer.length === 2) return assembleHangul(buffer[0], buffer[1]);
//     if (buffer.length === 3) return assembleHangul(buffer[0], buffer[1], buffer[2]);
//     return '';
// }

// function assembleHangul(cho, jung, jong = 0) {
//     return cho !== undefined && jung !== undefined
//         ? String.fromCharCode(0xac00 + cho * 21 * 28 + jung * 28 + jong)
//         : '';
// }

// replaceSelectedText();
