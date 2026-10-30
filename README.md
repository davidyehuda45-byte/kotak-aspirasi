# Kotak Aspirasi Digital Siswa — SMK Bagimu Negeriku

Platform aspirasi digital resmi SMK Bagimu Negeriku yang dikembangkan oleh **Seksi Bidang 3 (Teknologi & Informasi) OSIS**. Dibangun dengan prinsip *Quiet Institutional*, *Privacy by Design*, dan *Safe by Default*. Menggunakan tema visual biru-putih institusional yang bersih, modern, dan tanpa beban biaya (prioritas hosting & database Rp0).

---

## 1. Identitas & Lisensi

- **Institusi**: SMK Bagimu Negeriku
- **Pengembang & Pengelola**: Seksi Bidang 3 (Teknologi & Informasi) OSIS SMK Bagimu Negeriku
- **Lisensi**: MIT License (Didedikasikan secara terbuka untuk seluruh siswa dan civitas akademika SMK Bagimu Negeriku)
- **Motto**: Berbudi · Berkualitas · Berdaya · Berhasil
- **Aset Logo**:
  - Logo Sekolah: `static/logo-smk.png`
  - Logo OSIS: `static/logo-osis.jpg`

---

## 2. Arsitektur & Teknologi

| Lapisan | Teknologi | Keterangan |
| :--- | :--- | :--- |
| Framework | SvelteKit 3 + Svelte 5 (Runes) | Ramping, tanpa virtual DOM, hemat kuota data seluler siswa |
| Bahasa | TypeScript | Strict type safety |
| Desain & Warna | Tailwind CSS v4 | Tema Biru Institusional (`#1D4ED8`, `#0F2856`) & Putih Bersih (`#FFFFFF`, `#F8FAFC`) |
| Ikon Antarmuka | Lucide Icons (`@lucide/svelte`) | Ikon garis outline standar institusi, zero-emoji |
| Deployment Adapter | `@sveltejs/adapter-vercel` | Siap deploy serverless otomatis di Vercel (Rp0) |
| Database | PostgreSQL (Supabase) + In-Memory Fallback | Skema relasional, RLS, storage bukti privat (Rp0) |
| Kriptografi | Node.js Crypto (SHA-256 + Pepper) | Hashing token kode rahasia satu arah |

---

## 3. Fitur Utama

### Sisi Siswa (1 Halaman Terpadu di `/`)
Seluruh interaksi siswa disatukan ke dalam 1 halaman utama yang terpadu dan responsif melalui 4 tab instan:
1. **Kirim Aspirasi Anonim & Anti-Bullying Center**:
   - 100% tanpa registrasi, tanpa email, nama, NISN, atau kontak.
   - **Jalur Khusus Bullying / Perundungan**: Tombol aksi langsung dari Hero dan kartu fitur dengan auto-scroll ke formulir, otomatis mengunci visibilitas ke **Privat**, serta menyediakan chip pintasan topik (Intimidasi/Ejekan Verbal, Kekerasan Fisik, Pengucilan/Diskriminasi, Cyberbullying Medsos, Pemalakan/Pemerasan).
   - Pilihan kategori lengkap: Bullying/Perundungan, Fasilitas, Saran, Program OSIS, Kritik, Kekerasan, Masalah Pribadi, Lainnya.
   - **Safe by Default**: Kategori bullying, kekerasan, dan masalah pribadi otomatis terkunci permanen ke visibilitas **Privat**.
   - **Proteksi Anti-Spam & Honeypot**: Field bot-trap tersembunyi dan pembatasan frekuensi IP (maksimal 5 pengiriman per 10 menit) tanpa biaya CAPTCHA pihak ketiga.
   - **Pratinjau Bukti Foto**: Thumbnail gambar instan sebelum pengiriman dengan tombol pembatalan.
   - Modal kode rahasia unik (`KAS-XXXX-XXXX`) dengan tombol salin.
2. **Lacak via Kode Rahasia**:
   - Auto-direct langsung ke tab pelacakan saat membuka URL berkode (`/?kode=...`).
   - Pencarian laporan menggunakan kode rahasia terenkripsi hash SHA-256.
   - Tersedia tombol cepat pengujian demo (`KAS-DEMO-0001`, `KAS-DEMO-0002`, `KAS-DEMO-0004`).
   - Timeline status penanganan (*Baru*, *Ditinjau*, *Diproses*, *Menunggu Siswa*, *Selesai*).
   - Percakapan dua arah antara siswa dan pengurus OSIS Sekbid 3 IT secara anonim.
3. **Aspirasi Publik Terverifikasi**:
   - Menampilkan aspirasi kategori umum yang telah disetujui kurasi admin OSIS.
   - Filter kategori dan pencarian kata kunci cepat.
   - Menampilkan catatan tindak lanjut resmi dari pihak sekolah.
4. **Panduan Privasi & Jalur Bantuan**:
   - Edukasi arsitektur privasi dan batasan layanan.
   - Jalur darurat sekolah: Kontak Guru BK (WA: 0812-3456-7890), Pembina OSIS (WA: 0821-9876-5432), SAPA 129 KemenPPPA, dan Hotline KPAI.
   - Keterangan lisensi resmi Sekbid 3 IT.

