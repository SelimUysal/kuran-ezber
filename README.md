# 📖 Kuran Ezber Projesi
##  Canlı Önizleme
Projeyi internet üzerinden hemen incelemek için tıklayın:
👉 [Canlı Siteye Git](https://selimuysal.github.io/kuran-ezber/)
📖 Kur’an Ezber Projesi
🌐 Canlı Önizleme

Projeyi internet üzerinden hemen incelemek için:

👉 Canlı Siteye Git

Quranic Interactive Analysis & Audio Player Web App

Modern ve duyarlı bir web uygulaması olan bu proje; interaktif Kur’an okuma, kelime bazlı seçim, özelleştirilebilir ses oynatma kontrolleri ve Google Gemini AI destekli gelişmiş dilbilimsel analiz özellikleri sunar.

🌟 Proje Özellikleri
📝 Gelişmiş Metin ve Kelime Seçimi (selection.js)

Fareyle sürükleyerek kelime aralığı seçme (drag selection).

Shift + Click ile iki kelime arasındaki aralığı seçme.

Sağ tık bağlam menüsü (context menu) desteği.

Ayet numarasına tıklayarak ayetin tamamını tek seferde seçebilme.

Boş alana tıklandığında (click-away) mevcut seçimi otomatik olarak temizleme.

🔊 Akıllı Ses ve Hız Kontrolleri (controls.js)

0.5x ile 5.0x arasında dinamik oynatma hızı ayarı.

Ön tanımlı hız butonları (preset buttons) ile hızlı geçiş.

Oynatma hızı ile arayüzün senkronize edilmesi.

Döngü (loop) sayacının takibi.

🤖 Yapay Zekâ Destekli Derinlemesine Tahlil (geminiService.js & modal.js)

Seçilen Arapça kelime gruplarını (terkipleri) Google Gemini modellerine yedekli olarak gönderme.

Bütüncül terkip anlamı, kelime bazlı kök ve gramer yapısı, tefsir bağlamı ve nüzul sebebi gibi bilgileri JSON formatında alma.

Yapay zekâ tarafından oluşturulan analiz sonuçlarını modal penceresinde görselleştirme.

Bir Gemini modelinde hata oluşması durumunda sonraki modele otomatik olarak geçme (fallback).

📚 Dinamik Sûre ve Font Yönetimi (surahSelect.js & renderer.js)

Sûre listesinin otomatik olarak oluşturulması.

Fâtiha sûresine özel Besmele yönetimi ve temizliği (stripBismillah).

Özelleştirilebilir Arapça yazı tipi stilleri.

Dinamik Arapça font boyutu yönetimi (--arabic-word-size).

📂 Mimari ve Modüler Yapı

Proje, temiz kod (Clean Code) prensipleri gözetilerek ES6 modülleri şeklinde modüler bir yapıda tasarlanmıştır.

src/
│
├── audio/
│   └── player.js          # Ses oynatma ve hız yönetimi
│
├── dom/
│   └── elements.js        # DOM seçicileri ve element referansları
│
├── ui/
│   ├── controls.js        # Hız, font ve UI kontrol bağlantıları
│   ├── modal.js           # Kelime tahlili ve AI modal arayüz yönetimi
│   ├── renderer.js        # Ayet render etme, Besmele temizliği ve font yönetimi
│   ├── selection.js       # Kelime seçim algoritmaları
│   └── surahSelect.js     # Sûre listesi ve seçici yönetimi
│
├── services/
│   └── geminiService.js   # Gemini AI API entegrasyonu ve prompt yönetimi
│
├── data/
│   └── surahs.js          # Sûre meta verileri
│
├── state.js               # Global uygulama durumu (State)
└── config.js              # API anahtarı ve endpoint yapılandırmaları

🔄 Sistem Akışları
1. Yapay Zekâ ile Kelime Tahlili

Kullanıcı arayüzde bir veya birden fazla kelime seçip detaylar penceresini açtığında ve AI analizi istediğinde aşağıdaki süreç çalışır:

sequenceDiagram
    participant User as Kullanıcı
    participant Modal as modal.js
    participant Service as geminiService.js
    participant Gemini as Google Gemini API

    User->>Modal: Kelime/Terkip seç ve "AI Tahlil İste" butonuna tıkla
    Modal->>Service: analyzeSelection(arabicText, translation, surahName)
    Service->>Service: buildPrompt() ile akademik prompt oluştur
    Service->>Gemini: HTTP POST (JSON Response Mode)

    alt Başarılı Yanıt
        Gemini-->>Service: JSON verisi (terkip, kelime analizi, tefsir, nüzul)
        Service-->>Modal: Veriyi döndür
        Modal->>User: Modal içeriğini güncelle (renderAIResult)
    else Hata / Model Hatası
        Gemini-->>Service: Hata / Timeout
        Service->>Service: Sonraki modeli dene (Fallback)
        Service-->>Modal: Hata mesajı göster (renderAIError)
    end

2. Kelime Seçim Mekanizması
graph TD
    A[Kullanıcı Mousedown / Sürükleme] --> B{Shift tuşuna basılı mı?}
    B -- Evet --> C[handleShiftClick: İki nokta arasındaki aralığı seç]
    B -- Hayır --> D{Sürükleme yapılıyor mu?}
    D -- Evet --> E[setupDragSelection: Mouseover ile aralığı genişlet]
    D -- Hayır --> F[Tekil kelime veya ayet rozeti seçimi]

    C --> G[finalizeWordSelection: Segmentleri hesapla ve UI güncelle]
    E --> G
    F --> G

    G --> H[Oynat / Tahlil Et butonlarını aktif et]

🚀 Kurulum ve Başlangıç
1. Projeyi Klonlayın
git clone https://github.com/kullanici-adi/proje-adi.git
cd proje-adi

2. Gemini API Anahtarını Tanımlayın

src/config.js dosyasında API anahtarınızı tanımlayın:

export const GEMINI_API_KEY = "BURAYA_API_ANAHTARINIZI_YAZIN";


⚠️ Güvenlik Uyarısı: Bu proje frontend tabanlı ve GitHub Pages üzerinde çalışıyorsa API anahtarını doğrudan JavaScript dosyasına koymak anahtarın kullanıcılar tarafından görülebilmesine neden olabilir. Gerçek kullanımda API anahtarını istemci tarafında saklamak yerine bir backend/proxy üzerinden yönetmeniz önerilir.

3. Projeyi Çalıştırın

Projeyi modern bir tarayıcıda veya Live Server gibi bir yerel geliştirme sunucusu üzerinden çalıştırabilirsiniz.

🛠️ Kullanılan Teknolojiler

Vanilla JavaScript — ES6 Modules

Tailwind CSS — Dinamik sınıf yönetimi ve modern kullanıcı arayüzü

Google Gemini API — Metin analizi ve filolojik/dilbilimsel tahlil

GitHub Pages — Canlı yayınlama ve barındırma

📌 Notlar

Proje geliştirme sürecinde modülerlik, okunabilirlik ve sürdürülebilirlik ön planda tutulmuştur.

AI tarafından üretilen dilbilimsel ve tefsir içerikleri yardımcı niteliktedir; akademik veya dinî çalışmalarda kullanılmadan önce güvenilir kaynaklarla ayrıca doğrulanmalıdır.
