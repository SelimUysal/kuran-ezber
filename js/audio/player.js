import { elements } from "../dom/elements.js";
import { state } from "../state.js";
import { AUDIO } from "../config.js";
import { updateLoopCounterUI } from "../ui/controls.js";
import {
    clearActiveWords,
    clearActiveVerseBoxes,
    highlightVerseBox,
    updateCurrentWordHighlight
} from "./highlight.js";

export function applySpeed() {
    const speed = parseFloat(elements.playbackSpeedRange?.value) || 1.0;
    state.audioPlayer.playbackRate = speed;
}

/** Ayet başında besmele ekleyen hafızlar için zaman kaydırma */
function computeTimeRange(segment, duration, ayahNum) {
    const hasBismillahOffset =
        ayahNum === 1 &&
        duration > 10 &&
        /abdulbasit|sudais/.test(state.selectedReciter);

    const offset = hasBismillahOffset ? 4.0 : 0;
    const start = duration * segment.startRatio + offset;
    const end = duration * segment.endRatio + offset;

    return hasBismillahOffset
        ? { start: Math.min(start, duration - 1), end: Math.min(end, duration) }
        : { start, end };
}

function goToNextSegment(delay) {
    if (!state.isPlaying) return;
    state.currentSegmentIndex++;
    setTimeout(() => playSegment(state.currentSegmentIndex), delay);
}

export function playSegment(idx) {
    if (!state.isPlaying) return;

    // Tüm segmentler bitti → döngü kontrolü
    if (idx >= state.verseSegments.length) {
        state.currentLoop++;
        if (state.currentLoop > state.targetLoopCount) return stopAudio();
        updateLoopCounterUI();
        state.currentSegmentIndex = 0;
        return playSegment(0);
    }

    const segment = state.verseSegments[idx];
    const ayahNum = parseInt(segment.verseNum, 10);
    const ayah = state.surahData?.[ayahNum - 1];
    if (!ayah) return stopAudio();

    clearActiveWords();
    if (elements.selectedRangeText) {
        elements.selectedRangeText.textContent =
            `${ayahNum}. Ayet okunuyor... (Döngü ${state.currentLoop})`;
    }

    const player = state.audioPlayer;
    player.src = ayah.audio;
    applySpeed();

    player.onloadedmetadata = () => {
        const { start, end } = computeTimeRange(segment, player.duration, ayahNum);
        state.startTime = start;
        state.endTime = end;
        player.currentTime = start;
        applySpeed();

        player.play().catch(err => {
            console.error("Ses oynatılamadı:", err);
            goToNextSegment(0);
        });

        highlightVerseBox(ayahNum);

        clearInterval(state.checkTimeInterval);
        state.checkTimeInterval = setInterval(() => {
            if (!state.isPlaying) {
                clearInterval(state.checkTimeInterval);
                clearActiveWords();
                return;
            }

            const t = player.currentTime;
            updateCurrentWordHighlight(segment, state.startTime, state.endTime, t);

            if (t >= state.endTime) {
                player.pause();
                clearInterval(state.checkTimeInterval);
                clearActiveWords();
                goToNextSegment(AUDIO.nextSegmentDelayMs);
            }
        }, AUDIO.tickIntervalMs);
    };

    player.onerror = () => {
        console.warn(`Ses dosyası yüklenemedi: ${ayah.audio}`);
        clearInterval(state.checkTimeInterval);
        clearActiveWords();
        goToNextSegment(AUDIO.errorSkipDelayMs);
    };
}

export function startPlayback() {
    if (!state.verseSegments.length) return;
    if (state.isPlaying) stopAudio();

    const loopVal = elements.loopCountSelect?.value ?? "3";
    state.targetLoopCount = loopVal === "infinite" ? Infinity : parseInt(loopVal, 10);
    state.isPlaying = true;
    state.currentLoop = 1;
    state.currentSegmentIndex = 0;

    if (elements.btnPlay) elements.btnPlay.disabled = true;
    if (elements.btnStop) elements.btnStop.disabled = false;

    updateLoopCounterUI();
    playSegment(0);
}

export function startFullSurahPlayback() {
    if (!state.surahData?.length) return;
    stopAudio();

    state.selectedWords = [];
    state.verseSegments = state.surahData.map(ayah => ({
        verseNum: ayah.numberInSurah,
        startRatio: 0,
        endRatio: 1,
        words: Array.from(
            document.querySelectorAll(`.word-span[data-verse="${ayah.numberInSurah}"]`)
        )
    }));

    state.currentSegmentIndex = 0;
    state.currentLoop = 1;
    state.targetLoopCount = 1;
    state.isPlaying = true;

    if (elements.btnStop) elements.btnStop.disabled = false;
    updateLoopCounterUI();
    playSegment(0);
}

export function stopAudio() {
    state.isPlaying = false;
    clearInterval(state.checkTimeInterval);

    const player = state.audioPlayer;
    player.onloadedmetadata = null;
    player.onerror = null;
    player.pause();
    player.currentTime = 0;

    if (elements.btnPlay) elements.btnPlay.disabled = state.selectedWords.length === 0;
    if (elements.btnStop) elements.btnStop.disabled = true;
    if (elements.currentLoopCounter) elements.currentLoopCounter.textContent = "0 / 0";
    if (elements.selectedRangeText) elements.selectedRangeText.textContent = "Oynatma durduruldu.";

    clearActiveWords();
    clearActiveVerseBoxes();
}

export function bindAudioEvents() {
    elements.btnPlay?.addEventListener("click", startPlayback);
    elements.btnStop?.addEventListener("click", stopAudio);
    elements.btnPlaySurah?.addEventListener("click", startFullSurahPlayback);
}