# Backend API Winbu Scraper

Backend API untuk scraping data dari website [Winbu.tv](https://winbu.tv/). API ini dibuat menggunakan Express.js dan Cheerio untuk web scraping.

## 📋 Daftar Isi

- [Instalasi](#instalasi)
- [Menjalankan Server](#menjalankan-server)
- [Endpoints](#endpoints)
  - [GET /api/home](#get-apihome)
  - [GET /api/anime/:id](#get-apianimeid)
  - [GET /api/series/:id](#get-apiseriesid)
  - [GET /api/film/:id](#get-apifilmid)
  - [GET /api/episode/:id](#get-apiepisodeid)
  - [GET /api/server/:id](#get-apiserverid)
- [Dependencies](#dependencies)
- [Struktur Response](#struktur-response)

---

## 🚀 Instalasi

1. Clone repository
2. Install dependencies:

```bash
npm install
```

## ▶️ Menjalankan Server

### Development Mode (dengan nodemon):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

---

## 📡 Endpoints

### GET /api/home

Mengambil data dari halaman utama Winbu.tv.

**Response:**
```json
{
  "status": "success",
  "data": {
    "top10_anime": [...],
    "latest_anime": [...],
    "top10_film": [...],
    "latest_film": [...],
    "jepang_korea_china_barat": [...],
    "tv_show": [...]
  }
}
```

**Detail Response:**

- **top10_anime**: Array berisi 10 anime series terpopuler
  ```json
  {
    "rank": "1",
    "title": "Judul Anime",
    "rating": "8.5",
    "image": "URL_Gambar",
    "type": "anime",
    "id": "nama-anime",
    "link": "https://winbu.tv/anime/nama-anime/"
  }
  ```

- **latest_anime**: Array berisi anime terbaru
  ```json
  {
    "title": "Judul Anime",
    "episode": "Episode 12",
    "time": "2 jam yang lalu",
    "views": "1.2K",
    "image": "URL_Gambar",
    "type": "anime",
    "id": "nama-anime",
    "link": "https://winbu.tv/anime/nama-anime/"
  }
  ```

- **top10_film**: Array berisi 10 film terpopuler
- **latest_film**: Array berisi film terbaru
- **jepang_korea_china_barat**: Array berisi konten dari Jepang, Korea, China, dan Barat
- **tv_show**: Array berisi TV Show terbaru

---

### GET /api/anime/:id

Mengambil detail anime berdasarkan ID/slug.

**Parameter:**
- `id` (string): Slug anime dari URL (contoh: `one-piece`)

**Example Request:**
```
GET /api/anime/one-piece
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "title": "One Piece",
    "image": "URL_Gambar",
    "synopsis": "Sinopsis anime...",
    "info": {
      "rating": "9.0",
      "season": "Fall 2023",
      "genres": [
        {
          "name": "Action",
          "url": "https://winbu.tv/genre/action/"
        }
      ]
    },
    "episodes": [
      {
        "title": "Episode 1",
        "id": "one-piece-episode-1",
        "link": "https://winbu.tv/one-piece-episode-1/"
      }
    ],
    "recommendations": [
      {
        "title": "Naruto",
        "rating": "8.5",
        "image": "URL_Gambar",
        "type": "anime",
        "id": "naruto",
        "link": "https://winbu.tv/anime/naruto/"
      }
    ]
  }
}
```

---

### GET /api/series/:id

Mengambil detail series (drama/TV series) berdasarkan ID/slug.

**Parameter:**
- `id` (string): Slug series dari URL

**Example Request:**
```
GET /api/series/breaking-bad
```

**Response:**
Struktur response sama dengan `/api/anime/:id`

---

### GET /api/film/:id

Mengambil detail film berdasarkan ID/slug.

**Parameter:**
- `id` (string): Slug film dari URL

**Example Request:**
```
GET /api/film/avatar-2009
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "title": "Avatar",
    "image": "URL_Gambar",
    "synopsis": "Sinopsis film...",
    "stream_options": [
      {
        "server": "Server 1",
        "data_post": "12345",
        "data_nume": "1",
        "data_type": "schtml"
      }
    ],
    "info": {
      "rating": "8.0",
      "genres": [
        {
          "name": "Action",
          "url": "https://winbu.tv/genre/action/"
        }
      ]
    },
    "recommendations": [...]
  }
}
```

**stream_options**: Data yang diperlukan untuk streaming video, gunakan dengan endpoint `/api/server/:id`

---

### GET /api/episode/:id

Mengambil detail episode dan link download.

**Parameter:**
- `id` (string): Slug episode dari URL

**Example Request:**
```
GET /api/episode/one-piece-episode-1
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "title": "One Piece Episode 1",
    "downloads": [
      {
        "resolution": "720p",
        "links": [
          {
            "server": "Google Drive",
            "url": "https://link-download.com"
          }
        ]
      }
    ],
    "stream_options": [
      {
        "server": "Server 1",
        "data_post": "12345",
        "data_nume": "1",
        "data_type": "schtml"
      }
    ],
    "note": "Untuk mendapatkan link embed asli, lakukan GET request ke /api/server/:id dengan query params nume dan type"
  }
}
```

---

### GET /api/server/:id

Mengambil URL embed video dari server streaming.

**Parameter:**
- `id` (string): Post ID dari `data_post` pada `stream_options`
- `nume` (query): Nomor server dari `data_nume`
- `type` (query): Tipe stream dari `data_type`

**Example Request:**
```
GET /api/server/12345?nume=1&type=schtml
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "embed_url": "https://player.example.com/embed/..."
  }
}
```

> **Note:** Endpoint ini melakukan POST request ke `https://winbu.tv/wp-admin/admin-ajax.php` untuk mengambil embed URL asli.

---

## 📦 Dependencies

```json
{
  "express": "^4.21.2",
  "axios": "^1.13.2",
  "cheerio": "^1.1.2",
  "cors": "^2.8.5"
}
```

**Dev Dependencies:**
```json
{
  "nodemon": "^3.1.11"
}
```

---

## 🔧 Struktur Response

### Success Response
```json
{
  "status": "success",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error message"
}
```

Status codes:
- `200`: Success
- `400`: Bad Request (parameter tidak lengkap)
- `500`: Server Error (gagal scraping atau error lainnya)

---

## 🛠️ Utility Functions

### parseLink(url)

Fungsi helper untuk parsing URL dan mengekstrak type dan ID.

**Parameter:**
- `url` (string): URL lengkap dari Winbu.tv

**Return:**
```javascript
{
  slug: "anime",      // type konten (anime/series/film)
  id: "one-piece",    // ID/slug konten
  original: "https://winbu.tv/anime/one-piece/"  // URL asli
}
```

---

## 📝 Notes

1. Semua endpoint menggunakan User-Agent untuk menghindari blocking dari server
2. Data diambil secara real-time dari website Winbu.tv
3. Tidak ada caching, setiap request akan melakukan scraping ulang
4. Response time tergantung kecepatan website sumber

---

## ⚠️ Disclaimer

API ini dibuat untuk tujuan edukasi. Pastikan Anda mematuhi Terms of Service dari website yang di-scrape.

---

## 📄 License

ISC
