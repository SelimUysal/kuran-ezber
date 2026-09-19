export function clearActiveWords() {
    document.querySelectorAll(".word-span.active-word").forEach(el =>
        el.classList.remove("active-word")
    );
}

export function clearActiveVerseBoxes() {
    document.querySelectorAll(".verse-box.active-verse-box").forEach(el =>
        el.classList.remove("active-verse-box")
    );
}

export function highlightVerseBox(verseNum) {
    clearActiveVerseBoxes();
    const box = document.querySelector(`[data-verse-id="${verseNum}"]`);
    if (box) {
        box.classList.add("active-verse-box");
        box.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

export function updateCurrentWordHighlight(segment, startTime, endTime, currentTime) {
    const words = segment.words;
    if (!words?.length) return;

    clearActiveWords();

    const total = endTime - startTime;
    if (total <= 0) return;

    const progress = Math.max(0, Math.min(1, (currentTime - startTime) / total));
    const idx = Math.min(words.length - 1, Math.floor(progress * words.length));
    words[idx]?.classList.add("active-word");
}