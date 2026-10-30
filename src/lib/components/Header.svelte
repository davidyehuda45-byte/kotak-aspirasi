<script lang="ts">
  import { Shield, Send, Search, MessageSquare, BookOpen, Menu, X } from 'lucide-svelte';

  let { activeTab = 'kirim', onSelectTab }: { activeTab?: string; onSelectTab?: (tab: string) => void } = $props();

  let isMobileMenuOpen = $state(false);

  function handleTabClick(tab: string) {
    if (onSelectTab) {
      onSelectTab(tab);
    }
    isMobileMenuOpen = false;
  }
</script>

<header class="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border-subtle shadow-soft transition-all">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-20">
      <!-- Identitas Brand: 2 Logo Berdampingan dengan Frame Bersih -->
      <a href="/" class="flex items-center gap-3.5 group">
        <div class="flex items-center gap-2 p-1 rounded-xl bg-slate-50 border border-slate-200/60 shadow-2xs group-hover:border-blue-300 transition-colors">
          <img
            src="/logo-smk.png"
            alt="Logo SMK Bagimu Negeriku"
            class="w-9 h-9 object-contain"
          />
          <img
            src="/logo-osis.jpg"
            alt="Logo OSIS"
            class="w-8 h-9 object-contain"
          />
        </div>

        <div class="border-l border-slate-200/80 pl-3">
          <div class="flex items-center gap-2">
            <span class="text-sm font-black tracking-tight text-brand-blue-dark leading-none">
              KOTAK ASPIRASI
            </span>
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue border border-blue-200">
              Sekbid 3 IT
            </span>
          </div>
          <span class="block text-xs text-tx-secondary font-medium tracking-normal mt-1">
            SMK Bagimu Negeriku
          </span>
        </div>
      </a>

      <!-- Desktop Navigation Tabs (Segmented Control Berstandar Modern) -->
      <nav class="hidden md:flex items-center p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 shadow-2xs">
        <button
          type="button"
          onclick={() => handleTabClick('kirim')}
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 {activeTab === 'kirim' ? 'bg-brand-blue text-white shadow-xs' : 'text-tx-secondary hover:text-tx-primary hover:bg-white/60'}"
        >
          <Send class="w-3.5 h-3.5" />
          <span>Kirim Aspirasi</span>
        </button>

        <button
          type="button"
          onclick={() => handleTabClick('lacak')}
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 {activeTab === 'lacak' ? 'bg-brand-blue text-white shadow-xs' : 'text-tx-secondary hover:text-tx-primary hover:bg-white/60'}"
        >
          <Search class="w-3.5 h-3.5" />
          <span>Lacak via Kode</span>
        </button>

        <button
          type="button"
          onclick={() => handleTabClick('publik')}
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 {activeTab === 'publik' ? 'bg-brand-blue text-white shadow-xs' : 'text-tx-secondary hover:text-tx-primary hover:bg-white/60'}"
        >
          <MessageSquare class="w-3.5 h-3.5" />
          <span>Aspirasi Publik</span>
        </button>

        <button
          type="button"
          onclick={() => handleTabClick('panduan')}
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 {activeTab === 'panduan' ? 'bg-brand-blue text-white shadow-xs' : 'text-tx-secondary hover:text-tx-primary hover:bg-white/60'}"
        >
          <BookOpen class="w-3.5 h-3.5" />
          <span>Panduan</span>
        </button>
      </nav>

      <!-- Mobile Menu Button -->
      <div class="flex md:hidden items-center">
        <button
          type="button"
          aria-label="Buka menu navigasi"
          onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
          class="p-2.5 rounded-xl text-tx-secondary hover:text-tx-primary hover:bg-slate-100 border border-border-subtle shadow-2xs"
        >
          {#if isMobileMenuOpen}
            <X class="w-5 h-5 stroke-[2]" />
          {:else}
            <Menu class="w-5 h-5 stroke-[2]" />
          {/if}
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Drawer -->
  {#if isMobileMenuOpen}
    <div class="md:hidden border-t border-border-subtle bg-surface px-4 py-3 space-y-1.5 shadow-card">
      <button
        type="button"
        onclick={() => handleTabClick('kirim')}
        class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors {activeTab === 'kirim' ? 'bg-brand-blue text-white' : 'text-tx-primary hover:bg-slate-50'}"
      >
        <Send class="w-4 h-4" />
        <span>Kirim Aspirasi Anonim</span>
      </button>

      <button
        type="button"
        onclick={() => handleTabClick('lacak')}
        class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors {activeTab === 'lacak' ? 'bg-brand-blue text-white' : 'text-tx-primary hover:bg-slate-50'}"
      >
        <Search class="w-4 h-4" />
        <span>Lacak via Kode Rahasia</span>
      </button>

      <button
        type="button"
        onclick={() => handleTabClick('publik')}
        class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors {activeTab === 'publik' ? 'bg-brand-blue text-white' : 'text-tx-primary hover:bg-slate-50'}"
      >
        <MessageSquare class="w-4 h-4" />
        <span>Aspirasi Publik Terverifikasi</span>
      </button>

      <button
        type="button"
        onclick={() => handleTabClick('panduan')}
        class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors {activeTab === 'panduan' ? 'bg-brand-blue text-white' : 'text-tx-primary hover:bg-slate-50'}"
      >
        <BookOpen class="w-4 h-4" />
        <span>Panduan Privasi & Bantuan</span>
      </button>
    </div>
  {/if}
</header>
