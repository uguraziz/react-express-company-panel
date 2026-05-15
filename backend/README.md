# Backend

Express + TypeScript ile geliştirilmiş REST API.

## Kullanılan Teknolojiler

- Node.js + Express
- TypeScript
- JSON Web Token
- Bcrypt

## Kurulum

```bash
npm install
```

`.env` dosyası oluştur:

```
PORT=5001
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

API `http://localhost:5001` adresinde çalışır.

## Endpoints

### Auth
| Method | URL | Açıklama |
|--------|-----|----------|
| POST | `/api/auth/login` | Giriş yap, token döner |
| POST | `/api/auth/register` | Yeni kullanıcı oluştur |

### Companies
| Method | URL | Açıklama |
|--------|-----|----------|
| GET | `/api/companies` | Tüm şirketleri listele |
| POST | `/api/companies` | Yeni şirket ekle |
| PUT | `/api/companies/:id` | Şirketi güncelle |
| DELETE | `/api/companies/:id` | Şirketi sil |

### Products
| Method | URL | Açıklama |
|--------|-----|----------|
| GET | `/api/products` | Tüm ürünleri listele |
| POST | `/api/products` | Yeni ürün ekle |
| PUT | `/api/products/:id` | Ürünü güncelle |
| DELETE | `/api/products/:id` | Ürünü sil |

> Companies ve Products endpoint'leri için Authorization header'ında geçerli bir Bearer token gereklidir.

## Notlar

- Veriler bellekte tutuluyor, sunucu yeniden başlayınca seed data'ya dönüyor.
- Şifreler bcrypt ile hash'leniyor.
- Token süresi 24 saat.
