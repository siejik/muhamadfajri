# Portfolio Muhamad Fadjri

Website portfolio statis dengan **Tailwind CSS** dan konsep **glassmorphism**. Tanpa framework, tanpa build wajib: CSS hasil compile sudah disertakan (`assets/css/style.css`).

## Halaman

- `index.html` beranda (coding project + kartu menuju halaman desain)
- `canva.html` semua Canva project, `adobe.html` semua project Photoshop dan Illustrator (dengan filter)
- Tambah project Canva/Adobe: salin satu `<li class="proj ...">` di `canva.html` atau `adobe.html`. Tailwind membaca semua file `*.html`.

## Struktur

```
index.html            halaman utama (semua konten ada di sini)
assets/js/main.js     semua animasi dan interaksi
assets/css/style.css  hasil compile Tailwind (jangan diedit manual)
src/input.css         sumber CSS custom (glass, keyframes, dll.)
tailwind.config.js    warna, font, animasi
assets/img/           gambar hasil ekstrak dari PDF, sudah dioptimasi (.webp)
vercel.json           konfigurasi deploy + cache
```

## Deploy ke Vercel

1. Upload folder ini ke GitHub (atau jalankan `npx vercel` dari folder ini).
2. Di vercel.com pilih **Add New > Project**, lalu import repo.
3. Framework Preset: **Other**. Biarkan pengaturan lain, `vercel.json` sudah mengatur semuanya. Klik **Deploy**.

Vercel akan menjalankan `npm run build` (compile Tailwind), lalu menyajikan folder root.

## Mengedit

- **Tambah coding project**: salin satu `<article class="tilt glass group ...">` di bagian Coding project di `index.html`, ganti judul, URL, chip, deskripsi, dan nama gambar (`assets/img/code-*.webp`, screenshot 1900x910 tanpa bar browser). Gambar kedua (opsional) muncul saat kartu di-hover.
- **Project yang disembunyikan** (foto produk, Illustrator, Photoshop, video) disimpan di `<template id="arsip-project">` di akhir section project. Pindahkan `<li>`-nya ke `<ul id="proj-grid">` untuk menampilkannya lagi.
- **Tambah Canva project**: salin satu blok `<li class="proj ...">` di `index.html`, ganti gambar dan atribut `data-title`, `data-brand`, `data-tool`, `data-media`, `data-desc`, `data-imgs`, `data-link`. Atribut `data-cat` menentukan filter (`photoshop`, `canva`, `illustrator`, `foto`, `video`).
- **Ganti kontak**: cari `wa.me` dan `instagram.com` di `index.html`.
- **Ganti warna**: `tailwind.config.js` (`macaw`, `sun`, `leaf`, `ink`).
- Setelah mengubah class Tailwind, jalankan `npm install` lalu `npm run build` (atau `npm run dev` untuk mode watch).

## Tema gelap / terang

- Tombol tema ada di navbar. Pilihan pengunjung disimpan di browser; kunjungan pertama mengikuti tema sistem mereka.
- Semua warna tema ada di variabel CSS di `src/input.css` (blok `:root` untuk gelap, `html.light` untuk terang). Mau ubah warna terang, edit blok `html.light`.
- Kartu project memakai class `keep-dark` supaya teks di atas gambar selalu terbaca di kedua tema. Beri class ini untuk kartu baru.
- Setelah mengubah `src/input.css`, jalankan `npm run build`.

## Preview link saat dibagikan

Setelah domain Vercel kamu jadi, ubah `og:image` di `<head>` `index.html` menjadi alamat lengkap, misalnya `https://namakamu.vercel.app/assets/img/og.jpg`, supaya preview muncul di WhatsApp dan media sosial.

## Performa dan loading screen

- Loading screen tampil sekali per kunjungan (tidak muncul saat kembali dari halaman Canva/Adobe). Tambahkan `?loader` di URL untuk memaksanya muncul.
- Blob latar tidak lagi memakai `filter: blur`, kursor dan spotlight bergerak lewat `transform`, section di bawah layar memakai `content-visibility`, dan loop animasi berhenti saat idle.
- Mode ringan aktif otomatis hanya jika perangkat terukur lag (tersimpan di localStorage). Paksa dengan `?lite=1`, matikan dengan `?lite=0`.
- Cache: gambar `immutable` 1 tahun, CSS/JS selalu revalidasi (aman untuk update). Jika mengganti gambar, beri nama file baru.
