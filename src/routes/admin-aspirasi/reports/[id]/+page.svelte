<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';
  import Badge from '#lib/components/Badge.svelte';
  import {
    ArrowLeft,
    Shield,
    Lock,
    Eye,
    MessageSquare,
    Send,
    CheckCircle,
    AlertCircle,
    User,
    Paperclip,
    X
  } from 'lucide-svelte';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let replyText = $state('');
  let isSendingReply = $state(false);
  let activePreviewImage = $state<string | null>(null);

  const sensitiveCategories = ['bullying', 'kekerasan', 'masalah_pribadi'];
  let isSensitive = $derived(sensitiveCategories.includes(data.report.category));
</script>

<div class="space-y-6">
  <!-- Top Navigation Bar -->
  <div class="flex items-center justify-between border-b border-border-subtle pb-4">
    <a
      href="/admin-aspirasi/reports"
      class="inline-flex items-center gap-1.5 text-xs font-bold text-tx-secondary hover:text-brand-blue transition-colors"
    >
      <ArrowLeft class="w-4 h-4" />
      <span>Kembali ke Daftar Laporan</span>
    </a>
    <span class="font-mono text-xs font-bold text-brand-blue bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
      {data.report.public_reference}
    </span>
  </div>

  {#if form?.pubError || form?.statusError || form?.replyError}
    <div class="p-4 rounded-xl bg-danger-subtle border border-red-200 text-danger text-xs flex items-start gap-2.5">
      <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
      <div>
        <span class="font-bold">Terjadi Kesalahan:</span>
        <p class="mt-0.5">{form?.pubError || form?.statusError || form?.replyError}</p>
      </div>
    </div>
  {/if}

  {#if form?.successStatus || form?.successPub || form?.successReply}
    <div class="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-brand-blue-dark text-xs flex items-center gap-2">
      <CheckCircle class="w-4 h-4 shrink-0 text-brand-blue" />
      <span>Perubahan berhasil disimpan dan dicatat dalam riwayat audit.</span>
    </div>
  {/if}

  <!-- Grid Konten & Manajemen -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Kolom Kiri & Tengah: Isi Laporan & Diskusi (2 Kolom) -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Detail Laporan -->
      <div class="p-6 rounded-2xl bg-surface border border-border-subtle shadow-xs space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <Badge status={data.report.category} type="category" />
            <Badge status={data.report.handling_status} type="handling" />
            {#if data.report.visibility === 'private'}
              <span class="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                <Lock class="w-3 h-3" />
                <span>Privat</span>
              </span>
            {/if}
          </div>
          <span class="text-xs text-tx-secondary">
            Diterima {new Date(data.report.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}
          </span>
        </div>

        <div class="space-y-3">
          <h2 class="text-lg font-bold text-tx-primary leading-snug">
            {data.report.title}
          </h2>
          <div class="p-4 rounded-xl bg-slate-50 border border-border-subtle text-xs sm:text-sm text-tx-primary leading-relaxed whitespace-pre-wrap">
            {data.report.content}
          </div>
        </div>

        {#if data.report.attachments && data.report.attachments.length > 0}
          <div class="pt-3 border-t border-border-subtle space-y-3">
            <span class="text-xs font-bold text-tx-primary uppercase tracking-wider">Lampiran Siswa</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {#each data.report.attachments as att}
                <div class="p-3 rounded-xl bg-slate-50 border border-border-subtle flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2 min-w-0">
                    <div class="w-8 h-8 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                      <Paperclip class="w-4 h-4" />
                    </div>
                    <div class="truncate">
                      <span class="block text-xs font-bold text-tx-primary truncate">{att.name}</span>
                      <span class="block text-[10px] text-tx-secondary font-mono">{Math.round(att.size_bytes / 1024)} KB · {att.mime_type}</span>
                    </div>
                  </div>
                  {#if att.mime_type.startsWith('image/')}
                    <button
                      type="button"
                      onclick={() => (activePreviewImage = att.storage_path)}
                      class="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-brand-blue text-[11px] font-bold hover:bg-blue-50 shrink-0 cursor-pointer"
                    >
                      Buka Foto
                    </button>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <!-- Percakapan Dua Arah -->
      <div class="p-6 rounded-2xl bg-surface border border-border-subtle shadow-xs space-y-6">
        <div class="flex items-center justify-between border-b border-border-subtle pb-3">
          <div class="flex items-center gap-2">
            <MessageSquare class="w-4 h-4 text-brand-blue" />
            <h3 class="text-sm font-bold text-tx-primary">Thread Komunikasi dengan Siswa</h3>
          </div>
          <span class="text-xs text-tx-secondary font-medium">
            {data.report.messages ? data.report.messages.length : 0} Pesan
          </span>
        </div>

        <div class="space-y-3">
          {#if !data.report.messages || data.report.messages.length === 0}
            <div class="p-4 rounded-xl bg-slate-50 border border-border-subtle text-xs text-tx-secondary text-center">
              Belum ada balasan dari pengurus OSIS. Berikan tanggapan di bawah untuk menginformasikan tindak lanjut.
            </div>
          {:else}
            {#each data.report.messages as msg}
              <div
                class="p-4 rounded-xl border space-y-1.5 {msg.sender_type === 'admin' ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50 border-border-subtle'}"
              >
                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-1.5 font-bold {msg.sender_type === 'admin' ? 'text-brand-blue' : 'text-tx-primary'}">
                    {#if msg.sender_type === 'admin'}
                      <Shield class="w-3.5 h-3.5" />
                      <span>{msg.sender_name || 'Pengurus OSIS IT'}</span>
                      <span class="px-1.5 py-0.2 rounded bg-brand-blue text-white text-[10px] font-normal">Resmi</span>
                    {:else}
                      <User class="w-3.5 h-3.5" />
                      <span>Pelapor (Siswa SMK Bagimu Negeriku)</span>
                    {/if}
                  </div>
                  <span class="text-[11px] text-tx-secondary">
                    {new Date(msg.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-tx-primary leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            {/each}
          {/if}
        </div>

        <!-- Form Kirim Balasan Admin -->
        <form
          method="POST"
          action="?/reply"
          use:enhance={() => {
            isSendingReply = true;
            return async ({ update }) => {
              await update();
              isSendingReply = false;
              replyText = '';
            };
          }}
          class="pt-3 border-t border-border-subtle space-y-3"
        >
          <label for="admin-reply-content" class="block text-xs font-bold text-tx-primary uppercase tracking-wider">
            Tulis Tanggapan Resmi OSIS IT
          </label>
          <textarea
            id="admin-reply-content"
            name="content"
            rows="4"
            placeholder="Ketik balasan atau penjelasan langkah penanganan yang diambil sekolah..."
            bind:value={replyText}
            required
            class="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-border-subtle bg-slate-50 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-brand-blue leading-relaxed"
          ></textarea>

          <div class="flex items-center justify-between">
            <span class="text-[11px] text-tx-secondary">
              Siswa akan melihat balasan ini saat membuka kode rahasianya.
            </span>
            <button
              type="submit"
              disabled={isSendingReply || replyText.trim().length < 5}
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-blue-dark disabled:opacity-50 transition-colors"
            >
              {#if isSendingReply}
                <span class="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Mengirim...</span>
              {:else}
                <Send class="w-3.5 h-3.5" />
                <span>Kirim Tanggapan</span>
              {/if}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Kolom Kanan: Panel Tindakan & Status (1 Kolom) -->
    <div class="space-y-6">
      <!-- Ubah Status Penanganan -->
      <div class="p-5 rounded-2xl bg-surface border border-border-subtle shadow-xs space-y-4">
        <h3 class="text-xs font-bold text-tx-primary uppercase tracking-wider">
          Perbarui Status Penanganan
        </h3>

        <form method="POST" action="?/updateStatus" use:enhance class="space-y-3">
          <select
            name="handling_status"
            value={data.report.handling_status}
            class="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle bg-slate-50 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-brand-blue font-semibold"
          >
            <option value="new">Baru (Belum Ditangani)</option>
            <option value="reviewing">Ditinjau oleh Tim OSIS IT</option>
            <option value="in_progress">Sedang Diproses / Dikoordinasikan</option>
            <option value="awaiting_response">Menunggu Keterangan Siswa</option>
            <option value="resolved">Selesai Ditindaklanjuti</option>
          </select>

          <button
            type="submit"
            class="w-full py-2 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-blue-dark transition-colors"
          >
            Simpan Status Penanganan
          </button>
        </form>
      </div>

      <!-- Moderasi Publikasi -->
      <div class="p-5 rounded-2xl bg-surface border border-border-subtle shadow-xs space-y-4">
        <h3 class="text-xs font-bold text-tx-primary uppercase tracking-wider">
          Moderasi Aspirasi Publik
        </h3>

        {#if isSensitive}
          <div class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-1">
            <span class="font-bold flex items-center gap-1.5 text-danger">
              <Lock class="w-3.5 h-3.5" />
              <span>Proteksi Kategori Sensitif</span>
            </span>
            <p class="leading-relaxed text-[11px]">
              Laporan ini berkategori <strong>{data.report.category}</strong>. Berdasarkan kebijakan privasi SMK Bagimu Negeriku, laporan sensitif dilarang dipublikasikan.
            </p>
          </div>
        {:else}
          <form method="POST" action="?/updatePublication" use:enhance class="space-y-3">
            <select
              name="publication_status"
              value={data.report.publication_status}
              class="w-full px-3 py-2 text-xs rounded-xl border border-border-subtle bg-slate-50 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-brand-blue font-semibold"
            >
              <option value="pending">Menunggu Moderasi</option>
              <option value="approved">Dipublikasikan di Feed Siswa</option>
              <option value="rejected">Ditolak dari Publik</option>
              <option value="hidden">Disembunyikan (Privat)</option>
            </select>

            <button
              type="submit"
              class="w-full py-2 rounded-xl bg-surface border border-border-subtle hover:bg-slate-50 text-tx-primary text-xs font-bold transition-colors"
            >
              Simpan Status Publikasi
            </button>
          </form>
        {/if}
      </div>

      <!-- Ringkasan Informasi Sistem -->
      <div class="p-5 rounded-2xl bg-surface border border-border-subtle shadow-xs space-y-3 text-xs">
        <h3 class="text-xs font-bold text-tx-primary uppercase tracking-wider">Informasi Teknis</h3>
        <div class="space-y-2 text-tx-secondary">
          <div class="flex justify-between">
            <span>ID Internal:</span>
            <span class="font-mono text-tx-primary font-bold">{data.report.id}</span>
          </div>
          <div class="flex justify-between">
            <span>Visibilitas:</span>
            <span class="font-bold text-tx-primary uppercase">{data.report.visibility}</span>
          </div>
          <div class="flex justify-between">
            <span>Terakhir Diperbarui:</span>
            <span>{new Date(data.report.updated_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {#if activePreviewImage}
    <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-5 max-w-2xl w-full max-h-[90vh] flex flex-col space-y-3 shadow-card animate-in fade-in">
        <div class="flex items-center justify-between border-b border-border-subtle pb-3">
          <span class="text-xs font-bold text-tx-primary">Pratinjau Bukti Lampiran</span>
          <button
            type="button"
            onclick={() => (activePreviewImage = null)}
            class="p-1.5 rounded-lg text-tx-secondary hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="flex-1 overflow-auto flex items-center justify-center p-3 bg-slate-50 rounded-2xl min-h-[250px]">
          <img src={activePreviewImage} alt="Bukti Lampiran Siswa" class="max-h-[60vh] object-contain rounded-xl" />
        </div>
        <div class="flex justify-end pt-1">
          <button
            type="button"
            onclick={() => (activePreviewImage = null)}
            class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-tx-primary text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
