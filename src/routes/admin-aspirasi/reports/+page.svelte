<script lang="ts">
  import type { PageData } from './$types';
  import Badge from '#lib/components/Badge.svelte';
  import { Search, Filter, Lock, Eye, ArrowRight, MessageSquare, Download } from 'lucide-svelte';

  let { data }: { data: PageData } = $props();

  let selectedStatus = $state('all');
  let selectedCategory = $state('all');
  let selectedVisibility = $state('all');
  let selectedPeriod = $state('all');
  let searchInput = $state('');

  $effect(() => {
    selectedStatus = data.filters.handling_status;
    selectedCategory = data.filters.category;
    selectedVisibility = data.filters.visibility;
    selectedPeriod = data.filters.period || 'all';
    searchInput = data.filters.search;
  });

  function applyFilters() {
    const params = new URLSearchParams();
    if (selectedStatus !== 'all') params.set('status', selectedStatus);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedVisibility !== 'all') params.set('visibility', selectedVisibility);
    if (selectedPeriod !== 'all') params.set('period', selectedPeriod);
    if (searchInput.trim()) params.set('search', searchInput.trim());

    window.location.href = `/admin-aspirasi/reports${params.toString() ? '?' + params.toString() : ''}`;
  }

  let exportCsvUrl = $derived(() => {
    const params = new URLSearchParams();
    if (selectedStatus !== 'all') params.set('status', selectedStatus);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedVisibility !== 'all') params.set('visibility', selectedVisibility);
    if (selectedPeriod !== 'all') params.set('period', selectedPeriod);
    return `/admin-aspirasi/api/export-csv${params.toString() ? '?' + params.toString() : ''}`;
  });
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-xl sm:text-2xl font-bold text-tx-primary">Daftar Seluruh Laporan Aspirasi</h1>
      <p class="text-xs text-tx-secondary mt-0.5">
        SMK Bagimu Negeriku · Kelola antrean aspirasi, perbarui status penanganan, dan respon siswa.
      </p>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-xs font-bold text-brand-blue bg-blue-50 px-3 py-2 rounded-xl border border-blue-200">
        Total {data.reports.length} Laporan
      </span>
      <a
        href={exportCsvUrl()}
        download
        class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-blue-hover transition-colors shadow-2xs cursor-pointer"
      >
        <Download class="w-3.5 h-3.5" />
        <span>Ekspor CSV</span>
      </a>
    </div>
  </div>

  <!-- Filter Controls -->
  <div class="p-4 rounded-2xl bg-surface border border-border-subtle shadow-xs space-y-3">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <!-- Search Input -->
      <div class="relative">
        <input
          type="text"
          placeholder="Cari judul atau isi..."
          bind:value={searchInput}
          onkeydown={(e) => e.key === 'Enter' && applyFilters()}
          class="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-border-subtle bg-slate-50 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-brand-blue"
        />
        <Search class="w-3.5 h-3.5 text-tx-secondary absolute left-2.5 top-2.5" />
      </div>

      <!-- Filter Status -->
      <div>
        <select
          bind:value={selectedStatus}
          onchange={applyFilters}
          class="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle bg-slate-50 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-brand-blue text-tx-primary font-medium"
        >
          <option value="all">Semua Status</option>
          <option value="new">Baru</option>
          <option value="reviewing">Ditinjau</option>
          <option value="in_progress">Diproses</option>
          <option value="awaiting_response">Menunggu Siswa</option>
          <option value="resolved">Selesai</option>
        </select>
      </div>

      <!-- Filter Kategori -->
      <div>
        <select
          bind:value={selectedCategory}
          onchange={applyFilters}
          class="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle bg-slate-50 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-brand-blue text-tx-primary font-medium"
        >
          <option value="all">Semua Kategori</option>
          <option value="fasilitas">Fasilitas</option>
          <option value="saran">Saran</option>
          <option value="osis">Program OSIS</option>
          <option value="kritik">Kritik</option>
          <option value="bullying">Bullying (Privat)</option>
          <option value="kekerasan">Kekerasan (Privat)</option>
          <option value="masalah_pribadi">Masalah Pribadi</option>
          <option value="lainnya">Lainnya</option>
        </select>
      </div>

      <!-- Filter Visibilitas -->
      <div>
        <select
          bind:value={selectedVisibility}
          onchange={applyFilters}
          class="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle bg-slate-50 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-brand-blue text-tx-primary font-medium"
        >
          <option value="all">Semua Visibilitas</option>
          <option value="private">Khusus Privat</option>
          <option value="public">Khusus Publik</option>
        </select>
      </div>

      <!-- Filter Periode Waktu -->
      <div>
        <select
          bind:value={selectedPeriod}
          onchange={applyFilters}
          class="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle bg-slate-50 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-brand-blue text-tx-primary font-medium"
        >
          <option value="all">Semua Waktu</option>
          <option value="7d">7 Hari Terakhir</option>
          <option value="30d">30 Hari Terakhir</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Reports Table (Desktop) / Cards (Mobile) -->
  {#if data.reports.length === 0}
    <div class="p-12 text-center rounded-2xl bg-surface border border-border-subtle space-y-2">
      <Filter class="w-8 h-8 mx-auto text-tx-secondary" />
      <h3 class="text-sm font-bold text-tx-primary">Tidak Ada Laporan yang Cocok</h3>
      <p class="text-xs text-tx-secondary">Coba sesuaikan filter pencarian di atas.</p>
    </div>
  {:else}
    <!-- Desktop Table View -->
    <div class="hidden md:block rounded-2xl bg-surface border border-border-subtle overflow-hidden shadow-xs">
      <table class="w-full text-left border-collapse text-xs">
        <thead>
          <tr class="bg-slate-50 border-b border-border-subtle text-tx-secondary font-bold uppercase tracking-wider text-[11px]">
            <th class="py-3.5 px-4">Ref</th>
            <th class="py-3.5 px-4">Judul Aspirasi</th>
            <th class="py-3.5 px-4">Kategori</th>
            <th class="py-3.5 px-4">Visibilitas</th>
            <th class="py-3.5 px-4">Status</th>
            <th class="py-3.5 px-4">Pesan</th>
            <th class="py-3.5 px-4">Tanggal</th>
            <th class="py-3.5 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border-subtle/70">
          {#each data.reports as report}
            <tr class="hover:bg-blue-50/40 transition-colors">
              <td class="py-3.5 px-4 font-mono font-bold text-brand-blue">{report.public_reference}</td>
              <td class="py-3.5 px-4 max-w-xs">
                <span class="font-bold text-tx-primary block truncate">{report.title}</span>
                <span class="text-tx-secondary block truncate text-[11px]">{report.content}</span>
              </td>
              <td class="py-3.5 px-4">
                <Badge status={report.category} type="category" />
              </td>
              <td class="py-3.5 px-4">
                {#if report.visibility === 'private'}
                  <span class="inline-flex items-center gap-1 font-semibold text-red-700">
                    <Lock class="w-3 h-3" />
                    <span>Privat</span>
                  </span>
                {:else}
                  <span class="inline-flex items-center gap-1 text-tx-secondary">
                    <Eye class="w-3 h-3" />
                    <span>Publik</span>
                  </span>
                {/if}
              </td>
              <td class="py-3.5 px-4">
                <Badge status={report.handling_status} type="handling" />
              </td>
              <td class="py-3.5 px-4 text-tx-secondary">
                <span class="inline-flex items-center gap-1">
                  <MessageSquare class="w-3.5 h-3.5" />
                  <span>{report.messages ? report.messages.length : 0}</span>
                </span>
              </td>
              <td class="py-3.5 px-4 text-tx-secondary whitespace-nowrap">
                {new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </td>
              <td class="py-3.5 px-4 text-right">
                <a
                  href="/admin-aspirasi/reports/{report.id}"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-blue text-white font-bold text-[11px] hover:bg-brand-blue-dark transition-colors"
                >
                  <span>Detail</span>
                  <ArrowRight class="w-3 h-3" />
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="md:hidden space-y-3">
      {#each data.reports as report}
        <div class="p-4 rounded-xl bg-surface border border-border-subtle shadow-xs space-y-3">
          <div class="flex items-center justify-between gap-2">
            <span class="font-mono text-xs font-bold text-brand-blue">{report.public_reference}</span>
            <div class="flex items-center gap-1.5">
              <Badge status={report.category} type="category" />
              <Badge status={report.handling_status} type="handling" />
            </div>
          </div>

          <div>
            <h3 class="text-sm font-bold text-tx-primary">{report.title}</h3>
            <p class="text-xs text-tx-secondary line-clamp-2 mt-1">{report.content}</p>
          </div>

          <div class="pt-2 border-t border-border-subtle flex items-center justify-between text-xs text-tx-secondary">
            <span>{new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
            <a
              href="/admin-aspirasi/reports/{report.id}"
              class="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-brand-blue text-white font-bold text-xs"
            >
              <span>Periksa</span>
              <ArrowRight class="w-3 h-3" />
            </a>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
