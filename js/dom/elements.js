export const elements = {};

export function initDOMElements() {
    Object.assign(elements, {
        surahSelect: document.getElementById("surah-select"),
        loadingSpinner: document.getElementById("loading-spinner"),
        bismillahBox: document.getElementById("bismillah-box"),
        bismillahText: document.getElementById("bismillah-text"),
        quranContainer: document.getElementById("quran-container"),
        selectedRangeText: document.getElementById("selected-range-text"),
        loopCountSelect: document.getElementById("loop-count"),
        fontSizeRange: document.getElementById("font-size-range"),
        fontSizeDisplay: document.getElementById("font-size-display"),
        playbackSpeedRange: document.getElementById("playback-speed-range"),
        speedValueDisplay: document.getElementById("speed-value-display"),
        speedPresetButtons: document.querySelectorAll(".speed-preset-btn"),
        currentLoopCounter: document.getElementById("current-loop-counter"),
        btnPlay: document.getElementById("btn-play"),
        btnStop: document.getElementById("btn-stop"),
        btnPlaySurah: document.getElementById("btn-play-surah"),
        fontStyleSelect: document.getElementById("font-style-select"),
        reciterSelect: document.getElementById("reciter-select"),

        detailModal: document.getElementById("detail-modal"),
        closeModalBtn: document.getElementById("close-modal"),
        modalVerseNumber: document.getElementById("modal-verse-number"),
        modalSelectedArabic: document.getElementById("modal-selected-arabic"),
        modalVerseTranslation: document.getElementById("modal-verse-translation"),
        modalWbwList: document.getElementById("modal-wbw-list"),
        modalWbwCount: document.getElementById("modal-wbw-count"),

        btnFetchAi: document.getElementById("btn-fetch-ai"),
        aiLoading: document.getElementById("ai-loading"),
        aiContent: document.getElementById("ai-content"),
        modalTerkipMeaning: document.getElementById("modal-terkip-meaning"),
        modalWordBreakdown: document.getElementById("modal-word-breakdown"),
        modalTafsirContext: document.getElementById("modal-tafsir-context"),
        modalNuzulInfo: document.getElementById("modal-nuzul-info")
    });
}