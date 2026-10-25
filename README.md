# Portfolio Muhamad Fadjri

Website portfolio statis dengan **Tailwind CSS** dan konsep **glassmorphism**. Tanpa framework, tanpa build wajib: CSS hasil compile sudah disertakan (`assets/css/style.css`).

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

- **Tambah project**: salin satu blok `<li class="proj ...">` di `index.html`, ganti gambar dan atribut `data-title`, `data-brand`, `data-tool`, `data-media`, `data-desc`, `data-imgs`, `data-link`. Atribut `data-cat` menentukan filter (`photoshop`, `canva`, `illustrator`, `foto`, `video`).
- **Ganti kontak**: cari `wa.me` dan `instagram.com` di `index.html`.
- **Ganti warna**: `tailwind.config.js` (`macaw`, `sun`, `leaf`, `ink`).
- Setelah mengubah class Tailwind, jalankan `npm install` lalu `npm run build` (atau `npm run dev` untuk mode watch).

## Preview link saat dibagikan

Setelah domain Vercel kamu jadi, ubah `og:image` di `<head>` `index.html` menjadi alamat lengkap, misalnya `https://namakamu.vercel.app/assets/img/og.jpg`, supaya preview muncul di WhatsApp dan media sosial.

## Liquid glass

- Gaya kaca ada di `src/input.css` (bagian "Liquid glass system"): `.glass`, `.glass-strong`, `.btn-glass`, `.fchip`, `.lq-ind`.
- Efek pembiasan tepi (lensa) dibuat di `assets/js/main.js` (bagian "Liquid glass: lensa pembias") memakai filter SVG pada `backdrop-filter`. Ini hanya aktif di browser Chromium (Chrome, Edge, Opera, Brave). Safari dan Firefox otomatis memakai fallback blur + kilau specular yang tetap rapi.
- Tambahkan atribut `data-nolens` pada elemen kaca yang tidak ingin diberi efek pembiasan.
- Pengguna dengan pengaturan "kurangi transparansi" otomatis mendapat panel solid.
