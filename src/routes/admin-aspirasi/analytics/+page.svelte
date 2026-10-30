<script lang="ts">
  import type { PageData } from './$types';
  import { BarChart3, PieChart, Shield, CheckCircle2, Inbox } from 'lucide-svelte';

  let { data }: { data: PageData } = $props();

  const categoryNames = [
    { key: 'fasilitas', label: 'Fasilitas Kelas & Sekolah' },
    { key: 'saran', label: 'Saran & Masukan' },
    { key: 'osis', label: 'Program Kerja OSIS' },
    { key: 'kritik', label: 'Kritik & Evaluasi' },
    { key: 'bullying', label: 'Bullying / Perundungan' },
    { key: 'kekerasan', label: 'Kekerasan / Ancaman' },
    { key: 'masalah_pribadi', label: 'Konseling & Masalah Pribadi' },
    { key: 'lainnya', label: 'Lain-lain' }
  ];
</script>

<div class="space-y-8">
  <!-- Header -->
  <div>
    <h1 class="text-xl sm:text-2xl font-bold text-tx-primary">Statistik & Analisis Aspirasi</h1>
    <p class="text-xs text-tx-secondary mt-0.5">
      SMK Bagimu Negeriku · Ringkasan performa respon dan persebaran kategori masalah siswa.
    </p>
  </div>

  <!-- Key Metrics Row -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div class="p-5 rounded-2xl bg-surface border border-border-subtle shadow-xs space-y-1">
      <span class="text-xs font-bold text-tx-secondary">Tingkat Penyelesaian</span>
      <div class="text-3xl font-extrabold text-brand-blue font-mono">
        {data.resolutionRate}%
      </div>
      <p class="text-[11px] text-tx-secondary">{data.stats.resolvedReports} dari {data.totalReports} aspirasi telah diselesaikan</p>
    </div>

    <div class="p-5 rounded-2xl bg-surface border border-border-subtle shadow-xs space-y-1">
      <span class="text-xs font-bold text-tx-secondary">Aspirasi Privat</span>
      <div class="text-3xl font-extrabold text-red-700 font-mono">
        {data.stats.privateReports}
      </div>
      <p class="text-[11px] text-tx-secondary">Laporan terproteksi yang tidak dipublikasikan</p>
    </div>

    <div class="p-5 rounded-2xl bg-surface border border-border-subtle shadow-xs space-y-1">
      <span class="text-xs font-bold text-tx-secondary">Aspirasi Publik Disetujui</span>
      <div class="text-3xl font-extrabold text-emerald-700 font-mono">
        {data.stats.publicApprovedReports}
      </div>
      <p class="text-[11px] text-tx-secondary">Ditampilkan di feed aspirasi sekolah</p>
    </div>
  </div>

  <!-- Persebaran Kategori -->
  <div class="p-6 rounded-2xl bg-surface border border-border-subtle shadow-xs space-y-5">
    <div class="flex items-center justify-between border-b border-border-subtle pb-4">
      <h2 class="text-base font-bold text-tx-primary">Persebaran Kategori Aspirasi</h2>
      <span class="text-xs text-tx-secondary font-medium">Total {data.totalReports} Laporan</span>
    </div>

    <div class="space-y-4">
      {#each categoryNames as cat}
        {@const count = data.categoryCount[cat.key as keyof typeof data.categoryCount] || 0}
        {@const pct = data.totalReports > 0 ? Math.round((count / data.totalReports) * 100) : 0}
        <div class="space-y-1 text-xs">
          <div class="flex justify-between items-center">
            <span class="font-bold text-tx-primary">{cat.label}</span>
            <span class="text-tx-secondary font-mono">{count} ({pct}%)</span>
          </div>
          <div class="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-300 {['bullying', 'kekerasan', 'masalah_pribadi'].includes(cat.key) ? 'bg-red-600' : 'bg-brand-blue'}"
              style="width: {pct}%"
            ></div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
