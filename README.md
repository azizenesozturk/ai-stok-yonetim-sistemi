cat > README.md << 'EOF'
# 🤖 AI Destekli Stok Yönetim Sistemi

Yapay zeka tabanlı talep tahmini, otomatik sipariş önerisi ve anomali tespiti içeren, modern bir envanter yönetim sistemi.

![Durum](https://img.shields.io/badge/durum-yayında-brightgreen)

🔗 **Canlı Demo:** [ai-stok-yonetim-sistemi.vercel.app](https://ai-stok-yonetim-sistemi.vercel.app)

**Demo Hesabı:** kullanıcı adı `demo`, şifre `demo1234`

*(Not: Ücretsiz sunucu barındırma kullanıldığı için, uzun süre kullanılmayınca sunucu "uyku" moduna geçer — ilk açılış 30-50 saniye kadar sürebilir, sabırlı olun 🙂)*

## ✨ Özellikler

- 📦 **Ürün, Kategori, Tedarikçi Yönetimi** — Tam CRUD işlemleri
- 📊 **Stok Hareketi Takibi** — Giriş, çıkış, iade, fire kayıtları; stok otomatik güncellenir
- 🧠 **AI Talep Tahmini** — Geçmiş satış verisine dayalı, trend analizli günlük/haftalık tahmin
- 📈 **Otomatik Sipariş Önerisi** — Tahmin + mevcut stok + tedarikçi teslimat süresine göre "ne zaman, ne kadar sipariş verilmeli" önerisi
- 🚨 **Anomali Tespiti** — İstatistiksel (z-skoru) yöntemle beklenmedik satış hareketlerini yakalama
- 🔐 **JWT Tabanlı Kimlik Doğrulama** — Kayıt, giriş, korumalı sayfalar
- 🎨 **Modern, Premium Arayüz** — Koyu tema, glassmorphism, neon vurgular, mobil uyumlu

## 🛠️ Teknoloji Yığını

**Backend:**
- FastAPI (Python)
- PostgreSQL + SQLAlchemy (ORM)
- Pandas / NumPy (tahmin motoru)
- JWT (python-jose) + bcrypt (kimlik doğrulama)

**Frontend:**
- React (Vite)
- Tailwind CSS v4
- Recharts (veri görselleştirme)
- React Router

**Deployment:**
- Frontend → Vercel
- Backend → Render
- Veritabanı → Neon (Serverless PostgreSQL)

## 📸 Ekran Görüntüleri

*(Buraya dashboard, ürün detay grafiği gibi ekran görüntüleri eklenecek)*

## 🚀 Yerel Kurulum

### Backend

\`\`\`bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows
pip install -r requirements.txt
# .env dosyasında DATABASE_URL ve SECRET_KEY ayarlanmalı
uvicorn main:app --reload
\`\`\`

### Frontend

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## 🧠 AI Tahmin Yöntemi

Tahmin motoru, karmaşık bir kara kutu yerine **açıklanabilir** bir istatistiksel yaklaşım kullanır:

1. Son 90 günün günlük satış verisi çekilir
2. Son 30 güne ağırlıklı hareketli ortalama uygulanır (yakın geçmiş daha önemli)
3. İlk yarı / ikinci yarı karşılaştırmasıyla trend (artan/azalan/stabil) tespit edilir
4. Sipariş önerisi, tedarikçinin teslimat süresi + güvenlik stoğu hesaba katılarak üretilir
5. Anomaliler, z-skoru yöntemiyle (satışın ortalamadan kaç standart sapma uzakta olduğu) tespit edilir

## 📁 Proje Yapısı

\`\`\`
ai-stok-yonetim/
├── backend/
│   ├── main.py              # FastAPI giriş noktası
│   ├── models.py            # SQLAlchemy veritabanı modelleri
│   ├── schemas.py           # Pydantic şemaları
│   ├── forecasting.py       # AI tahmin/öneri/anomali motoru
│   ├── auth.py              # JWT ve şifre işlemleri
│   └── routers/             # API endpoint'leri
└── frontend/
    └── src/
        ├── pages/           # Dashboard, Ürünler, Kategoriler vb.
        ├── components/      # Yeniden kullanılabilir UI bileşenleri
        ├── context/         # Auth context (kullanıcı oturumu)
        └── api.js           # Backend API çağrıları
\`\`\`

## 👤 Geliştirici

**Aziz Enes Öztürk**
[GitHub](https://github.com/azizenesozturk)

---

*Bu proje kişisel öğrenme ve portföy amacıyla geliştirilmiştir.*
EOF