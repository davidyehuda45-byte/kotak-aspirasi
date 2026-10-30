<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';
  import Badge from '#lib/components/Badge.svelte';
  import { CheckSquare, Check, X, Shield, Eye, ArrowRight, AlertCircle } from 'lucide-svelte';

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="text-xl sm:text-2xl font-bold text-tx-primary">Antrean Moderasi Aspirasi Publik</h1>
      <p class="text-xs text-tx-secondary mt-0.5">
        SMK Bagimu Negeriku · Tinjau aspirasi umum sebelum dipublikasikan ke papan publik sekolah.
      </p>
    </div>
    <span class="text-xs font-bold text-brand-blue bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
      {data.pendingReports.length} Menunggu Kurasi
    </span>
  </div>

  {#if form?.error}
    <div class="p-3.5 rounded-xl bg-danger-subtle border border-red-200 text-danger text-xs flex items-center gap-2">
      <AlertCircle class="w-4 h-4 shrink-0" />
      <span>{form.error}</span>
    </div>
  {/if}

  <!-- Daftar Menunggu Moderasi -->
  <div class="space-y-4">
    {#if data.pendingReports.length === 0}
      <div class="p-12 text-center rounded-2xl bg-surface border border-border-subtle space-y-2">
        <CheckSquare class="w-8 h-8 mx-auto text-emerald-600" />
        <h3 class="text-sm font-bold text-tx-primary">Semua Aspirasi Telah Dimoderasi</h3>
        <p class="text-xs text-tx-secondary">Tidak ada aspirasi publik yang tertunda saat ini.</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 gap-4">
        {#each data.pendingReports as report}
          <div class="p-5 sm:p-6 rounded-2xl bg-surface border border-border-subtle shadow-xs space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs font-bold text-brand-blue">{report.public_reference}</span>
                <Badge status={report.category} type="category" />
                <Badge status={report.handling_status} type="handling" />
              </div>
              <span class="text-xs text-tx-secondary">
                Diajukan {new Date(report.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
              </span>
            </div>

            <div class="space-y-2">
              <h3 class="text-base font-bold text-tx-primary">{report.title}</h3>
              <p class="text-xs sm:text-sm text-tx-secondary leading-relaxed bg-slate-50 p-4 rounded-xl border border-border-subtle">
                {report.content}
              </p>
            </div>

            <div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <a
                href="/admin-aspirasi/reports/{report.id}"
                class="inline-flex items-center gap-1 text-xs font-bold text-tx-secondary hover:text-brand-blue"
              >
                <span>Buka Detail & Diskusi Lengkap</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </a>

              <div class="flex items-center gap-2">
                <!-- Tombol Tolak Publikasi -->
                <form method="POST" action="?/moderate" use:enhance>
                  <input type="hidden" name="reportId" value={report.id} />
                  <input type="hidden" name="status" value="rejected" />
                  <button
                    type="submit"
                    class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold border border-red-200 transition-colors"
                  >
                    <X class="w-3.5 h-3.5" />
                    <span>Tolak Publik</span>
                  </button>
                </form>

                <!-- Tombol Setujui Publikasi -->
                <form method="POST" action="?/moderate" use:enhance>
                  <input type="hidden" name="reportId" value={report.id} />
                  <input type="hidden" name="status" value="approved" />
                  <button
                    type="submit"
                    class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-blue text-white hover:bg-brand-blue-dark text-xs font-bold transition-colors shadow-xs"
                  >
                    <Check class="w-3.5 h-3.5" />
                    <span>Setujui & Publikasikan</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
