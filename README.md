# Rasantara

Rasantara adalah proyek website resep makanan yang berfokus pada berbagi, menemukan, dan mengelola resep.

## Fitur

Fitur yang direncanakan untuk Rasantara:

- **Akun pengguna** — registrasi dan login.
- **Publikasi resep** — pengguna dapat mengirim resep untuk dibagikan.
- **Persetujuan admin** — resep baru berstatus menunggu persetujuan dan baru tampil ke publik setelah disetujui admin.
- **Rating dan ulasan** — pengguna dapat memberi penilaian pada resep.
- **Pengaduan** — pengguna dapat mengirim keluhan kepada pengelola.
- **Riwayat login** — pencatatan aktivitas login berhasil maupun gagal.
- **Panel admin** — mengelola pengaduan dan menyetujui atau menolak kiriman resep.

> **Status proyek:** Dalam pengembangan. Daftar fitur di atas merupakan target pengembangan dan belum berarti seluruh fitur sudah aktif.

## Teknologi

Rencana teknologi backend:

- HTML, CSS, dan JavaScript untuk frontend.
- Cloudflare Workers untuk API backend.
- Cloudflare D1 untuk database.
- Cloudflare Pages untuk hosting frontend.

## Prinsip pengembangan

- Mempertahankan desain frontend asli Rasantara.
- Backend dikembangkan terpisah agar tidak perlu merombak tampilan website.
- Resep kiriman pengguna tidak langsung dipublikasikan sebelum ditinjau admin.
- Data autentikasi dan aktivitas pengguna dikelola melalui backend.

## Pengembangan

Konfigurasi dan source code backend akan ditambahkan ke repository ini secara bertahap. Jangan menaruh token, password, API key, atau secret di file publik maupun repository.

## Repository

https://github.com/asybn867-crypto/Rasantara


## Backend Cloudflare (implementasi)

Source backend tersedia pada `worker.js`, skema database pada `schema.sql`, dan konfigurasi pada `wrangler.toml`.

1. Buat database D1 bernama `rasantara-db` di Cloudflare.
2. Ganti `database_id` di `wrangler.toml` dengan ID D1 milikmu.
3. Ganti `ADMIN_EMAIL` dengan email akun admin yang akan didaftarkan pertama kali.
4. Jalankan `npx wrangler d1 execute rasantara-db --remote --file=schema.sql`.
5. Deploy dengan `npx wrangler deploy`.

API menyediakan registrasi/login, komentar publik, penyimpanan komplain di D1, dan endpoint daftar komplain khusus admin. Jangan memasukkan password atau token ke repository.
