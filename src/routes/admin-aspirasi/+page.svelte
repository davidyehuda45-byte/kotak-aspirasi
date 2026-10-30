<script lang="ts">
  import type { PageData } from './$types';
  import Badge from '#lib/components/Badge.svelte';
  import {
    Inbox,
    AlertCircle,
    CheckCircle2,
    Clock,
    Lock,
    Eye,
    ArrowRight,
    MessageSquare,
    Shield
  } from 'lucide-svelte';

  let { data }: { data: PageData } = $props();
</script>

<div class="space-y-8">
  <!-- Topbar Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-xl sm:text-2xl font-bold text-tx-primary">Ringkasan Operasional OSIS IT</h1>
      <p class="text-xs text-tx-secondary mt-0.5">
        SMK Bagimu Negeriku · Pantau aspirasi masuk, respon berkala, dan penanganan siswa.
      </p>
    </div>
    <div class="flex items-center gap-2">
      <a
        href="/admin-aspirasi/reports"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-blue-dark transition-colors shadow-xs"
      >
        <Inbox class="w-4 h-4" />
        <span>Buka Seluruh Laporan</span>
      </a>
      <a
        href="/admin-aspirasi/moderation"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-border-subtle text-tx-primary text-xs font-bold hover:bg-slate-50 transition-colors"
      >
        <span>Antrean Moderasi ({data.stats.pendingModeration})</span>
      </a>
    </div>
  </div>

  <!-- Metric Cards Grid -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Card 1: Total Masuk -->
    <div class="p-5 rounded-2xl bg-surface border border-border-subtle shadow-xs space-y-2">
      <div class="flex items-center justify-between text-tx-secondary">
        <span class="text-xs font-bold">Total Laporan</span>
        <Inbox class="w-4 h-4 text-brand-blue" />
      </div>
      <div class="text-2xl sm:text-3xl font-extrabold text-tx-primary font-mono">
        {data.stats.totalReports}
      </div>
      <p class="text-[11px] text-tx-secondary">Seluruh aspirasi yang masuk ke sistem</p>
    </div>

    <!-- Card 2: Belum Ditinjau -->
    <div class="p-5 rounded-2xl bg-surface border border-border-subtle shadow-xs space-y-2">
      <div class="flex items-center justify-between text-tx-secondary">
        <span class="text-xs font-bold">Belum Ditinjau</span>
        <AlertCircle class="w-4 h-4 text-sky-600" />
      </div>
      <div class="text-2xl sm:text-3xl font-extrabold text-sky-700 font-mono">
        {data.stats.newReports}
      </div>
      <p class="text-[11px] text-tx-secondary">Menunggu pemeriksaan awal tim IT</p>
    </div>

    <!-- Card 3: Sedang Diproses -->
    <div class="p-5 rounded-2xl bg-surface border border-border-subtle shadow-xs space-y-2">
      <div class="flex items-center justify-between text-tx-secondary">
        <span class="text-xs font-bold">Sedang Diproses</span>
        <Clock class="w-4 h-4 text-blue-600" />
      </div>
      <div class="text-2xl sm:text-3xl font-extrabold text-brand-blue font-mono">
        {data.stats.inProgressReports}
      </div>
      <p class="text-[11px] text-tx-secondary">Dalam penanganan sekolah/OSIS</p>
    </div>

    <!-- Card 4: Selesai -->
    <div class="p-5 rounded-2xl bg-surface border border-border-subtle shadow-xs space-y-2">
      <div class="flex items-center justify-between text-tx-secondary">
        <span class="text-xs font-bold">Terselesaikan</span>
        <CheckCircle2 class="w-4 h-4 text-emerald-600" />
      </div>
      <div class="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">
        {data.stats.resolvedReports}
      </div>
      <p class="text-[11px] text-tx-secondary">Telah tuntas ditindaklanjuti</p>
    </div>
  </div>

  <!-- Statistik Distribusi Privasi -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="p-5 rounded-2xl bg-surface border border-border-subtle space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-tx-primary uppercase tracking-wider">Distribusi Privasi</span>
        <Shield class="w-4 h-4 text-brand-blue" />
      </div>
      <div class="grid grid-cols-2 gap-3 pt-1">
        <div class="p-3.5 rounded-xl bg-slate-50 border border-border-subtle">
          <div class="flex items-center gap-1.5 text-xs text-tx-secondary font-semibold">
            <Lock class="w-3.5 h-3.5 text-danger" />
            <span>Laporan Privat</span>
          </div>
          <div class="text-xl font-bold text-tx-primary font-mono mt-1">
            {data.stats.privateReports}
          </div>
          <p class="text-[10px] text-tx-secondary mt-0.5">Bullying, kekerasan, atau pilihan siswa</p>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-50 border border-border-subtle">
          <div class="flex items-center gap-1.5 text-xs text-tx-secondary font-semibold">
            <Eye class="w-3.5 h-3.5 text-brand-blue" />
            <span>Aspirasi Publik</span>
          </div>
          <div class="text-xl font-bold text-tx-primary font-mono mt-1">
            {data.stats.publicApprovedReports}
          </div>
          <p class="text-[10px] text-tx-secondary mt-0.5">Disetujui tampil di publik</p>
        </div>
      </div>
    </div>

    <!-- Antrean Moderasi Info -->
    <div class="p-5 rounded-2xl bg-surface border border-border-subtle flex flex-col justify-between space-y-3">
      <div>
        <span class="text-xs font-bold text-tx-primary uppercase tracking-wider">Antrean Moderasi Publik</span>
        <p class="text-xs text-tx-secondary mt-1 leading-relaxed">
          Ada <strong>{data.stats.pendingModeration}</strong> aspirasi umum yang menunggu verifikasi admin sebelum dapat dilihat siswa di halaman publik SMK Bagimu Negeriku.
        </p>
      </div>
      <div class="pt-2">
        <a
          href="/admin-aspirasi/moderation"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-dark"
        >
          <span>Tinjau antrean publik sekarang</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </div>

  <!-- Priority Queue: Laporan Terbaru -->
  <div class="p-6 rounded-2xl bg-surface border border-border-subtle shadow-xs space-y-4">
    <div class="flex items-center justify-between border-b border-border-subtle pb-4">
      <div>
        <h2 class="text-base font-bold text-tx-primary">Laporan & Aspirasi Terbaru</h2>
        <p class="text-xs text-tx-secondary">Periksa dan berikan tanggapan untuk menjaga kepercayaan siswa.</p>
      </div>
      <a
        href="/admin-aspirasi/reports"
        class="text-xs font-bold text-brand-blue hover:underline"
      >
        Lihat Semua
      </a>
    </div>

    <div class="divide-y divide-border-subtle/80">
      {#each data.priorityReports as report}
        <div class="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 -mx-2 px-2 rounded-xl transition-colors">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-bold text-tx-secondary">{report.public_reference}</span>
              <Badge status={report.category} type="category" />
              <Badge status={report.handling_status} type="handling" />
              {#if report.visibility === 'private'}
                <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  <Lock class="w-3 h-3" />
                  <span>Privat</span>
                </span>
              {/if}
            </div>
            <h3 class="text-sm font-semibold text-tx-primary line-clamp-1">
              {report.title}
            </h3>
            <p class="text-xs text-tx-secondary line-clamp-1">
              {report.content}
            </p>
          </div>

          <div class="flex items-center gap-3 shrink-0">
            <span class="text-[11px] text-tx-secondary whitespace-nowrap">
              {new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
            </span>
            <a
              href="/admin-aspirasi/reports/{report.id}"
              class="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-brand-blue text-xs font-bold text-tx-primary transition-colors"
            >
              <span>Periksa</span>
              <ArrowRight class="w-3 h-3" />
            </a>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
