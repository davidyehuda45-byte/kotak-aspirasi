<script lang="ts">
  import type { PageData } from './$types';
  import { History, Shield, Lock } from 'lucide-svelte';

  let { data }: { data: PageData } = $props();
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="space-y-1">
    <h1 class="text-xl sm:text-2xl font-bold text-tx-primary">Log Audit Aktivitas Sistem</h1>
    <p class="text-xs text-tx-secondary">
      SMK Bagimu Negeriku · Catatan audit seluruh tindakan penting pengurus dan perubahan status laporan. Tidak memuat isi pesan sensitif siswa demi kepatuhan privasi.
    </p>
  </div>

  <div class="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-brand-blue-dark flex items-center gap-2">
    <Lock class="w-4 h-4 shrink-0 text-brand-blue" />
    <span>Privasi Terjaga: Log audit hanya mencatat tipe peristiwa dan ID referensi tanpa menyalin konten laporan.</span>
  </div>

  <!-- Audit Table -->
  <div class="rounded-2xl bg-surface border border-border-subtle overflow-hidden shadow-xs">
    <table class="w-full text-left border-collapse text-xs">
      <thead>
        <tr class="bg-slate-50 border-b border-border-subtle text-tx-secondary font-bold uppercase tracking-wider text-[11px]">
          <th class="py-3.5 px-4">Waktu</th>
          <th class="py-3.5 px-4">Aktor</th>
          <th class="py-3.5 px-4">Tindakan</th>
          <th class="py-3.5 px-4">Target ID</th>
          <th class="py-3.5 px-4">Keterangan</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border-subtle/70">
        {#each data.logs as log}
          <tr class="hover:bg-blue-50/30 transition-colors">
            <td class="py-3.5 px-4 text-tx-secondary whitespace-nowrap">
              {new Date(log.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
            </td>
            <td class="py-3.5 px-4 font-bold text-tx-primary whitespace-nowrap">
              {log.actor_name}
            </td>
            <td class="py-3.5 px-4">
              <span class="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-tx-primary">
                {log.action}
              </span>
            </td>
            <td class="py-3.5 px-4 font-mono text-[11px] text-brand-blue font-bold">
              {log.target_id}
            </td>
            <td class="py-3.5 px-4 text-tx-secondary">
              {log.details || '-'}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
