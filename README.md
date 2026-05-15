# Company Panel App

Bu proje iki ana klasörden (katmandan) oluşmaktadır. Detaylı teknik bilgiler ve API dökümantasyonları için ilgili klasörlerdeki README dosyalarına göz atabilirsiniz:

1. **[Backend (Sunucu)](./backend/README.md)**: Node.js, Express ve TypeScript ile geliştirilmiş REST API.
2. **[Frontend (Arayüz)](./frontend/README.md)**: React, Vite, Ant Design ve TypeScript ile geliştirilmiş kullanıcı arayüzü.

## Projeyi Çalıştırma

Projeyi lokal bilgisayarınızda çalıştırmak için backend ve frontend sunucularını aynı anda ayağa kaldırmanız gerekmektedir.

### 1. Backend'i Başlatma

Önce API servisinin çalışması gerekir. Terminalden `backend` klasörüne giderek işlemleri başlatın:

```bash
cd backend
npm install

# .env dosyanızın ayarlandığından emin olun (PORT=5001)
npm run dev
```
Backend sunucusu `http://localhost:5001` adresinde çalışacaktır.

### 2. Frontend'i Başlatma

Yeni bir terminal penceresi açın ve `frontend` klasörüne geçiş yapın:

```bash
cd frontend
npm install
npm run dev
```

Frontend uygulaması `http://localhost:5173` adresinde çalışacaktır. Tarayıcınızdan bu adrese giderek yönetim panelini kullanmaya başlayabilirsiniz.
