import { elements } from "../dom/elements.js";
import { state } from "../state.js";
import { analyzeSelection } from "../services/geminiService.js";
import { getSurahName } from "./surahSelect.js";

function selectedArabicText() {
    return state.selectedWords.map(w => w.textContent.trim()).join(" ");
}

function verseTranslation(verseNum) {
    return state.turkishTranslations?.[verseNum - 1]?.text ?? "";
}

function renderWordByWordList() {
    const list = elements.modalWbwList;
    const badge = elements.modalWbwCount;
    if (!list) return;

    const message = text => {
        list.innerHTML = `<p class="text-sm text-slate-400 p-2">${text}</p>`;
        badge?.classList.add("hidden");
    };

    if (!state.selectedWords.length) return message("Lütfen analiz etmek istediğiniz kelimeleri seçin.");
    if (!state.wbwData) return message("Kelime sözlüğü yükleniyor...");

    // Ayete göre grupla
    const byVerse = {};
    state.selectedWords.forEach(w => {
        const v = +w.dataset.verse;
        (byVerse[v] ??= []).push(+w.dataset.wordIdx);
    });

    const matched = [];
    Object.keys(byVerse).map(Number).sort((a, b) => a - b).forEach(verseNum => {
        const verseObj = state.wbwData.find(v => v.verse_number === verseNum);
        if (!verseObj?.words) return;

        const apiWords = verseObj.words.filter(w => w.char_type_name !== "end");
        byVerse[verseNum].sort((a, b) => a - b).forEach(idx => {
            if (apiWords[idx]) matched.push({ ...apiWords[idx], verseNumber: verseNum });
        });
    });

    if (!matched.length) return message("Seçilen kelimeler eşleştirilemedi.");

    if (badge) {
        badge.textContent = `${matched.length} Kelime Seçildi`;
        badge.classList.remove("hidden");
    }

    list.innerHTML = matched.map((w, i) => `
        <div class="flex flex-col items-center justify-between bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-2.5 min-w-[105px] max-w-[135px] flex-grow shadow-sm transition-all">
            <div class="flex justify-between w-full items-center mb-1">
                <span class="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">${i + 1}</span>
                <span class="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">${w.verseNumber}. Ayet</span>
            </div>
            <span class="font-arabic text-xl md:text-2xl text-emerald-950 dir-rtl font-bold my-1 text-center leading-snug">${w.text_uthmani || w.text}</span>
            <span class="text-xs font-bold text-emerald-800 text-center leading-tight line-clamp-2">${w.translation?.text ?? "-"}</span>
            <span class="text-[10px] text-slate-400 italic mt-1 text-center">${w.transliteration?.text ?? ""}</span>
        </div>`).join("");
}

export function openDetailModal() {
    if (!state.selectedWords.length) return;

    const verseNum = +state.selectedWords[0].dataset.verse;

    elements.modalVerseNumber.textContent =
        `${verseNum}. Ayet Tahlili (${state.selectedWords.length} Kelime)`;
    elements.modalSelectedArabic.textContent = selectedArabicText();
    elements.modalVerseTranslation.textContent =
        verseTranslation(verseNum) || "Meal yüklenemedi.";

    renderWordByWordList();

    elements.aiLoading?.classList.add("hidden");
    elements.aiContent?.classList.add("hidden");
    if (elements.btnFetchAi) {
        elements.btnFetchAi.classList.remove("hidden");
        elements.btnFetchAi.disabled = false;
    }
    elements.detailModal?.classList.remove("hidden");
}

export function closeDetailModal() {
    elements.detailModal?.classList.add("hidden");
}

function renderAIError(msg) {
    elements.aiLoading?.classList.add("hidden");
    if (elements.aiContent) {
        elements.aiContent.classList.remove("hidden");
        elements.aiContent.innerHTML =
            `<p class="text-xs text-rose-600 font-semibold p-4 bg-rose-50 rounded-xl border border-rose-200 text-center">${msg}</p>`;
    }
}

function renderAIResult(data) {
    elements.modalTerkipMeaning.textContent = data.terkip_anlami;
    elements.modalTafsirContext.textContent = data.tafsir_baglami;
    elements.modalNuzulInfo.textContent = data.nuzul_ve_teknik;

    elements.modalWordBreakdown.innerHTML = data.kelime_analizi.map(w => `
        <div class="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
            <div class="font-bold text-emerald-900 text-base mb-1">
                ${w.kelime} &bull; <span class="text-slate-800 font-semibold">${w.anlam}</span>
            </div>
            <div class="text-slate-600 text-xs md:text-sm leading-relaxed">${w.kok_ve_gramer}</div>
        </div>`).join("");

    elements.aiLoading.classList.add("hidden");
    elements.aiContent.classList.remove("hidden");
}

async function handleAiAnalysis() {
    if (!state.selectedWords.length) return;
    const verseNum = +state.selectedWords[0].dataset.verse;

    elements.btnFetchAi.classList.add("hidden");
    elements.aiLoading.classList.remove("hidden");
    elements.aiContent.classList.add("hidden");

    try {
        const data = await analyzeSelection({
            arabicText: selectedArabicText(),
            translation: verseTranslation(verseNum),
            surahName: getSurahName(state.currentSurah)
        });
        renderAIResult(data);
    } catch (err) {
        console.error("AI Analiz Hatası:", err);
        renderAIError(err.message || "Yapay zeka tahlili alınırken bir sorun oluştu.");
    }
}

export function bindModalEvents() {
    elements.btnFetchAi?.addEventListener("click", handleAiAnalysis);
    elements.closeModalBtn?.addEventListener("click", closeDetailModal);
    elements.detailModal?.addEventListener("click", e => {
        if (e.target === elements.detailModal) closeDetailModal();
    });
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeDetailModal();
    });
}