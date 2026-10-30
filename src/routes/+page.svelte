<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';
  import type { ReportCategory, ReportVisibility } from '#lib/types';
  import Header from '#lib/components/Header.svelte';
  import Badge from '#lib/components/Badge.svelte';
  import {
    Shield,
    Lock,
    Send,
    Search,
    MessageSquare,
    BookOpen,
    AlertTriangle,
    Copy,
    Check,
    ArrowRight,
    Paperclip,
    Eye,
    EyeOff,
    CheckCircle,
    CheckCircle2,
    User,
    LifeBuoy,
    Code2,
    Filter,
    ShieldCheck,
    Lightbulb,
    Wrench,
    Users,
    Scale,
    ShieldAlert,
    AlertOctagon,
    HeartHandshake,
    HelpCircle,
    Clock,
    FileText,
    X,
    Image as ImageIcon
  } from 'lucide-svelte';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  // Tab aktif ('kirim' | 'lacak' | 'publik' | 'panduan')
  let activeTab = $state<'kirim' | 'lacak' | 'publik' | 'panduan'>('kirim');

  // State Form Kirim Aspirasi
  let title = $state('');
  let category = $state<ReportCategory>('saran');
  let content = $state('');
  let visibility = $state<ReportVisibility>('public');
  let agreement = $state(false);
  let isSubmitting = $state(false);
  let copied = $state(false);

  // Kategori sensitif
  const sensitiveCategories: ReportCategory[] = ['bullying', 'kekerasan', 'masalah_pribadi'];
  let isSensitive = $derived(sensitiveCategories.includes(category));

  $effect(() => {
    if (isSensitive) {
      visibility = 'private';
    }
  });

  const categoryList: {
    value: ReportCategory;
    label: string;
    desc: string;
    icon: typeof Lightbulb;
    sensitive?: boolean;
  }[] = [
    { value: 'bullying', label: 'Bullying / Perundungan', desc: 'Intimidasi fisik, verbal, atau cyberbullying (Privat)', icon: ShieldAlert, sensitive: true },
    { value: 'fasilitas', label: 'Fasilitas & Sarpras', desc: 'Kendala alat praktik, ruang kelas, atau komputer', icon: Wrench },
    { value: 'saran', label: 'Saran & Ide', desc: 'Gagasan konstruktif kegiatan/program sekolah', icon: Lightbulb },
    { value: 'osis', label: 'Program OSIS', desc: 'Masukan event dan kepengurusan siswa', icon: Users },
    { value: 'kritik', label: 'Kritik Konstruktif', desc: 'Evaluasi kebijakan atau sistem sekolah', icon: Scale },
    { value: 'kekerasan', label: 'Kekerasan / Ancaman', desc: 'Bahaya keselamatan (Otomatis Terkunci Privat)', icon: AlertOctagon, sensitive: true },
    { value: 'masalah_pribadi', label: 'Masalah Pribadi', desc: 'Kendala mental/keluarga butuh konseling (Privat)', icon: HeartHandshake, sensitive: true },
    { value: 'lainnya', label: 'Lainnya', desc: 'Topik umum lainnya yang relevan', icon: HelpCircle }
  ];

  function selectBullying() {
    activeTab = 'kirim';
    category = 'bullying';
    visibility = 'private';
    setTimeout(() => {
      const formEl = document.getElementById('form-aspirasi');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  }

  // State Tab Lacak
  let secretCodeInput = $state('');
  let isSearching = $state(false);
  let isReplying = $state(false);
  let replyContent = $state('');

  // State Lampiran Pratinjau
  let attachmentPreview = $state<string | null>(null);
  let attachmentName = $state('');
  let attachmentSize = $state(0);
  let fileInputEl = $state<HTMLInputElement | null>(null);

  function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      attachmentName = file.name;
      attachmentSize = file.size;
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          attachmentPreview = ev.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        attachmentPreview = null;
      }
    } else {
      removeAttachment();
    }
  }

  function removeAttachment() {
    attachmentPreview = null;
    attachmentName = '';
    attachmentSize = 0;
    if (fileInputEl) {
      fileInputEl.value = '';
    }
  }

  $effect(() => {
    if (data.initialCode) {
      secretCodeInput = data.initialCode;
      activeTab = 'lacak';
    }
  });

  $effect(() => {
    if (form?.enteredCode) {
      secretCodeInput = form.enteredCode;
    }
    if (form?.formType === 'lookup' || form?.formType === 'reply') {
      activeTab = 'lacak';
    }
  });

  let activeTrackedReport = $derived(
    form?.trackedReport || data.trackedReport
  );

  // State Tab Aspirasi Publik
  let publicCategoryFilter = $state('all');
  let publicSearchQuery = $state('');

  let filteredPublicReports = $derived(() => {
    let list = data.publicReports;
    if (publicCategoryFilter !== 'all') {
      list = list.filter((r) => r.category === publicCategoryFilter);
    }
    if (publicSearchQuery.trim().length > 0) {
      const q = publicSearchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.content.toLowerCase().includes(q) ||
          r.public_reference.toLowerCase().includes(q)
      );
    }
    return list;
  });

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2500);
  }

  function quickFillCode(code: string) {
    secretCodeInput = code;
    activeTab = 'lacak';
  }
