import { elements } from "../dom/elements.js";
import { state } from "../state.js";
import { openDetailModal } from "./modal.js";

export function clearWordSelection() {
    document.querySelectorAll(".word-span").forEach(el =>
        el.classList.remove("word-selected", "word-active", "active-word")
    );
    state.selectedWords = [];
    state.verseSegments = [];

    if (elements.selectedRangeText) {
        elements.selectedRangeText.textContent = "Henüz kelime seçilmedi";
    }
    if (elements.btnPlay && !state.isPlaying) {
        elements.btnPlay.disabled = true;
    }
}

export function selectRangeBetweenWords(startWord, endWord) {
    clearWordSelection();
    const allWords = Array.from(document.querySelectorAll(".word-span"));
    const i1 = allWords.indexOf(startWord);
    const i2 = allWords.indexOf(endWord);
    if (i1 === -1 || i2 === -1) return;

    const [min, max] = [Math.min(i1, i2), Math.max(i1, i2)];
    for (let i = min; i <= max; i++) {
        state.selectedWords.push(allWords[i]);
        allWords[i].classList.add("word-selected");
    }
}

export function finalizeWordSelection() {
    if (state.selectedWords.length === 0) return;

    const verseMap = new Map();
    state.selectedWords.forEach(el => {
        const v = el.dataset.verse;
        if (!verseMap.has(v)) verseMap.set(v, []);
        verseMap.get(v).push(el);
    });

    state.verseSegments = [];
    verseMap.forEach((words, verseNum) => {
        words.sort((a, b) => +a.dataset.wordIdx - +b.dataset.wordIdx);
        const total = +words[0].dataset.totalWords;
        const startIdx = +words[0].dataset.wordIdx;
        const endIdx = +words[words.length - 1].dataset.wordIdx;

        state.verseSegments.push({
            verseNum,
            startRatio: startIdx / total,
            endRatio: (endIdx + 1) / total,
            words
        });
    });

    const first = state.verseSegments[0].verseNum;
    const last = state.verseSegments.at(-1).verseNum;
    const rangeStr = first === last ? `${first}. Ayet` : `${first} - ${last}. Ayetler`;

    if (elements.selectedRangeText) {
        elements.selectedRangeText.textContent =
            `${rangeStr} (${state.selectedWords.length} kelime seçildi)`;
    }
    if (elements.btnPlay) elements.btnPlay.disabled = false;
}

function handleShiftClick(word) {
    if (state.lastClickedWord) {
        selectRangeBetweenWords(state.lastClickedWord, word);
    } else {
        clearWordSelection();
        state.selectedWords.push(word);
        word.classList.add("word-selected");
        state.lastClickedWord = word;
    }
    finalizeWordSelection();
}

export function setupDragSelection() {
    const container = elements.quranContainer;
    if (!container) return;

    container.addEventListener("mousedown", e => {
        if (e.button !== 0 || !e.target.classList.contains("word-span")) return;

        if (e.shiftKey) return handleShiftClick(e.target);

        if (state.lastClickedWord &&
            state.lastClickedWord !== e.target &&
            state.selectedWords.length === 1) {
            selectRangeBetweenWords(state.lastClickedWord, e.target);
            finalizeWordSelection();
            state.lastClickedWord = null;
            return;
        }

        state.isMouseDown = true;
        state.dragStartWord = e.target;
        selectRangeBetweenWords(e.target, e.target);
        state.lastClickedWord = e.target;
    });

    container.addEventListener("mouseover", e => {
        if (state.isMouseDown && state.dragStartWord && e.target.classList.contains("word-span")) {
            selectRangeBetweenWords(state.dragStartWord, e.target);
        }
    });

    window.addEventListener("mouseup", e => {
        if (e.button !== 0 || !state.isMouseDown) return;
        state.isMouseDown = false;
        state.dragStartWord = null;
        finalizeWordSelection();
    });

    container.addEventListener("contextmenu", e => {
        if (!e.target.classList.contains("word-span")) return;
        e.preventDefault();

        if (!state.selectedWords.includes(e.target)) {
            clearWordSelection();
            state.selectedWords.push(e.target);
            e.target.classList.add("word-selected");
            finalizeWordSelection();
        }
        openDetailModal();
    });
}

/** Boş alana tıklanınca seçimi temizle */
export function setupClickAwayClear() {
    document.addEventListener("mousedown", e => {
        const isWord = e.target.closest(".word-span");
        const isControl = e.target.closest(
            "button, input, select, #detail-modal, label, .speed-preset-btn"
        );
        if (!isWord && !isControl) {
            clearWordSelection();
            state.lastClickedWord = null;
        }
    });
}