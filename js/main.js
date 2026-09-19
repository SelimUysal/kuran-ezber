import { elements, initDOMElements } from "./dom/elements.js";
import { state } from "./state.js";
import { loadSurahData } from "./services/quranApi.js";
import { populateSurahSelect } from "./ui/surahSelect.js";
import { renderSurah, showLoading, showLoadError } from "./ui/renderer.js";
import { setupDragSelection, setupClickAwayClear, clearWordSelection } from "./ui/selection.js";
import { bindModalEvents } from "./ui/modal.js";
import { bindControlEvents, initDefaultSpeed } from "./ui/controls.js";
import { bindAudioEvents, stopAudio } from "./audio/player.js";

async function loadAndRender() {
    try {
        stopAudio();
        clearWordSelection();
        showLoading();
        await loadSurahData();
        renderSurah(state.surahData);
    } catch (err) {
        console.error("Veri çekme hatası:", err);
        showLoadError();
    }
}

function bindAppEvents() {
    elements.surahSelect?.addEventListener("change", async e => {
        state.currentSurah = Number(e.target.value);
        await loadAndRender();
    });

    elements.reciterSelect?.addEventListener("change", async e => {
        state.selectedReciter = e.target.value;
        await loadAndRender();
    });
}

function init() {
    initDOMElements();
    populateSurahSelect();

    setupDragSelection();
    setupClickAwayClear();
    bindAppEvents();
    bindControlEvents();
    bindModalEvents();
    bindAudioEvents();

    initDefaultSpeed();
    loadAndRender();
}

document.addEventListener("DOMContentLoaded", init);