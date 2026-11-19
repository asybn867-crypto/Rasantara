# Rasantara

Website resep kuliner Nusantara. Desain dan susunan halaman asli dipertahankan; integrasi backend berada di `worker/` dan `src/script.js`.

## Fitur backend

- Registrasi dan login dengan password hash PBKDF2.
- Riwayat login berhasil/gagal untuk pengguna dan panel riwayat admin.
- Pengaduan pengguna dan pengelolaan status oleh admin.
- Resep komunitas masuk ke status `pending`; hanya resep `approved` yang tampil ke publik.
- Rating dan ulasan disimpan di Cloudflare D1.
- Panel admin untuk menyetujui/menolak resep serta menangani pengaduan.

## 1. Buat database D1

```bash
npx wrangler d1 create rasantara-db
```

Salin `database_id` dari hasil perintah ke `database_id` di `wrangler.toml`, menggantikan `PASTE_D1_DATABASE_ID_HERE`.

Jalankan skema:

```bash
npx wrangler d1 execute rasantara-db --remote --file=worker/schema.sql
```

## 2. Konfigurasi Worker

Edit `FRONTEND_ORIGIN` di `wrangler.toml` menjadi origin situs Pages, misalnya `https://nama-project.pages.dev` (tanpa garis miring terakhir). Setelah itu buat secret:

```bash
npx wrangler secret put JWT_SECRET
```

Masukkan secret acak yang panjang dan simpan dengan aman. Jangan masukkan secret ke HTML, JavaScript frontend, atau GitHub.

Deploy API:

```bash
npx wrangler deploy
```

Salin URL Worker yang tampil, lalu ganti nilai `RASANTARA_API` di **kedua** file berikut:

- `src/script.js`
- `dist/script.js`

Contoh URL: `https://rasantara-api.username.workers.dev`.

## 3. Deploy frontend ke Cloudflare Pages

Jika repository berisi folder `src/` dan `dist/` seperti paket ini, atur Cloudflare Pages:

- Build command: kosongkan
- Build output directory: `dist`

Pastikan `FRONTEND_ORIGIN` pada Worker sama persis dengan domain Pages yang aktif. Jika domain berubah, perbarui variabel tersebut dan deploy ulang Worker.

## 4. Jadikan akun pertama sebagai admin

Daftarkan akun lewat website terlebih dahulu. Kemudian jalankan perintah berikut, ganti email dengan email akun yang baru dibuat:

```bash
npx wrangler d1 execute rasantara-db --remote --command "UPDATE users SET role='admin' WHERE email='admin@email.com';"
```

Keluar lalu masuk kembali agar sesi memuat role admin. Tombol **Panel Admin** akan muncul. Hak admin tetap diverifikasi di Worker.

## Catatan

- Akun lama yang tersimpan di `localStorage` tidak otomatis dipindahkan. Pengguna perlu mendaftar ulang karena sistem lama menyimpan password di browser dan tidak aman untuk migrasi langsung.
- Token sesi disimpan di `sessionStorage`, sehingga sesi berakhir ketika tab/sesi browser ditutup atau token kedaluwarsa (7 hari).
- Resep baru tidak memperoleh poin sampai disetujui admin; poin +50 diberikan saat persetujuan. Ulasan baru memperoleh +10 poin.
- Rating satu pengguna untuk satu resep akan diperbarui jika dikirim ulang, bukan membuat rating ganda.
- URL gambar resep komunitas harus menggunakan HTTPS.
- `src/` adalah sumber kerja; `dist/` disamakan untuk deployment Pages statis.