### Sisi Pengurus OSIS (Jalur Khusus `/admin-aspirasi`)
Demi keamanan, tautan admin tidak ditampilkan di menu publik siswa. Pengurus OSIS mengakses melalui URL khusus:
- **Login Admin**: `/admin-aspirasi/login` (Autentikasi sesi server-side dengan cookie `HttpOnly`).
- **Dashboard Ringkasan**: `/admin-aspirasi` (Metrik aktual total laporan, status, rasio privasi, dan antrean prioritas).
- **Manajemen & Filter Laporan**: `/admin-aspirasi/reports` (Pencarian teks, filter kategori, status, visibilitas, filter periode waktu 7d/30d, dan tombol **Ekspor CSV**).
- **Ekspor Rekap CSV**: `/admin-aspirasi/api/export-csv` (Download spreadsheet RFC 4180 dengan sanitasi formula injection).
- **Detail & Balasan Resmi**: `/admin-aspirasi/reports/[id]` (Pemeriksaan bukti via modal viewer gambar, update status, dan kirim balasan).
- **Antrean Moderasi Publik**: `/admin-aspirasi/moderation` (Persetujuan satu klik untuk publikasi feed sekolah).
- **Statistik & Analisis**: `/admin-aspirasi/analytics` (Tingkat penyelesaian dan persebaran masalah siswa).
- **Log Audit**: `/admin-aspirasi/audit` (Pencatatan aktivitas status tanpa mengekspos pesan sensitif).
- **Pengaturan Sistem**: `/admin-aspirasi/settings` (Profil sekolah dan monitoring kuota gratis cloud).

---

## 4. Kredensial Pengujian Bawaan

- **Jalur Masuk Admin OSIS**:
  - URL: `/admin-aspirasi/login`
  - Username: `admin_osis`
  - Password: `osis_amanah_2026`
- **Kode Rahasia Demo Siswa (Tab Lacak via Kode)**:
  - `KAS-DEMO-0001`: Aspirasi Fasilitas Lab Praktikum (Ada balasan resmi OSIS)
  - `KAS-DEMO-0002`: Usulan Waktu Istirahat (Status Ditinjau)
  - `KAS-DEMO-0004`: Laporan Bullying / Intimidasi (Terkunci Privat Terproteksi)

---

## 5. Cara Menjalankan Secara Lokal

1. Masuk ke direktori proyek:
   ```bash
   cd C:\DavidYehudaSurbakti\web\kotak-aspirasi
   ```
2. Jalankan server pengembangan Vite:
   ```bash
   npm run dev
   ```
3. Buka browser: `http://localhost:5173`

---

## 6. Panduan Deployment Siap Pakai (Vercel & Supabase Rp0)

Proyek ini telah dikonfigurasi menggunakan `@sveltejs/adapter-vercel` dan siap dideploy langsung tanpa penyesuaian kode tambahan.

### Langkah A — Menghubungkan Repository ke GitHub

1. Buat repository baru di akun GitHub (misal: `kotak-aspirasi-smk`).
2. Hubungkan repository lokal dan push kode:
   ```bash
   git branch -M main
   git remote add origin https://github.com/USERNAME/kotak-aspirasi-smk.git
   git push -u origin main
   ```

### Langkah B — Setup Database Supabase Gratis (Opsional namun Disarankan)

1. Buat akun dan proyek baru di [Supabase](https://supabase.com) (Pilih Region Singapura untuk latensi tercepat dari Indonesia).
2. Masuk ke menu **SQL Editor** di dashboard Supabase.
3. Jalankan isi file [`supabase/schema.sql`](supabase/schema.sql) untuk membuat tabel, enum, dan indeks.
4. Jalankan isi file [`supabase/rls.sql`](supabase/rls.sql) untuk mengaktifkan aturan keamanan Row Level Security.
5. Buat Storage Bucket bernama `report-attachments` dengan akses privat untuk bukti lampiran.
6. Salin kredensial dari menu **Project Settings -> API**:
   - `Project URL`
   - `anon public key`
   - `service_role secret key`

### Langkah C — Deployment 1-Klik di Vercel

1. Buka [Vercel](https://vercel.com) dan pilih **Add New Project**.
2. Hubungkan akun GitHub dan pilih repository `kotak-aspirasi-smk`.
3. Vercel akan otomatis mendeteksi framework **SvelteKit**.
4. Di bagian **Environment Variables**, tambahkan variabel berikut:
   - `ADMIN_USERNAME`: Username admin OSIS pilihan (misal: `admin_osis_smk`)
   - `ADMIN_PASSWORD`: Password kuat admin OSIS
   - `TOKEN_PEPPER`: String acak unik untuk salt hash kode (misal: `smk-bagimunegeriku-secret-salt-2026`)
   - `PUBLIC_SUPABASE_URL`: URL proyek Supabase Anda
   - `PUBLIC_SUPABASE_ANON_KEY`: Kunci anon Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Kunci service role Supabase
5. Klik **Deploy**. Dalam waktu sekitar 1-2 menit, website resmi Kotak Aspirasi akan aktif dengan domain `.vercel.app` (atau domain sekolah kustom).

*Catatan: Jika Supabase belum dikonfigurasi saat pertama kali deploy, website tetap berjalan normal menggunakan database fallback in-memory.*