</script>

<!-- Header dengan 2 Logo Resmi -->
<Header
  {activeTab}
  onSelectTab={(tab) => {
    activeTab = tab as typeof activeTab;
  }}
/>

<!-- Hero Section Ringkas, Elegan & Modern -->
<section class="border-b border-border-subtle bg-subtle-grid bg-white py-8 md:py-12">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3.5">
    <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
      Kotak Aspirasi Digital Siswa
    </h1>
    <p class="text-xs sm:text-sm text-tx-secondary max-w-xl mx-auto leading-relaxed">
      Ruang aman SMK Bagimu Negeriku untuk menyampaikan ide, evaluasi fasilitas, maupun laporan perundungan secara 100% anonim tanpa registrasi akun.
    </p>

    <!-- Bar Fasilitas & Jalur Anti-Bullying Terpadu -->
    <div class="pt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-tx-secondary font-medium">
        <Lock class="w-3.5 h-3.5 text-brand-blue" />
        <span>100% Tanpa Akun</span>
      </span>

      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-tx-secondary font-medium">
        <ShieldCheck class="w-3.5 h-3.5 text-brand-blue" />
        <span>Terkunci Privat Otomatis</span>
      </span>

      <button
        type="button"
        onclick={selectBullying}
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 hover:bg-red-100 text-red-700 font-bold border border-red-200 transition-colors shadow-2xs cursor-pointer"
      >
        <ShieldAlert class="w-3.5 h-3.5 text-red-600" />
        <span>Jalur Khusus Anti-Bullying &rarr;</span>
      </button>
    </div>
  </div>
</section>

