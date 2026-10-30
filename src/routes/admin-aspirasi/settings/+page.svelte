<script lang="ts">
  import { Settings, Shield, HardDrive, Lock, Code2 } from 'lucide-svelte';
</script>

<div class="space-y-8 max-w-4xl">
  <!-- Header -->
  <div>
    <h1 class="text-xl sm:text-2xl font-bold text-tx-primary">Pengaturan & Informasi Sistem</h1>
    <p class="text-xs text-tx-secondary mt-0.5">
      SMK Bagimu Negeriku · Konfigurasi operasional kotak aspirasi dan monitoring kuota layanan gratis.
    </p>
  </div>

  <!-- Profil Sekolah & Sekbid 3 IT -->
  <div class="p-6 rounded-2xl bg-surface border border-border-subtle shadow-xs space-y-4">
    <div class="flex items-center gap-2 border-b border-border-subtle pb-3">
      <Settings class="w-4 h-4 text-brand-blue" />
      <h2 class="text-sm font-bold text-tx-primary">Profil Sekolah & Tim Pengembang</h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
      <div class="space-y-1">
        <label for="school-name" class="font-bold text-tx-secondary">Nama Sekolah</label>
        <input
          id="school-name"
          type="text"
          value="SMK Bagimu Negeriku"
          readonly
          class="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-border-subtle text-tx-primary font-semibold"
        />
      </div>

      <div class="space-y-1">
        <label for="osis-period" class="font-bold text-tx-secondary">Divisi Pengelola</label>
        <input
          id="osis-period"
          type="text"
          value="Seksi Bidang 3 (Teknologi & Informasi) OSIS"
          readonly
          class="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-border-subtle text-tx-primary font-semibold"
        />
      </div>

      <div class="space-y-1">
        <label for="bk-contact" class="font-bold text-tx-secondary">Kontak Penanganan Kasus Sensitif (BK)</label>
        <input
          id="bk-contact"
          type="text"
          value="Ruang Bimbingan Konseling SMK Bagimu Negeriku"
          readonly
          class="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-border-subtle text-tx-primary font-semibold"
        />
      </div>

      <div class="space-y-1">
        <label for="admin-account" class="font-bold text-tx-secondary">Akun Administrator Aktif</label>
        <input
          id="admin-account"
          type="text"
          value="admin_osis (Sekbid 3 IT)"
          readonly
          class="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-border-subtle text-tx-primary font-mono font-bold"
        />
      </div>
    </div>
  </div>

  <!-- Lisensi Resmi Sekbid 3 IT -->
  <div class="p-6 rounded-2xl bg-blue-50/60 border border-blue-200/80 shadow-xs space-y-3">
    <div class="flex items-center gap-2">
      <Code2 class="w-5 h-5 text-brand-blue" />
      <h3 class="text-sm font-bold text-brand-blue-dark">Lisensi & Dedikasi Sekbid 3 IT</h3>
    </div>
    <p class="text-xs text-slate-700 leading-relaxed">
      Sistem ini dibangun secara khusus oleh <strong>Seksi Bidang 3 IT OSIS SMK Bagimu Negeriku</strong> di bawah lisensi MIT untuk transparansi dan perlindungan privasi seluruh siswa. Tidak ada pintu belakang (*backdoor*), pelacak identitas, maupun pengumpulan data pribadi.
    </p>
  </div>

  <!-- Panduan Kuota & Biaya Rp0 -->
  <div class="p-6 rounded-2xl bg-surface border border-border-subtle shadow-xs space-y-4">
    <div class="flex items-center gap-2 border-b border-border-subtle pb-3">
      <HardDrive class="w-4 h-4 text-brand-blue" />
      <h2 class="text-sm font-bold text-tx-primary">Ketentuan Hosting & Database Gratis (Rp0)</h2>
    </div>

    <div class="space-y-3 text-xs leading-relaxed text-tx-secondary">
      <p>
        Platform dirancang agar berjalan optimal pada tier gratis penyedia cloud:
      </p>
      <ul class="list-disc pl-5 space-y-1.5">
        <li>
          <strong>Vercel / Cloudflare Pages (Frontend & Serverless):</strong> Gratis hingga 100.000 requests per hari dengan deployment otomatis via Git.
        </li>
        <li>
          <strong>Supabase Free Tier (PostgreSQL & Storage):</strong> Gratis kapasitas database hingga 500MB dan 1GB media lampiran privat.
        </li>
        <li>
          <strong>Batas Ukuran File:</strong> Lampiran dibatasi maksimal 15MB per file dengan format aman (JPG, PNG, WebP, MP4, WebM) guna mencegah habisnya kuota storage.
        </li>
      </ul>
    </div>
  </div>
</div>
