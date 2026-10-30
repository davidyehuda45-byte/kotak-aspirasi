<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';
  import { Lock, User, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-svelte';

  let { form }: { form: ActionData } = $props();

  let isSubmitting = $state(false);
  let username = $state('admin_osis');
  let password = $state('osis_amanah_2026');

  $effect(() => {
    if (form?.username) {
      username = form.username;
    }
  });
</script>

<div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-blue-50/50 via-canvas to-canvas">
  <div class="w-full max-w-md space-y-6">
    <div class="text-center space-y-3">
      <div class="flex items-center justify-center gap-3">
        <img src="/logo-smk.png" alt="Logo SMK Bagimu Negeriku" class="w-12 h-12 object-contain" />
        <img src="/logo-osis.jpg" alt="Logo OSIS" class="w-10 h-12 object-contain" />
      </div>
      <div>
        <h1 class="text-2xl font-extrabold text-brand-blue-dark tracking-tight">Portal Pengurus OSIS</h1>
        <p class="text-xs text-tx-secondary mt-1">
          SMK Bagimu Negeriku · Sekbid 3 (Teknologi & Informasi)
        </p>
      </div>
    </div>

    {#if form?.error}
      <div class="p-3.5 rounded-xl bg-danger-subtle border border-red-200 text-danger text-xs flex items-center gap-2.5">
        <AlertCircle class="w-4 h-4 shrink-0" />
        <span>{form.error}</span>
      </div>
    {/if}

    <div class="p-6 sm:p-8 rounded-2xl bg-surface border border-border-subtle shadow-md space-y-5">
      <div class="flex items-center gap-2 text-xs font-semibold text-brand-blue bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200/60">
        <ShieldCheck class="w-4 h-4" />
        <span>Jalur Khusus Admin Terenkripsi</span>
      </div>

      <form
        method="POST"
        action="?/login"
        use:enhance={() => {
          isSubmitting = true;
          return async ({ update }) => {
            await update();
            isSubmitting = false;
          };
        }}
        class="space-y-4"
      >
        <div class="space-y-1.5">
          <label for="username" class="block text-xs font-bold text-tx-primary uppercase tracking-wider">
            Username Pengurus
          </label>
          <div class="relative">
            <input
              id="username"
              name="username"
              type="text"
              bind:value={username}
              required
              class="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-border-subtle bg-slate-50 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
            />
            <User class="w-4 h-4 text-tx-secondary absolute left-3 top-3" />
          </div>
        </div>

        <div class="space-y-1.5">
          <label for="password" class="block text-xs font-bold text-tx-primary uppercase tracking-wider">
            Kata Sandi
          </label>
          <div class="relative">
            <input
              id="password"
              name="password"
              type="password"
              bind:value={password}
              required
              class="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-border-subtle bg-slate-50 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
            />
            <Lock class="w-4 h-4 text-tx-secondary absolute left-3 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          class="w-full py-2.5 rounded-xl bg-brand-blue text-white text-xs sm:text-sm font-bold hover:bg-brand-blue-dark transition-colors shadow-xs disabled:opacity-50"
        >
          {#if isSubmitting}
            <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Memverifikasi...</span>
          {:else}
            <span>Masuk ke Dashboard OSIS</span>
          {/if}
        </button>
      </form>

      <!-- Keterangan Akses Demo Lokal -->
      <div class="pt-3 border-t border-border-subtle text-[11px] text-tx-secondary space-y-1">
        <span class="font-semibold text-tx-primary">Kredensial Pengujian Bawaan:</span>
        <div class="flex flex-col gap-0.5 font-mono text-[11px]">
          <span>Username: <strong class="text-tx-primary">admin_osis</strong></span>
          <span>Password: <strong class="text-tx-primary">osis_amanah_2026</strong></span>
        </div>
      </div>
    </div>

    <div class="text-center">
      <a
        href="/"
        class="inline-flex items-center gap-1.5 text-xs text-tx-secondary hover:text-brand-blue transition-colors font-medium"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        <span>Kembali ke Halaman Aspirasi Siswa</span>
      </a>
    </div>
  </div>
</div>