<!-- Konten Utama 1 Halaman -->
<div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
  <!-- ==================== TAB 1: FORMULIR KIRIM ASPIRASI ==================== -->
  {#if activeTab === 'kirim'}
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="border-b border-border-subtle pb-3">
        <h2 class="text-lg sm:text-xl font-bold text-tx-primary">Tulis Aspirasi atau Laporanmu</h2>
        <p class="text-xs text-tx-secondary mt-0.5">
          Identitasmu dijamin terlindungi. Silakan pilih kategori dan sampaikan aspirasimu secara jelas dan santun.
        </p>
      </div>

      {#if form?.submitError}
        <div class="p-4 rounded-2xl bg-danger-subtle border border-red-200 text-danger text-xs flex items-start gap-3">
          <AlertTriangle class="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p class="font-bold">Periksa Kembali Laporan</p>
            <p class="mt-0.5">{form.submitError}</p>
          </div>
        </div>
      {/if}

      {#if form?.submitSuccess}
        <!-- Modal Sukses dengan Kode Rahasia -->
        <div class="p-6 sm:p-8 rounded-3xl bg-white border-2 border-brand-blue shadow-card space-y-6 animate-in fade-in duration-300">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center border border-blue-200 shadow-2xs">
              <Check class="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h3 class="text-lg font-extrabold text-tx-primary">Aspirasi Berhasil Dikirim</h3>
              <p class="text-xs text-tx-secondary">Referensi Publik: <strong class="font-mono text-brand-blue">{form.publicReference}</strong></p>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-slate-50 border border-blue-200/70 space-y-3">
            <span class="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Kode Rahasia Pelacakan Laporan
            </span>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-blue-200 shadow-soft">
              <span class="font-mono text-2xl font-extrabold tracking-widest text-brand-blue">
                {form.secretCode}
              </span>
              <button
                type="button"
                onclick={() => copyCode(form?.secretCode || '')}
                class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-blue-hover transition-colors shadow-xs"
              >
                {#if copied}
                  <Check class="w-4 h-4" />
                  <span>Tersalin</span>
                {:else}
                  <Copy class="w-4 h-4" />
                  <span>Salin Kode</span>
                {/if}
              </button>
            </div>
            <p class="text-xs text-danger font-semibold leading-relaxed">
              PENTING: Simpan atau catat kode ini sekarang. Kode ini digunakan untuk memeriksa balasan resmi OSIS Sekbid 3 IT. Sistem tidak menyimpan email atau nomormu, sehingga kode yang hilang tidak dapat dipulihkan.
            </p>
          </div>

          <div class="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onclick={() => quickFillCode(form?.secretCode || '')}
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-blue-hover transition-colors shadow-xs"
            >
              <Search class="w-4 h-4" />
              <span>Buka Menu Pelacakan Sekarang</span>
            </button>
            <button
              type="button"
              onclick={() => {
                form = null;
                title = '';
                content = '';
                agreement = false;
              }}
              class="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-border-subtle bg-white text-tx-primary text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Kirim Aspirasi Lainnya
            </button>
          </div>
        </div>
      {:else}
        <!-- Form Pengiriman Modern -->
        <form
          id="form-aspirasi"
          method="POST"
          action="?/submitReport"
          enctype="multipart/form-data"
          use:enhance={() => {
            isSubmitting = true;
            return async ({ update }) => {
              await update();
              isSubmitting = false;
            };
          }}
          class="p-6 sm:p-8 rounded-3xl bg-white border border-border-subtle shadow-card space-y-6"
        >
          <!-- Honeypot Anti-Spam (Zero-Cost Bot Protection) -->
          <div class="hidden" aria-hidden="true">
            <input type="text" name="hp_confirm_identity" tabindex="-1" autocomplete="off" />
          </div>
          <!-- Field 1: Kategori dengan Kartu Interaktif Ber-Ikon -->
          <div class="space-y-2.5">
            <label for="category-radio" class="block text-xs font-bold text-tx-primary uppercase tracking-wider">
              Kategori Aspirasi <span class="text-danger">*</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {#each categoryList as item}
                {@const isSelected = category === item.value}
                <label
                  class="flex items-start gap-3 p-3.5 rounded-2xl border text-xs cursor-pointer transition-all duration-200 {isSelected ? 'border-brand-blue bg-blue-50/60 ring-2 ring-brand-blue/20 shadow-xs' : 'border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'}"
                >
                  <input
                    type="radio"
                    name="category"
                    value={item.value}
                    bind:group={category}
                    class="mt-1 text-brand-blue focus:ring-brand-blue"
                  />
                  <div class="space-y-0.5 flex-1">
                    <div class="flex items-center justify-between">
                      <span class="font-bold {item.sensitive ? 'text-red-700' : 'text-slate-900'}">
                        {item.label}
                      </span>
                      <item.icon class="w-3.5 h-3.5 {item.sensitive ? 'text-red-500' : 'text-brand-blue'} opacity-80" />
                    </div>
                    <span class="block text-[11px] text-tx-secondary leading-normal">
                      {item.desc}
                    </span>
                  </div>
                </label>
              {/each}
            </div>
          </div>

          <!-- Alert Jika Kategori Sensitif Terpilih -->
          {#if isSensitive}
            <div class="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-950 space-y-3 shadow-2xs">
              <div class="flex items-center gap-2 font-bold text-danger">
                <Lock class="w-4 h-4" />
                <span>Kategori Sensitif Terproteksi</span>
              </div>
              <p class="leading-relaxed">
                Laporan ini otomatis dikunci ke visibilitas <strong>Privat</strong>. Laporan bullying, kekerasan, dan masalah pribadi tidak akan pernah dipublikasikan di halaman umum sekolah dan hanya dapat diakses oleh tim penanganan khusus.
              </p>

              {#if category === 'bullying'}
                <div class="pt-2 border-t border-red-200/80 space-y-2">
                  <span class="text-[11px] font-bold text-red-900 block">Pilih jenis perundungan untuk melengkapi laporan:</span>
                  <div class="flex flex-wrap gap-1.5">
                    {#each ['Intimidasi / Ejekan Verbal', 'Kekerasan Fisik', 'Pengucilan / Diskriminasi', 'Cyberbullying di Media Sosial', 'Pemalakan / Pemerasan'] as tag}
                      <button
                        type="button"
                        onclick={() => {
                          if (!content.includes(tag)) {
                            content = content ? `${content}\n[Kategori Kasus: ${tag}] ` : `[Kategori Kasus: ${tag}] `;
                          }
                          if (!title) {
                            title = `Laporan ${tag}`;
                          }
                        }}
                        class="px-2.5 py-1 rounded-lg bg-white border border-red-200 text-[11px] font-semibold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        + {tag}
                      </button>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {/if}

          <!-- Field 2: Judul -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label for="title" class="block text-xs font-bold text-tx-primary uppercase tracking-wider">
                Judul Aspirasi / Laporan <span class="text-danger">*</span>
              </label>
              <span class="text-[11px] text-tx-secondary font-mono">{title.length}/120</span>
            </div>
            <input
              id="title"
              name="title"
              type="text"
              maxlength="120"
              placeholder="Contoh: Penambahan kabel LAN praktikum di Lab RPL"
              bind:value={title}
              required
              class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors shadow-2xs"
            />
          </div>

          <!-- Field 3: Isi dengan Live Character Progress Indicator -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label for="content" class="block text-xs font-bold text-tx-primary uppercase tracking-wider">
                Detail Aspirasi <span class="text-danger">*</span>
              </label>
              <span class="text-[11px] text-tx-secondary font-mono">{content.length}/5000</span>
            </div>
            <textarea
              id="content"
              name="content"
              rows="5"
              maxlength="5000"
              placeholder="Tuliskan permasalahan, ruang/kelas, waktu kejadian, atau ide solusi secara jelas. Hindari menyebarkan nama pribadi yang tidak relevan."
              bind:value={content}
              required
              class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors leading-relaxed shadow-2xs"
            ></textarea>

            <!-- Character progress bar -->
            <div class="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1">
              <div
                class="h-full rounded-full transition-all duration-200 {content.length < 20 ? 'bg-amber-400' : 'bg-brand-blue'}"
                style="width: {Math.min(100, Math.max(0, (content.length / 5000) * 100))}%"
              ></div>
            </div>
            <p class="text-[11px] text-tx-secondary">Minimal 20 karakter agar aspirasi dapat dipahami secara utuh.</p>
          </div>

          <!-- Field 4: Visibilitas -->
          <div class="space-y-2">
            <label for="visibility-radio" class="block text-xs font-bold text-tx-primary uppercase tracking-wider">
              Visibilitas Aspirasi
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                class="flex items-start gap-3 p-4 rounded-2xl border text-xs cursor-pointer transition-all duration-200 {visibility === 'public' && !isSensitive ? 'border-brand-blue bg-blue-50/60 ring-2 ring-brand-blue/20 shadow-xs' : 'border-slate-200/80'} {isSensitive ? 'opacity-40 cursor-not-allowed bg-slate-100' : 'hover:bg-slate-50'}"
              >
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  bind:group={visibility}
                  disabled={isSensitive}
                  class="mt-1 text-brand-blue focus:ring-brand-blue"
                />
                <div class="space-y-1">
                  <div class="flex items-center gap-1.5 font-bold text-tx-primary">
                    <Eye class="w-3.5 h-3.5 text-brand-blue" />
                    <span>Publik (Dengan Moderasi)</span>
                  </div>
                  <p class="text-[11px] text-tx-secondary leading-normal">
                    Bisa ditampilkan di tab Aspirasi Publik setelah diverifikasi dan disetujui pengurus OSIS IT.
                  </p>
                </div>
              </label>

              <label
                class="flex items-start gap-3 p-4 rounded-2xl border text-xs cursor-pointer transition-all duration-200 {visibility === 'private' ? 'border-brand-blue bg-blue-50/60 ring-2 ring-brand-blue/20 shadow-xs' : 'border-slate-200/80 hover:bg-slate-50'}"
              >
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  bind:group={visibility}
                  class="mt-1 text-brand-blue focus:ring-brand-blue"
                />
                <div class="space-y-1">
                  <div class="flex items-center gap-1.5 font-bold text-tx-primary">
                    <EyeOff class="w-3.5 h-3.5 text-slate-600" />
                    <span>Privat (Tertutup)</span>
                  </div>
                  <p class="text-[11px] text-tx-secondary leading-normal">
                    Hanya dibaca oleh pengurus OSIS dan kamu sendiri melalui kode rahasia. Tidak akan dipublikasikan.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <!-- Field 5: Lampiran dengan Pratinjau Gambar -->
          <div class="space-y-2">
            <label for="attachment" class="block text-xs font-bold text-tx-primary uppercase tracking-wider">
              Lampiran Bukti (Opsional)
            </label>

            {#if attachmentName}
              <!-- Box Pratinjau File Terpilih -->
              <div class="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div class="flex items-center gap-3">
                  {#if attachmentPreview}
                    <img
                      src={attachmentPreview}
                      alt="Pratinjau Bukti"
                      class="w-14 h-14 rounded-xl object-cover border border-blue-200 bg-white shrink-0 shadow-2xs"
                    />
                  {:else}
                    <div class="w-14 h-14 rounded-xl bg-white text-brand-blue flex items-center justify-center border border-blue-200 shrink-0">
                      <Paperclip class="w-6 h-6" />
                    </div>
                  {/if}
                  <div class="space-y-0.5">
                    <span class="block text-xs font-bold text-tx-primary truncate max-w-[200px] sm:max-w-[300px]">
                      {attachmentName}
                    </span>
                    <span class="block text-[11px] text-tx-secondary font-mono">
                      {(attachmentSize / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onclick={removeAttachment}
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-red-200 text-danger hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  <X class="w-3.5 h-3.5" />
                  <span>Batalkan</span>
                </button>
              </div>
            {/if}

            <div class="p-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 hover:bg-blue-50/30 hover:border-brand-blue transition-colors flex flex-col items-center justify-center text-center space-y-2 {attachmentName ? 'hidden' : 'block'}">
              <div class="w-8 h-8 rounded-full bg-white text-brand-blue flex items-center justify-center shadow-soft">
                <Paperclip class="w-4 h-4" />
              </div>
              <div class="text-xs text-tx-secondary">
                <label for="attachment" class="font-bold text-brand-blue cursor-pointer hover:underline">
                  Pilih file foto atau video pendek
                </label>
                <span> (Maksimal 15MB)</span>
              </div>
              <input
                id="attachment"
                name="attachment"
                type="file"
                bind:this={fileInputEl}
                onchange={handleFileChange}
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                class="block w-full text-xs text-tx-secondary file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-blue file:text-white hover:file:bg-brand-blue-hover cursor-pointer"
              />
            </div>
          </div>

          <!-- Field 6: Pernyataan Integritas -->
          <div class="pt-2">
            <label class="flex items-start gap-3 cursor-pointer text-xs p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                name="agreement"
                bind:checked={agreement}
                required
                class="mt-0.5 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
              />
              <span class="text-tx-secondary leading-relaxed">
                Saya menyampaikan aspirasi ini dengan bertanggung jawab sebagai siswa SMK Bagimu Negeriku, tanpa fitnah, dan memahami bahwa laporan sensitif diproses sesuai prinsip kerahasiaan sekolah.
              </span>
            </label>
          </div>

          <!-- Submit Button -->
          <div class="pt-4 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <Lock class="w-4 h-4 text-brand-blue" />
              <span>Tanpa pencatatan identitas pribadi</span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !agreement}
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-blue text-white font-bold text-xs sm:text-sm hover:bg-brand-blue-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs hover:shadow-md"
            >
              {#if isSubmitting}
                <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Mengirim...</span>
              {:else}
                <Send class="w-4 h-4" />
                <span>Kirim Aspirasi Sekarang</span>
              {/if}
            </button>
          </div>
        </form>
      {/if}
    </div>

  <!-- ==================== TAB 2: LACAK VIA KODE RAHASIA ==================== -->
  {:else if activeTab === 'lacak'}
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="border-b border-border-subtle pb-3">
        <h2 class="text-lg sm:text-xl font-bold text-tx-primary">Lacak Perkembangan Aspirasimu</h2>
        <p class="text-xs text-tx-secondary mt-0.5">
          Masukkan kode rahasia unik (misal: KAS-DEMO-0001) untuk memeriksa status dan membaca balasan OSIS.
        </p>
      </div>

      <!-- Box Pencarian Kode -->
      <div class="p-6 sm:p-7 rounded-3xl bg-white border border-border-subtle shadow-card space-y-4">
        <form
          method="POST"
          action="?/lookupReport"
          use:enhance={() => {
            isSearching = true;
            return async ({ update }) => {
              await update();
              isSearching = false;
            };
          }}
          class="flex flex-col sm:flex-row items-stretch gap-3"
        >
          <div class="relative flex-1">
            <input
              name="secretCode"
              type="text"
              placeholder="Masukkan Kode Rahasia (misal: KAS-DEMO-0001)"
              bind:value={secretCodeInput}
              required
              class="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 font-mono uppercase tracking-wider text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue shadow-2xs"
            />
            <Search class="w-4 h-4 text-tx-secondary absolute left-3.5 top-4" />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            class="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-blue-hover disabled:opacity-50 transition-colors shadow-xs"
          >
            {#if isSearching}
              <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Mencari...</span>
            {:else}
              <Search class="w-4 h-4" />
              <span>Buka Laporan</span>
            {/if}
          </button>
        </form>

        <!-- Fast Demo Helper Chips -->
        <div class="pt-3 flex flex-wrap items-center gap-2 text-[11px] text-tx-secondary border-t border-slate-100">
          <span class="font-bold text-tx-primary">Contoh Kode Demo:</span>
          <button
            type="button"
            onclick={() => quickFillCode('KAS-DEMO-0001')}
            class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-brand-blue font-mono font-bold text-tx-primary transition-colors border border-slate-200/60"
          >
            KAS-DEMO-0001 (Fasilitas Lab)
          </button>
          <button
            type="button"
            onclick={() => quickFillCode('KAS-DEMO-0002')}
            class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-brand-blue font-mono font-bold text-tx-primary transition-colors border border-slate-200/60"
          >
            KAS-DEMO-0002 (Saran Istirahat)
          </button>
          <button
            type="button"
            onclick={() => quickFillCode('KAS-DEMO-0004')}
            class="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 font-mono font-bold text-danger transition-colors border border-red-200/60"
          >
            KAS-DEMO-0004 (Bullying Privat)
          </button>
        </div>
      </div>

      {#if form?.lookupError}
        <div class="p-4 rounded-2xl bg-danger-subtle border border-red-200 text-danger text-xs flex items-start gap-3">
          <AlertTriangle class="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p class="font-bold">Laporan Tidak Ditemukan</p>
            <p class="mt-0.5">{form.lookupError}</p>
          </div>
        </div>
      {/if}

      <!-- Tampilan Laporan & Percakapan -->
      {#if activeTrackedReport}
        <div class="space-y-6">
          <div class="p-6 sm:p-8 rounded-3xl bg-white border border-border-subtle shadow-card space-y-6">
            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs font-bold text-brand-blue bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  {activeTrackedReport.public_reference}
                </span>
                <Badge status={activeTrackedReport.category} type="category" />
                <Badge status={activeTrackedReport.handling_status} type="handling" />
                {#if activeTrackedReport.visibility === 'private'}
                  <span class="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                    <Lock class="w-3 h-3" />
                    <span>Privat</span>
                  </span>
                {/if}
              </div>
              <span class="text-xs text-tx-secondary">
                Diajukan pada {new Date(activeTrackedReport.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}
              </span>
            </div>

            <div class="space-y-3">
              <h3 class="text-lg font-bold text-tx-primary leading-snug">
                {activeTrackedReport.title}
              </h3>
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-tx-primary leading-relaxed whitespace-pre-wrap">
                {activeTrackedReport.content}
              </div>
            </div>
          </div>

          <!-- Thread Pesan Dua Arah -->
          <div class="p-6 sm:p-8 rounded-3xl bg-white border border-border-subtle shadow-card space-y-6">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div class="flex items-center gap-2">
                <MessageSquare class="w-4 h-4 text-brand-blue" />
                <h4 class="text-sm font-bold text-tx-primary">Tanggapan & Diskusi dengan Pengurus OSIS</h4>
              </div>
              <span class="text-xs text-tx-secondary font-medium">
                {activeTrackedReport.messages ? activeTrackedReport.messages.length : 0} Pesan
              </span>
            </div>

            <div class="space-y-3">
              {#if !activeTrackedReport.messages || activeTrackedReport.messages.length === 0}
                <div class="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200 text-xs text-tx-secondary">
                  Belum ada balasan dari pengurus OSIS IT. Laporanmu sudah berada dalam antrean dan sedang ditinjau.
                </div>
              {:else}
                {#each activeTrackedReport.messages as msg}
                  <div
                    class="p-4 rounded-2xl border space-y-1.5 {msg.sender_type === 'admin' ? 'bg-blue-50/70 border-blue-200/80' : 'bg-slate-50 border-slate-200/80'}"
                  >
                    <div class="flex items-center justify-between text-xs">
                      <div class="flex items-center gap-1.5 font-bold {msg.sender_type === 'admin' ? 'text-brand-blue' : 'text-tx-primary'}">
                        {#if msg.sender_type === 'admin'}
                          <Shield class="w-3.5 h-3.5" />
                          <span>{msg.sender_name || 'Pengurus OSIS IT'}</span>
                          <span class="px-1.5 py-0.2 rounded bg-brand-blue text-white text-[10px] font-normal">Resmi</span>
                        {:else}
                          <User class="w-3.5 h-3.5" />
                          <span>Pelapor (Siswa)</span>
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

            <!-- Form Balasan Siswa -->
            <form
              method="POST"
              action="?/replyReport"
              use:enhance={() => {
                isReplying = true;
                return async ({ update }) => {
                  await update();
                  isReplying = false;
                  replyContent = '';
                };
              }}
              class="pt-3 border-t border-border-subtle space-y-3"
            >
              <input type="hidden" name="secretCode" value={secretCodeInput} />
              <label for="student-reply" class="block text-xs font-bold text-tx-primary uppercase tracking-wider">
                Kirim Pesan Klarifikasi / Tanggapan Lanjutan
              </label>
              <textarea
                id="student-reply"
                name="content"
                rows="3"
                placeholder="Tulis pesan tambahan jika ingin memberikan keterangan lebih lanjut ke admin OSIS..."
                bind:value={replyContent}
                required
                class="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
              ></textarea>

              <div class="flex items-center justify-between">
                <span class="text-[11px] text-tx-secondary">Balasanmu tetap terkirim secara anonim.</span>
                <button
                  type="submit"
                  disabled={isReplying || replyContent.trim().length < 5}
                  class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-blue-hover disabled:opacity-50 transition-colors shadow-xs"
                >
                  {#if isReplying}
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
      {/if}
    </div>

  <!-- ==================== TAB 3: ASPIRASI PUBLIK TERVERIFIKASI ==================== -->
  {:else if activeTab === 'publik'}
    <div class="space-y-6">
      <div class="border-b border-border-subtle pb-3">
        <h2 class="text-lg sm:text-xl font-bold text-tx-primary">Aspirasi Publik Terverifikasi</h2>
        <p class="text-xs text-tx-secondary mt-0.5">
          Daftar aspirasi umum yang telah disetujui untuk ditampilkan secara terbuka bersama tindak lanjut pihak sekolah.
        </p>
      </div>

      <!-- Filter Bar -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
          {#each [{ id: 'all', label: 'Semua Kategori' }, { id: 'fasilitas', label: 'Fasilitas' }, { id: 'saran', label: 'Saran' }, { id: 'osis', label: 'Program OSIS' }, { id: 'kritik', label: 'Kritik' }] as cat}
            <button
              type="button"
              onclick={() => (publicCategoryFilter = cat.id)}
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors {publicCategoryFilter === cat.id ? 'bg-brand-blue text-white shadow-xs' : 'bg-white border border-slate-200 text-tx-secondary hover:text-tx-primary hover:bg-slate-50'}"
            >
              {cat.label}
            </button>
          {/each}
        </div>

        <div class="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Cari aspirasi publik..."
            bind:value={publicSearchQuery}
            class="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue shadow-2xs"
          />
          <Search class="w-3.5 h-3.5 text-tx-secondary absolute left-3 top-2.5" />
        </div>
      </div>

      <!-- Grid Kartu Aspirasi -->
      {#if filteredPublicReports().length === 0}
        <div class="p-12 text-center rounded-3xl bg-white border border-border-subtle shadow-soft space-y-2">
          <Filter class="w-8 h-8 mx-auto text-tx-secondary" />
          <h3 class="text-sm font-bold text-tx-primary">Tidak Ada Aspirasi Publik yang Cocok</h3>
          <p class="text-xs text-tx-secondary">Coba ubah kata kunci atau pilih kategori lain.</p>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          {#each filteredPublicReports() as report}
            <div class="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft hover:shadow-card hover:border-blue-200 transition-all flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <div class="flex items-center justify-between gap-2">
                  <Badge status={report.category} type="category" />
                  <Badge status={report.handling_status} type="handling" />
                </div>
                <h3 class="text-base font-bold text-tx-primary leading-snug">
                  {report.title}
                </h3>
                <p class="text-xs sm:text-sm text-tx-secondary leading-relaxed line-clamp-3">
                  {report.content}
                </p>
              </div>

              {#if report.messages && report.messages.length > 0}
                <div class="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1">
                  <div class="flex items-center gap-1.5 text-xs font-bold text-brand-blue">
                    <Shield class="w-3.5 h-3.5" />
                    <span>Tindak Lanjut OSIS:</span>
                  </div>
                  <p class="text-xs text-tx-primary leading-relaxed line-clamp-2">
                    {report.messages[report.messages.length - 1].content}
                  </p>
                </div>
              {/if}

              <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-tx-secondary">
                <span class="font-mono text-[11px] font-bold text-brand-blue">{report.public_reference}</span>
                <span>{new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

  <!-- ==================== TAB 4: PANDUAN & BANTUAN ==================== -->
  {:else if activeTab === 'panduan'}
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="border-b border-border-subtle pb-3">
        <h2 class="text-lg sm:text-xl font-bold text-tx-primary">Panduan Privasi & Saluran Bantuan</h2>
        <p class="text-xs text-tx-secondary mt-0.5">
          Ketahui bagaimana kerahasiaanmu dilindungi serta kontak saluran darurat sekolah jika dalam situasi mendesak.
        </p>
      </div>

      <!-- Banner Lisensi Sekbid 3 IT -->
      <div class="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-blue-50/90 via-white to-blue-50/60 border border-blue-200 shadow-soft space-y-3">
        <div class="flex items-center gap-2 text-brand-blue">
          <Code2 class="w-5 h-5" />
          <h3 class="text-sm font-bold text-brand-blue-dark">Lisensi & Dedikasi Sekbid 3 IT</h3>
        </div>
        <p class="text-xs text-slate-700 leading-relaxed font-normal">
          Platform Kotak Aspirasi Digital Siswa ini dibangun dan dikelola sepenuhnya oleh <strong>Seksi Bidang 3 (Teknologi & Informasi) OSIS SMK Bagimu Negeriku</strong> di bawah lisensi terbuka (MIT License). Platform ini dibuat secara independen tanpa pelacak identitas atau komersialisasi data demi kepentingan seluruh siswa.
        </p>
      </div>

      <!-- Darurat Sekolah & Hotline -->
      <div class="p-6 sm:p-7 rounded-3xl bg-white border-2 border-red-200 shadow-soft space-y-4">
        <div class="flex items-center gap-2 text-danger">
          <AlertTriangle class="w-5 h-5" />
          <h3 class="text-sm font-bold">Jalur Bantuan Mendesak & Bimbingan Konseling (BK)</h3>
        </div>
        <p class="text-xs text-tx-secondary leading-relaxed">
          Kotak Aspirasi bukan saluran darurat 24 jam. Jika kamu atau temanmu sedang menghadapi ancaman fisik langsung atau perundungan berat yang membutuhkan bantuan saat ini juga, segera hubungi:
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-1">
            <span class="text-xs font-bold text-tx-primary block">Guru Bimbingan Konseling</span>
            <p class="text-[11px] text-tx-secondary">Ruang BK SMK Bagimu Negeriku</p>
            <span class="font-mono text-xs font-bold text-brand-blue block pt-0.5">WA: 0812-3456-7890</span>
          </div>
          <div class="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-1">
            <span class="text-xs font-bold text-tx-primary block">Pembina OSIS Sekolah</span>
            <p class="text-[11px] text-tx-secondary">Bidang Kesiswaan & Ketertiban</p>
            <span class="font-mono text-xs font-bold text-brand-blue block pt-0.5">WA: 0821-9876-5432</span>
          </div>
          <div class="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-1">
            <span class="text-xs font-bold text-tx-primary block">SAPA 129 (KemenPPPA)</span>
            <p class="text-[11px] text-tx-secondary">Hotline Bebas Pulsa: 129</p>
            <span class="font-mono text-xs font-bold text-brand-blue block pt-0.5">WA: 08111-129-129</span>
          </div>
          <div class="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-1">
            <span class="text-xs font-bold text-tx-primary block">Layanan Pengaduan KPAI</span>
            <p class="text-[11px] text-tx-secondary">Komisi Perlindungan Anak</p>
            <span class="font-mono text-xs font-bold text-brand-blue block pt-0.5">WA: 08111-772-273</span>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
