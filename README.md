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
