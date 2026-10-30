# PROJECT_STATE: Kotak Aspirasi Siswa — SMK Bagimu Negeriku

## Identitas & Lisensi
- Sekolah: SMK Bagimu Negeriku
- Inisiator & Pengembang: Seksi Bidang 3 (Teknologi & Informasi) OSIS
- Lisensi: MIT License (Open-Source untuk SMK Bagimu Negeriku)
- Logo Aset: `static/logo-smk.png` dan `static/logo-osis.jpg`

## Tech Stack & Desain
- Framework: SvelteKit 3 + Svelte 5 (Runes) + TypeScript
- Styling: Tailwind CSS v4 (Tema Biru Institusional `#1D4ED8`, `#0F2856` & Putih Bersih `#FFFFFF`, `#F8FAFC`)
- Desain & Polishing: Quiet Institutional, subtle grid depth (`bg-subtle-grid`), soft ambient shadows (`shadow-card`, `shadow-soft`), dot status indicators di Badge, live progress bar, dan kartu kategori ber-ikon interaktif.
- Ikon: Lucide Svelte (@lucide/svelte, outline, zero-emoji)
- Deployment: @sveltejs/adapter-vercel (Serverless Functions Vercel)
- Database: Supabase PostgreSQL (DDL skema & RLS di folder `supabase/`) + in-memory store lokal
- Lokasi Kode: `C:\DavidYehudaSurbakti\web\kotak-aspirasi`

## Arsitektur Rute Sistem
- `/`: 1 Halaman Terpadu Siswa dengan 4 Tab Interaktif:
  - Tab 1 `kirim`: Formulir aspirasi anonim, pusat pelaporan Bullying/Perundungan instan, tombol pintasan topik perundungan, pratinjau thumbnail bukti gambar sebelum dikirim, proteksi honeypot anti-bot & rate limiter IP, live character progress bar, auto-lock privat kategori sensitif, modal kode rahasia (`KAS-XXXX-XXXX`).
  - Tab 2 `lacak`: Auto-direct saat URL memuat `?kode=`, pencarian via kode rahasia (hash SHA-256), chip demo instan, timeline status, dan percakapan dua arah bergaya chat institusional.
  - Tab 3 `publik`: Feed aspirasi umum yang disetujui, filter kategori, pencarian kata kunci.
  - Tab 4 `panduan`: Kebijakan privasi, hotline darurat sekolah (Guru BK 0812-3456-7890, Pembina OSIS 0821-9876-5432, SAPA 129, KPAI), lisensi Sekbid 3 IT.
- `/admin-aspirasi`: Jalur Khusus Terproteksi Pengurus OSIS:
  - `/admin-aspirasi/login`: Login admin sesi server-side (HttpOnly cookie).
  - `/admin-aspirasi`: Dashboard metrik ringkasan aktual.
  - `/admin-aspirasi/reports`: Tabel dan filter aspirasi lengkap, filter rentang waktu (7d, 30d, all), dan tombol unduh Ekspor CSV instan.
  - `/admin-aspirasi/reports/[id]`: Detail laporan, mutasi status penanganan, moderasi publikasi, balasan resmi OSIS, dan viewer modal bukti lampiran gambar.
  - `/admin-aspirasi/api/export-csv`: Endpoint streaming CSV berstandar RFC 4180 dengan sanitasi formula injection.
  - `/admin-aspirasi/moderation`: Antrean persetujuan moderasi publik.
  - `/admin-aspirasi/analytics`: Metrik persentase penyelesaian dan persebaran masalah.
  - `/admin-aspirasi/audit`: Log audit aktivitas admin.
  - `/admin-aspirasi/settings`: Profil sekolah dan monitoring kuota gratis.

## Fitur Keamanan & Standar Mobile
- Anti-Spam: Honeypot field tersembunyi + Rate Limiting in-memory per IP (maksimal 5 pengiriman per 10 menit).
- PWA & Mobile Web: `static/manifest.webmanifest`, status bar `#1D4ED8`, dan standarisasi bahasa Indonesia `lang="id"`.

## Status Verifikasi Terkini
- TypeScript Check (`svelte-check`): 0 error, 0 warning.
- Production Build (`vite build` + `@sveltejs/adapter-vercel`): Berhasil (exit code 0).
- Zero-Emoji Compliance: 100% bebas dari emoji dan AI slop.
- Security: Tautan admin tidak diekspos di antarmuka publik siswa (akses melalui URL rahasia `/admin-aspirasi/login`).
