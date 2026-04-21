(() => {
const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.split('');
const JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'.split('');
/* prettier-ignore */
const JONG = [
    '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
    'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];
/* prettier-ignore */
const ENG_TO_KOR = {
    r: 'ㄱ', R: 'ㄲ', s: 'ㄴ', e: 'ㄷ', E: 'ㄸ', f: 'ㄹ', a: 'ㅁ', q: 'ㅂ', Q: 'ㅃ', t: 'ㅅ', T: 'ㅆ',
    d: 'ㅇ', w: 'ㅈ', W: 'ㅉ', c: 'ㅊ', z: 'ㅋ', x: 'ㅌ', v: 'ㅍ', g: 'ㅎ', k: 'ㅏ', o: 'ㅐ',
    i: 'ㅑ', O: 'ㅒ', j: 'ㅓ', p: 'ㅔ', u: 'ㅕ', P: 'ㅖ', h: 'ㅗ', hk: 'ㅘ', ho: 'ㅙ', hl: 'ㅚ',
    y: 'ㅛ', n: 'ㅜ', nj: 'ㅝ', np: 'ㅞ', nl: 'ㅟ', b: 'ㅠ', m: 'ㅡ', ml: 'ㅢ', l: 'ㅣ',
};

const CHO_INDEX = Object.fromEntries(CHO.map((char, idx) => [char, idx]));
const JUNG_INDEX = Object.fromEntries(JUNG.map((char, idx) => [char, idx]));
const JONG_INDEX = Object.fromEntries(JONG.map((char, idx) => [char, idx]));

function replaceSelectedText() {
    const selectedText = document.getSelection()?.toString() ?? '';
    if (!selectedText) return;

    const convertedText = convertEngToKor(selectedText);
    document.execCommand('insertText', false, convertedText);
}

function getMappedKorChar(input, index) {
    const pair = `${input[index]}${input[index + 1] ?? ''}`;
    const pairMapped = ENG_TO_KOR[pair];
    if (pairMapped && JUNG_INDEX[pairMapped] !== undefined) {
        return { value: pairMapped, consumed: 2 };
    }

    const singleMapped = ENG_TO_KOR[input[index]];
    if (!singleMapped) return null;
    return { value: singleMapped, consumed: 1 };
}

function flushSyllable(syllable) {
    if (syllable.cho !== null && syllable.jung !== null) {
        const jong = syllable.jong ?? 0;
        return assembleHangul(syllable.cho, syllable.jung, jong);
    }
    if (syllable.cho !== null) return CHO[syllable.cho];
    if (syllable.jung !== null) return JUNG[syllable.jung];
    return '';
}

// 영어 → 한글 변환 함수
function convertEngToKor(input) {
    let result = '';
    let syllable = { cho: null, jung: null, jong: null };

    for (let i = 0; i < input.length; i++) {
        const mapped = getMappedKorChar(input, i);
        if (!mapped) {
            result += flushSyllable(syllable);
            syllable = { cho: null, jung: null, jong: null };
            result += input[i];
            continue;
        }

        const current = mapped.value;
        if (mapped.consumed === 2) i += 1;

        const isConsonant = CHO_INDEX[current] !== undefined;
        const isVowel = JUNG_INDEX[current] !== undefined;

        if (isConsonant) {
            if (syllable.cho === null && syllable.jung === null) {
                syllable.cho = CHO_INDEX[current];
                continue;
            }

            if (syllable.cho !== null && syllable.jung === null) {
                result += flushSyllable(syllable);
                syllable = { cho: CHO_INDEX[current], jung: null, jong: null };
                continue;
            }

            if (syllable.cho !== null && syllable.jung !== null && syllable.jong === null) {
                const nextMapped = getMappedKorChar(input, i + 1);
                const nextIsVowel =
                    nextMapped && JUNG_INDEX[nextMapped.value] !== undefined;

                if (nextIsVowel) {
                    result += flushSyllable(syllable);
                    syllable = { cho: CHO_INDEX[current], jung: null, jong: null };
                    continue;
                }

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
            if (syllable.cho === null && syllable.jung === null) {
                result += current;
                continue;
            }

            if (syllable.cho !== null && syllable.jung === null) {
                syllable.jung = JUNG_INDEX[current];
                continue;
            }

            if (syllable.cho !== null && syllable.jung !== null && syllable.jong !== null) {
                const carriedJong = JONG[syllable.jong];
                result += assembleHangul(syllable.cho, syllable.jung, 0);

                const nextCho = CHO_INDEX[carriedJong];
                if (nextCho !== undefined) {
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

// 초성 + 중성 + 종성을 하나의 완성된 한글로 변환
function assembleHangul(cho, jung, jong = 0) {
    if (cho === undefined || jung === undefined) return '';
    const unicode = 0xac00 + cho * 21 * 28 + jung * 28 + jong;
    return String.fromCharCode(unicode);
}

replaceSelectedText();
})();


