// ⚠️ Bu dosyayı .gitignore'a ekleyin. Anahtarı yeniden oluşturup buraya yazın.
export const GEMINI_API_KEY = "YENI_ANAHTARINIZI_BURAYA_YAZIN";

export const API = {
    alQuranCloud: (surah, reciter) =>
        `https://api.alquran.cloud/v1/surah/${surah}/editions/${reciter},tr.diyanet`,
    quranComWbw: (surah) =>
        `https://api.quran.com/api/v4/verses/by_chapter/${surah}?words=true&word_fields=text_uthmani&per_page=300`,
    gemini: (model, key) =>
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`
};

export const GEMINI_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash"];

export const DEFAULTS = {
    surah: 67,
    reciter: "ar.alafasy",
    font: "font-amiri",
    loopCount: 3
};

export const AUDIO = {
    tickIntervalMs: 20,
    nextSegmentDelayMs: 100,
    errorSkipDelayMs: 200
};