import { elements } from "../dom/elements.js";
import { state } from "../state.js";
import { clearWordSelection, finalizeWordSelection } from "./selection.js";

// Besmele'nin farklı Arapça yazım şekillerini yakalamak için
//const BISMILLAH_REGEX =
    ///^بِسْمِ\s+(?:ٱ|ا)?للَّهِ\s+(?:ٱ|ا)?لرَّحْمَٰنِ\s+(?:ٱ|ا)?لرَّحِيمِ\s*/;
const BISMILLAH_REGEX =
    /^بِسْمِ\s+ٱ?للَّهِ\s+ٱ?لرَّحْمَٰنِ\s+ٱ?لرَّحِيمِ\s*/;


function applyFontClasses() {
    if (elements.quranContainer) {
        elements.quranContainer.className =
            `space-y-6 overflow-y-auto max-h-[72vh] pr-2 font-arabic text-right dir-rtl ${state.selectedFont}`;
    }

    if (elements.bismillahText) {
        elements.bismillahText.className =
            `text-2xl md:text-3xl font-arabic text-emerald-800 tracking-wide ${state.selectedFont}`;
    }
}

export function updateFont() {
    applyFontClasses();
}

/**
 * API'den gelen 1. ayetin başındaki Besmele'yi temizler.
 *
 * Fâtiha'da Besmele ayrıca üstte gösterildiği için
 * ayetin içindeki Besmele de burada kaldırılır.
 *
 * Diğer sûrelerde de API Besmele'yi ayet metnine dahil etmişse
 * yine kaldırılır.
 */
function stripBismillah(ayah) {
    if (ayah.numberInSurah !== 1) {
        return ayah.text;
    }

    return ayah.text
        .replace(BISMILLAH_REGEX, "")
        .trim();
}

function buildWordsHTML(ayah, rawText) {
    const words = rawText.split(" ").filter(Boolean);

    return words
        .map((word, idx) =>
            `<span class="word-span select-none cursor-pointer transition-colors"
                    data-verse="${ayah.numberInSurah}"
                    data-word-idx="${idx}"
                    data-total-words="${words.length}">${word}</span>`
        )
        .join(" ");
}

function createVerseElement(ayah) {
    const verseDiv = document.createElement("div");
console.log("AYET:", ayah.numberInSurah, ayah.text);

    verseDiv.className =
        "verse-box border border-slate-200 rounded-lg p-4 relative bg-white transition-all mb-4";

    verseDiv.dataset.verseNumber = ayah.numberInSurah;
    verseDiv.dataset.verseId = ayah.numberInSurah;

    // Sadece 1. ayetteki gömülü Besmele'yi temizle
    const processedText = stripBismillah(ayah);

    verseDiv.innerHTML = `
        <div class="flex items-start justify-between">
            <span class="verse-num-badge inline-flex items-center justify-center w-7 h-7 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full ml-3 border border-emerald-300 select-none cursor-pointer hover:bg-emerald-200 transition-colors"
                  title="Tüm ayeti seçmek için tıklayın">${ayah.numberInSurah}</span>

            <p class="text-xl md:text-2xl text-slate-800 leading-loose flex-1 text-right dir-rtl select-none">
                ${buildWordsHTML(ayah, processedText)}
            </p>
        </div>`;

    verseDiv.querySelector(".verse-num-badge").addEventListener("click", () => {
        clearWordSelection();

        verseDiv.querySelectorAll(".word-span").forEach(el => {
            state.selectedWords.push(el);
            el.classList.add("word-selected");
        });

        finalizeWordSelection();
    });

    return verseDiv;
}

export function renderSurah(ayahs) {
    elements.loadingSpinner?.classList.add("hidden");

    // Besmele sadece Fâtiha'da gösterilir
    const isFatiha = Number(state.currentSurah) === 1;

    if (elements.bismillahBox) {
        elements.bismillahBox.classList.toggle("hidden", !isFatiha);
    }

    if (elements.quranContainer) {
        elements.quranContainer.classList.remove("hidden");
        elements.quranContainer.innerHTML = "";

        applyFontClasses();

        const fragment = document.createDocumentFragment();

        ayahs.forEach(ayah => {
            fragment.appendChild(createVerseElement(ayah));
        });

        elements.quranContainer.appendChild(fragment);
    }
}

export function showLoading() {
    elements.loadingSpinner?.classList.remove("hidden");
    elements.quranContainer?.classList.add("hidden");
}

export function showLoadError() {
    if (!elements.loadingSpinner) return;

    elements.loadingSpinner.innerHTML = `
        <p class="text-rose-600 text-sm font-semibold">
            Veriler yüklenirken bir hata oluştu.
        </p>
        <p class="text-xs text-slate-400">
            Lütfen internet bağlantınızı kontrol edip sayfayı yenileyin.
        </p>`;
}
