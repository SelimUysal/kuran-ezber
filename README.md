Quranic Interactive Analysis & Audio Player Web App

A modern, highly responsive web application built with vanilla JavaScript and Tailwind CSS, designed for interactive Quran reading, word-by-word selections, custom audio playback controls, and advanced linguistic analysis powered by Google's Gemini AI.

🌟 Proje Özellikleri (Core Features)

Gelişmiş Metin ve Kelime Seçimi (selection.js):

Fareyle sürükleme (drag-and-selection), Shift+Click ile çoklu kelime aralığı seçimi ve sağ tık bağlam menüsü (context menu) desteği.

Ayet numarasına tıklayarak tüm ayeti tek hamlede seçebilme.

Boş alanlara tıklandığında (click-away) seçimi otomatik temizleme.

Akıllı Ses ve Hız Kontrolleri (controls.js):

0.5x ile 5.0x arasında dinamik oynatma hızı ayarı.

Ön tanımlı hız butonları (preset buttons) ile hızlı geçiş ve UI senkronizasyonu.

Döngü sayacı (loop counter) takibi.

Yapay Zeka Destekli Derinlemesine Tahlil (geminiService.js & modal.js):

Seçilen Arapça kelime grupları (terkipler) için Google Gemini modellerini yedekli olarak (GEMINI_MODELS) sorgulama.

Bütüncül terkip anlamı, kelime bazlı kök ve gramer yapısı, tefsir bağlamı ve nüzul sebebi/teknik detayları JSON formatında otomatik alma ve modal üzerinde görselleştirme.

Dinamik Sûre ve Font Yönetimi (surahSelect.js & renderer.js):

Sûre listesinin otomatik doldurulması ve Fâtiha sûresi özelinde Besmele yönetimi/temizliği (stripBismillah).

Özelleştirilebilir Arapça font stilleri ve dinamik font boyutu yönetimi (--arabic-word-size).

📂 Mimari ve Modüler Yapı (Architecture)

Proje, temiz kod (clean code) prensipleri gözetilerek modüler ES6 modülleri şeklinde tasarlanmıştır:

src/
│
├── audio/
│   └── player.js          # Ses oynatma ve hız yönetimi
├── dom/
│   └── elements.js        # DOM seçicileri ve element referansları
├── ui/
│   ├── controls.js        # Hız, font ve UI kontrol bağlamaları
│   ├── modal.js           # Kelime tahlili ve AI modal arayüz yönetimi
│   ├── renderer.js        # Ayet render etme, Besmele temizliği ve fontlar
│   ├── selection.js       # Kelime seçim algoritmaları (Sürükleme, Shift+Click)
│   └── surahSelect.js     # Sûre listesi ve seçici yönetimi
├── services/
│   └── geminiService.js   # Gemini AI API entegrasyonu ve prompt yönetimi
├── data/
│   └── surahs.js          # Sûre meta verileri
├── state.js               # Global uygulama durumu (State)
└── config.js              # API anahtarları ve endpoint konfigürasyonları


🔄 Sistem Akış Şemaları (System Workflows)

1. Yapay Zeka Kelime Tahlil Akışı (Gemini AI Workflow)

Kullanıcı arayüzde bir veya birden fazla kelime seçip detaylar penceresini açtığında ve AI analizi istediğinde şu süreç çalışır:

sequenceDiagram
    participant User as Kullanıcı
    participant Modal as modal.js
    participant Service as geminiService.js
    participant Gemini as Google Gemini API

    User->>Modal: Kelime/Terlip Seç & "AI Tahlil İste" tıkla
    Modal->>Service: analyzeSelection(arabicText, translation, surahName)
    Service->>Service: buildPrompt() ile akademik prompt oluştur
    Service->>Gemini: HTTP POST (JSON Response Mode)
    alt Başarılı Yanıt
        Gemini-->>Service: JSON Verisi (Terkip, Kelime Analizi, Tefsir, Nüzul)
        Service-->>Modal: Veriyi Dön
        Modal->>User: Modal İçeriğini Güncelle (renderAIResult)
    else Hata / Model Hatası
        Gemini-->>Service: Hata / Timeout
        Service->>Service: Sonraki modeli dene (Fallback)
        Service-->>Modal: Hata Mesajı Göster (renderAIError)
    end


2. Kelime Seçim Mekaniği (Selection Workflow)

graph TD
    A[Kullanıcı Mousedown / Sürükleme] --> B{Shift Tuşuna Basılı mı?}
    B -- Evet --> C[handleShiftClick: İki nokta arası aralığı seç]
    B -- Hayır --> D{Sürükleme (Drag) mi?}
    D -- Evet --> E[setupDragSelection: Mouseover ile aralığı genişlet]
    D -- Hayır --> F[Tekil Kelime veya Ayet Rozeti Seçimi]
    C --> G[finalizeWordSelection: Segmentleri hesapla & UI Güncelle]
    E --> G
    F --> G
    G --> H[Oynat/Tahlil Et butonlarını aktif et]


🚀 Kurulum ve Başlangıç (Getting Started)

Projeyi klonlayın:

git clone https://github.com/kullanici adi/proje-adi.git


src/config.js dosyası içerisinde Gemini API anahtarınızı tanımlayın:

export const GEMINI_API_KEY = "BURAYA_API_ANAHTARINIZI_YAZIN";


Projeyi modern bir tarayıcıda veya Live Server yardımıyla çalıştırın.

🛠️ Kullanılan Teknolojiler

Vanilla JavaScript (ES6 Modules)

Tailwind CSS (Dinamik sınıf yönetimi ve modern UI tasarımı)

Google Gemini API (Metin analizi ve filolojik tahlil)
