import { API } from "../config.js";
import { state } from "../state.js";

/**
 * Sure verilerini (ses + Türkçe meal + kelime kelime) paralel çeker
 * ve state'e yazar.
 */
export async function loadSurahData() {
    const [alQuranRes, wbwRes] = await Promise.all([
        fetch(API.alQuranCloud(state.currentSurah, state.selectedReciter)).then(r => r.json()),
        fetch(API.quranComWbw(state.currentSurah)).then(r => r.json())
    ]);

    if (alQuranRes.code === 200 && alQuranRes.data) {
        state.surahData = alQuranRes.data[0].ayahs;
        state.turkishTranslations = alQuranRes.data[1].ayahs;
    }

    if (wbwRes?.verses) {
        state.wbwData = wbwRes.verses;
    }
}