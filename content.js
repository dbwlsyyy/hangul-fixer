// 즉시 실행 함수(IIFE): 이 블록 안의 변수들이 전역(Window) 환경을 오염시키지 않도록 격리
// 단축키를 여러 번 눌러 스크립트가 중복 주입되어도 SyntaxError가 발생하지 않음

(() => {
  const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ".split("");
  const JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ".split("");
  /* prettier-ignore */
  const JONG = [
    '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
    'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
  ];

  // 영문 키보드 입력값을 한글 자소로 1:1 매핑한 딕셔너리
  /* prettier-ignore */
  const ENG_TO_KOR = {
    r: 'ㄱ', R: 'ㄲ', s: 'ㄴ', e: 'ㄷ', E: 'ㄸ', f: 'ㄹ', a: 'ㅁ', q: 'ㅂ', Q: 'ㅃ', t: 'ㅅ', T: 'ㅆ',
    d: 'ㅇ', w: 'ㅈ', W: 'ㅉ', c: 'ㅊ', z: 'ㅋ', x: 'ㅌ', v: 'ㅍ', g: 'ㅎ', k: 'ㅏ', o: 'ㅐ',
    i: 'ㅑ', O: 'ㅒ', j: 'ㅓ', p: 'ㅔ', u: 'ㅕ', P: 'ㅖ', h: 'ㅗ', hk: 'ㅘ', ho: 'ㅙ', hl: 'ㅚ',
    y: 'ㅛ', n: 'ㅜ', nj: 'ㅝ', np: 'ㅞ', nl: 'ㅟ', b: 'ㅠ', m: 'ㅡ', ml: 'ㅢ', l: 'ㅣ',
  };

  // 탐색 속도를 높이기 위해 배열을 객체(Key-Value) 형태로 변환
  const CHO_INDEX = Object.fromEntries(CHO.map((char, idx) => [char, idx]));
  const JUNG_INDEX = Object.fromEntries(JUNG.map((char, idx) => [char, idx]));
  const JONG_INDEX = Object.fromEntries(JONG.map((char, idx) => [char, idx]));

  // 사용자가 드래그한 텍스트를 찾아 변환 후 덮어씌우는 메인 실행 함수
  function replaceSelectedText() {
    const selectedText = document.getSelection()?.toString() ?? "";
    if (!selectedText) return;

    const convertedText = convertEngToKor(selectedText);
    // document.execCommand: 현재 커서 위치나 드래그된 영역의 텍스트를 대체하는 Web API
    document.execCommand("insertText", false, convertedText);
  }

  function getMappedKorChar(input, index) {
    // 1. 이중 모음 처리 (예: hK, Hk, HK가 들어와도 모두 hk(ㅘ)로 처리되도록 소문자화)
    const char1 = input[index].toLowerCase();
    const char2 = input[index + 1] ? input[index + 1].toLowerCase() : "";
    const pair = `${char1}${char2}`;

    const pairMapped = ENG_TO_KOR[pair];
    if (pairMapped && JUNG_INDEX[pairMapped] !== undefined) {
      return { value: pairMapped, consumed: 2 };
    }

    // 2. 단일 문자 매핑 (대소문자 우선 구분)
    let singleMapped = ENG_TO_KOR[input[index]];

    // 3. 매핑 값이 없다면 (S, U, D 등) 소문자로 변환해서 다시 찾기
    if (!singleMapped) {
      singleMapped = ENG_TO_KOR[input[index].toLowerCase()];
    }

    if (!singleMapped) return null;
    return { value: singleMapped, consumed: 1 };
  }

  // 조합 중인 초/중/종성 버퍼를 완전한 한글 한 글자로 합쳐서 반환하고 버퍼를 비우는 함수
  function flushSyllable(syllable) {
    if (syllable.cho !== null && syllable.jung !== null) {
      const jong = syllable.jong ?? 0;
      return assembleHangul(syllable.cho, syllable.jung, jong);
    }
    if (syllable.cho !== null) return CHO[syllable.cho];
    if (syllable.jung !== null) return JUNG[syllable.jung];
    return "";
  }

  // 영어 → 한글 변환 함수
  function convertEngToKor(input) {
    let result = "";
    // 현재 조립 중인 글자의 초성, 중성, 종성 인덱스 상태를 저장하는 객체 (버퍼)
    let syllable = { cho: null, jung: null, jong: null };

    for (let i = 0; i < input.length; i++) {
      const mapped = getMappedKorChar(input, i);

      // 특수문자, 숫자, 공백 등을 만난 경우 만들던 글자를 완성(flush)하고 그대로 붙여넣음
      if (!mapped) {
        result += flushSyllable(syllable);
        syllable = { cho: null, jung: null, jong: null };
        result += input[i];
        continue;
      }

      const current = mapped.value;
      if (mapped.consumed === 2) i += 1; // 이중 모음 처리 후 다음 루프는 건너뜀

      // 현재 읽은 자소가 자음인지 모음인지 판별
      const isConsonant = CHO_INDEX[current] !== undefined;
      const isVowel = JUNG_INDEX[current] !== undefined;

      if (isConsonant) {
        // [조건 1] 아무것도 없는 상태면 자음을 초성에 넣음
        if (syllable.cho === null && syllable.jung === null) {
          syllable.cho = CHO_INDEX[current];
          continue;
        }

        // [조건 2] 초성은 있는데 중성이 없으면 이전 초성을 완성글자로 밀어내고(flush) 현재 자음을 새 초성으로 지정 (예: 'ㄱㄱ')
        if (syllable.cho !== null && syllable.jung === null) {
          result += flushSyllable(syllable);
          syllable = { cho: CHO_INDEX[current], jung: null, jong: null };
          continue;
        }

        // [조건 3] 초성과 중성이 모두 있는 상태 (종성 자리)
        if (
          syllable.cho !== null &&
          syllable.jung !== null &&
          syllable.jong === null
        ) {
          // 다음 문자가 모음인지 미리 확인
          const nextMapped = getMappedKorChar(input, i + 1);
          const nextIsVowel =
            nextMapped && JUNG_INDEX[nextMapped.value] !== undefined;

          // 다음 문자가 모음이면 현재 자음은 받침(종성)이 아니라 다음 글자의 초성이 되어야 함 (예: '가' + 'ㅇ' + 'ㅏ' -> '가아')
          if (nextIsVowel) {
            result += flushSyllable(syllable);
            syllable = { cho: CHO_INDEX[current], jung: null, jong: null };
            continue;
          }

          // 다음 문자가 모음이 아니라면 현재 자음을 받침(종성)으로 등록
          const jongIdx = JONG_INDEX[current];
          if (jongIdx !== undefined) {
            syllable.jong = jongIdx;
          } else {
            result += flushSyllable(syllable);
            syllable = { cho: CHO_INDEX[current], jung: null, jong: null };
          }
          continue;
        }

        result += flushSyllable(syllable);
        syllable = { cho: CHO_INDEX[current], jung: null, jong: null };
        continue;
      }

      if (isVowel) {
        // 자음 없이 모음만 입력된 경우 그대로 출력 (예: 'ㅏ')
        if (syllable.cho === null && syllable.jung === null) {
          result += current;
          continue;
        }

        // 초성만 있는 상태면 모음을 중성으로 등록 (예: 'ㄱ' + 'ㅏ' -> '가')
        if (syllable.cho !== null && syllable.jung === null) {
          syllable.jung = JUNG_INDEX[current];
          continue;
        }

        // 받침(종성)까지 꽉 찬 상태에서 모음이 또 들어온 경우 (예: '각' + 'ㅏ' -> '가가')
        if (
          syllable.cho !== null &&
          syllable.jung !== null &&
          syllable.jong !== null
        ) {
          const carriedJong = JONG[syllable.jong]; // 기존 받침을 꺼냄
          result += assembleHangul(syllable.cho, syllable.jung, 0); // 받침을 뺀 글자(가) 완성

          const nextCho = CHO_INDEX[carriedJong];
          if (nextCho !== undefined) {
            // 꺼낸 받침(ㄱ)을 새 글자의 초성으로 현재 입력된 모음(ㅏ)을 중성으로 묶어 새로운 버퍼 생성
            syllable = { cho: nextCho, jung: JUNG_INDEX[current], jong: null };
          } else {
            syllable = { cho: null, jung: null, jong: null };
            result += current;
          }
          continue;
        }

        result += flushSyllable(syllable);
        syllable = { cho: null, jung: null, jong: null };
        result += current;
      }
    }

    result += flushSyllable(syllable);
    return result;
  }

  // 한글 유니코드 계산 공식에 따라 자소 인덱스를 실제 한글 글자로 합성
  function assembleHangul(cho, jung, jong = 0) {
    if (cho === undefined || jung === undefined) return "";
    // 0xAC00('가') + (초성 * 21(중성개수) * 28(종성개수)) + (중성 * 28) + 종성
    const unicode = 0xac00 + cho * 21 * 28 + jung * 28 + jong;
    return String.fromCharCode(unicode); // 유니코드 값을 실제 문자로 반환
  }

  // 코드 주입 즉시 함수를 1회 실행합니다.
  replaceSelectedText();
})();
