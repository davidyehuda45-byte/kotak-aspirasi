<script lang="ts">
  import { page } from '$app/state';
  import type { LayoutProps } from './$types';
  import {
    LayoutDashboard,
    Inbox,
    CheckSquare,
    BarChart3,
    History,
    Settings,
    LogOut,
    Shield,
    Menu,
    X,
    ExternalLink
  } from 'lucide-svelte';

  let { children }: LayoutProps = $props();

  let isMobileSidebarOpen = $state(false);

  let isLoginPage = $derived(page.url.pathname === '/admin-aspirasi/login');

  const navigation = [
    { name: 'Dashboard', href: '/admin-aspirasi', icon: LayoutDashboard },
    { name: 'Laporan Masuk', href: '/admin-aspirasi/reports', icon: Inbox },
    { name: 'Moderasi Publik', href: '/admin-aspirasi/moderation', icon: CheckSquare },
    { name: 'Statistik & Analitik', href: '/admin-aspirasi/analytics', icon: BarChart3 },
    { name: 'Log Audit', href: '/admin-aspirasi/audit', icon: History },
    { name: 'Pengaturan', href: '/admin-aspirasi/settings', icon: Settings }
  ];
</script>

{#if isLoginPage}
  {@render children()}
{:else}
  <div class="min-h-screen bg-canvas flex flex-col md:flex-row">
    <!-- Desktop Sidebar -->
    <aside class="hidden md:flex flex-col w-64 bg-surface border-r border-border-subtle shrink-0">
      <!-- Brand -->
      <div class="h-20 flex items-center gap-3 px-6 border-b border-border-subtle bg-slate-50/50">
        <div class="flex items-center gap-1.5">
          <img src="/logo-smk.png" alt="Logo SMK" class="w-8 h-8 object-contain" />
          <img src="/logo-osis.jpg" alt="Logo OSIS" class="w-7 h-8 object-contain" />
        </div>
        <div>
          <span class="block text-xs font-extrabold tracking-tight text-brand-blue-dark uppercase leading-tight">Admin OSIS IT</span>
          <span class="block text-[10px] text-tx-secondary font-medium mt-0.5">SMK Bagimu Negeriku</span>
        </div>
      </div>

      <!-- Nav Links -->
      <nav class="flex-1 px-3 py-4 space-y-1">
        {#each navigation as item}
          {@const isActive = item.href === '/admin-aspirasi' ? page.url.pathname === '/admin-aspirasi' : page.url.pathname.startsWith(item.href)}
          <a
            href={item.href}
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all {isActive ? 'bg-brand-blue text-white shadow-xs' : 'text-tx-secondary hover:text-tx-primary hover:bg-slate-100'}"
          >
            <item.icon class="w-4 h-4 stroke-[2]" />
            <span>{item.name}</span>
          </a>
        {/each}
      </nav>

      <!-- Bottom Profile & Logout -->
      <div class="p-3 border-t border-border-subtle space-y-2 bg-slate-50/40">
        <a
          href="/"
          target="_blank"
          class="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-tx-secondary hover:text-brand-blue hover:bg-white transition-colors"
        >
          <span class="flex items-center gap-2">
            <ExternalLink class="w-3.5 h-3.5" />
            <span>Lihat Halaman Siswa</span>
          </span>
        </a>

        <form method="POST" action="/admin-aspirasi/login?/logout">
          <button
            type="submit"
            class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-danger hover:bg-red-50 transition-colors"
          >
            <LogOut class="w-4 h-4" />
            <span>Keluar Akun Admin</span>
          </button>
        </form>
      </div>
    </aside>

    <!-- Mobile Topbar -->
    <div class="md:hidden flex items-center justify-between h-16 px-4 bg-surface border-b border-border-subtle sticky top-0 z-30">
      <div class="flex items-center gap-2">
        <img src="/logo-smk.png" alt="Logo SMK" class="w-7 h-7 object-contain" />
        <span class="text-xs font-bold text-brand-blue-dark uppercase">Admin OSIS IT</span>
      </div>

      <button
        type="button"
        aria-label="Toggle menu"
        onclick={() => (isMobileSidebarOpen = !isMobileSidebarOpen)}
        class="p-2 text-tx-secondary hover:bg-slate-100 rounded-lg"
      >
        {#if isMobileSidebarOpen}
          <X class="w-5 h-5" />
        {:else}
          <Menu class="w-5 h-5" />
        {/if}
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    {#if isMobileSidebarOpen}
      <div class="md:hidden bg-surface border-b border-border-subtle px-4 py-3 space-y-1 shadow-md">
        {#each navigation as item}
          {@const isActive = item.href === '/admin-aspirasi' ? page.url.pathname === '/admin-aspirasi' : page.url.pathname.startsWith(item.href)}
          <a
            href={item.href}
            onclick={() => (isMobileSidebarOpen = false)}
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold {isActive ? 'bg-brand-blue text-white' : 'text-tx-primary hover:bg-slate-100'}"
          >
            <item.icon class="w-4 h-4" />
            <span>{item.name}</span>
          </a>
        {/each}

        <div class="pt-2 border-t border-border-subtle flex items-center justify-between">
          <a href="/" target="_blank" class="text-xs text-tx-secondary hover:underline">Lihat Halaman Siswa</a>
          <form method="POST" action="/admin-aspirasi/login?/logout">
            <button type="submit" class="text-xs font-bold text-danger">Keluar</button>
          </form>
        </div>
      </div>
    {/if}

    <!-- Main Content Area -->
    <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
      {@render children()}
    </main>
  </div>
{/if}
