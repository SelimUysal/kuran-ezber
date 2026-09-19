import { elements } from "../dom/elements.js";
import { state } from "../state.js";
import { SURAHS } from "../data/surahs.js";

export function populateSurahSelect() {
    const select = elements.surahSelect;
    if (!select) return;

    select.innerHTML = "";
    SURAHS.forEach(({ id, name }) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = `${id} - ${name}`;
        select.appendChild(option);
    });
    select.value = state.currentSurah;
}

export function getSurahName(id) {
    return SURAHS.find(s => s.id === id)?.name ?? "";
}