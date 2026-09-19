import { API, GEMINI_API_KEY, GEMINI_MODELS } from "../config.js";

function buildPrompt(arabicText, translation, surahName) {
    return `
Sen uzman bir Kur'an Arapçası, Filoloji ve Tefsir akademisyenisin.
${surahName} Suresi'nde geçen şu seçim için analiz yap:
Seçilen Arapça İfade / Terkip: "${arabicText}"
Bağlam Meali: "${translation}"

SADECE aşağıdaki JSON formatında geçerli bir yanıt dön:
{
  "terkip_anlami": "Bütüncül terkip/cümle detaylı anlamı",
  "kelime_analizi": [
    {
      "kelime": "Arapça Kelime (Okunuş)",
      "anlam": "Tekil kelime anlamı",
      "kok_ve_gramer": "Kökü, gramer yapısı ve ek vurguları"
    }
  ],
  "tafsir_baglami": "Ayet içindeki tefsir ve mana bağlamı",
  "nuzul_ve_teknik": "Ayetin nüzul sebebi/arkaplanı veya teknik detaylar"
}`;
}

export async function analyzeSelection({ arabicText, translation, surahName }) {
    const key = (GEMINI_API_KEY || "").trim();
    if (!key || key.startsWith("YENI_")) {
        throw new Error("API anahtarı tanımlı değil. js/config.js dosyasını kontrol edin.");
    }

    const body = JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(arabicText, translation, surahName) }] }],
        generationConfig: { responseMimeType: "application/json" }
    });

    for (const model of GEMINI_MODELS) {
        try {
            const res = await fetch(API.gemini(model, key), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body
            });
            if (res.ok) {
                const result = await res.json();
                return JSON.parse(result.candidates[0].content.parts[0].text);
            }
        } catch (e) {
            console.warn(`${model} denenirken hata:`, e);
        }
    }
    throw new Error("Hiçbir Gemini modeline bağlanılamadı.");
}