<script lang="ts">
  import './layout.css';
  import { page } from '$app/state';
  import Footer from '#lib/components/Footer.svelte';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();

  let isAdminRoute = $derived(
    page.url.pathname.startsWith('/admin-aspirasi') || page.url.pathname.startsWith('/admin')
  );
</script>

<svelte:head>
  <title>Kotak Aspirasi Siswa — SMK Bagimu Negeriku (OSIS Sekbid 3 IT)</title>
  <meta
    name="description"
    content="Ruang aspirasi digital resmi SMK Bagimu Negeriku dipersembahkan oleh OSIS Sekbid 3 IT. Sampaikan saran, kritik, dan laporan secara 100% aman dan anonim."
  />
</svelte:head>

<div class="min-h-screen flex flex-col bg-canvas text-tx-primary selection:bg-blue-100 selection:text-brand-blue-dark">
  {#if !isAdminRoute}
    <!-- Area Pengguna Publik Siswa (Header dihandle secara terpadu di halaman utama atau layout) -->
    <main class="flex-1">
      {@render children()}
    </main>
    <Footer />
  {:else}
    <div class="flex-1 flex flex-col">
      {@render children()}
    </div>
  {/if}
</div>
