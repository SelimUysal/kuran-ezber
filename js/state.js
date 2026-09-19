import { DEFAULTS } from "./config.js";

export const state = {
    // Veri
    currentSurah: DEFAULTS.surah,
    surahData: null,
    turkishTranslations: null,
    wbwData: null,

    // Seçim
    selectedWords: [],
    verseSegments: [],
    isMouseDown: false,
    dragStartWord: null,
    lastClickedWord: null,

    // Ses
    audioPlayer: new Audio(),
    currentSegmentIndex: 0,
    startTime: 0,
    endTime: 0,
    targetLoopCount: DEFAULTS.loopCount,
    currentLoop: 0,
    isPlaying: false,
    checkTimeInterval: null,

    // Tercihler
    selectedReciter: DEFAULTS.reciter,
    selectedFont: DEFAULTS.font
};