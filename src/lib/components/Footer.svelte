<script lang="ts">
  import { Shield, Lock, LifeBuoy, Code2, CheckCircle2 } from 'lucide-svelte';
</script>

<footer class="bg-surface border-t border-border-subtle mt-24 text-tx-secondary text-sm">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
      <!-- Identitas & Lisensi Sekbid 3 IT -->
      <div class="md:col-span-2 space-y-4">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 p-1 rounded-xl bg-slate-50 border border-slate-200/60 shadow-2xs">
            <img src="/logo-smk.png" alt="Logo SMK" class="w-8 h-8 object-contain" />
            <img src="/logo-osis.jpg" alt="Logo OSIS" class="w-7 h-8 object-contain" />
          </div>
          <div>
            <span class="block text-sm font-extrabold text-tx-primary leading-tight">Kotak Aspirasi Digital Siswa</span>
            <span class="block text-xs text-brand-blue font-bold">SMK Bagimu Negeriku</span>
          </div>
        </div>

        <p class="text-xs leading-relaxed max-w-md text-tx-secondary font-normal">
          Platform independen untuk menjembatani komunikasi, evaluasi, dan aspirasi siswa secara beradab dan terpercaya. Beroperasi penuh dengan standar <em>Privacy by Design</em> tanpa registrasi dan tanpa pencatatan data diri siswa.
        </p>

        <!-- Kotak Lisensi Resmi Sekbid 3 IT -->
        <div class="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-slate-50 border border-blue-200/70 text-xs space-y-1.5 shadow-2xs">
          <div class="flex items-center gap-2 font-bold text-brand-blue-dark">
            <Code2 class="w-4 h-4 text-brand-blue" />
            <span>Karya & Inovasi Sekbid 3 IT OSIS</span>
          </div>
          <p class="text-[11px] text-slate-700 leading-relaxed">
            Didevelop dan didedikasikan secara tulus oleh <strong>Seksi Bidang 3 (Teknologi & Informasi) OSIS</strong> untuk seluruh siswa dan kemajuan SMK Bagimu Negeriku.
          </p>
          <div class="flex items-center gap-2 text-[10px] text-slate-500 font-mono pt-1">
            <span class="px-2 py-0.5 rounded bg-white border border-slate-200">MIT Open Source</span>
            <span>·</span>
            <span>Safe by Default</span>
            <span>·</span>
            <span>Tahun Ajaran 2026/2027</span>
          </div>
        </div>
      </div>

      <!-- Informasi Privasi & Keamanan -->
      <div class="space-y-3">
        <h4 class="text-xs font-bold text-tx-primary uppercase tracking-wider">Keamanan & Anonimitas</h4>
        <ul class="space-y-2 text-xs">
          <li class="flex items-center gap-2 text-slate-600 font-medium">
            <CheckCircle2 class="w-3.5 h-3.5 text-brand-blue shrink-0" />
            <span>Tanpa Nama & Email Siswa</span>
          </li>
          <li class="flex items-center gap-2 text-slate-600 font-medium">
            <CheckCircle2 class="w-3.5 h-3.5 text-brand-blue shrink-0" />
            <span>Bullying Terkunci Privat</span>
          </li>
          <li class="flex items-center gap-2 text-slate-600 font-medium">
            <CheckCircle2 class="w-3.5 h-3.5 text-brand-blue shrink-0" />
            <span>Enkripsi Hash SHA-256</span>
          </li>
          <li class="flex items-center gap-2 text-slate-600 font-medium">
            <CheckCircle2 class="w-3.5 h-3.5 text-brand-blue shrink-0" />
            <span>Audit Trail Terlindungi</span>
          </li>
        </ul>
      </div>

      <!-- Bantuan Konseling Sekolah -->
      <div class="space-y-3">
        <h4 class="text-xs font-bold text-tx-primary uppercase tracking-wider">Konseling & Bantuan (BK)</h4>
        <p class="text-xs leading-relaxed text-tx-secondary">
          Bila mengalami ancaman fisik langsung atau masalah mendesak yang membutuhkan pertolongan saat ini juga, silakan hubungi Guru BK di sekolah.
        </p>
        <div class="pt-1 space-y-1">
          <span class="inline-flex items-center gap-1.5 text-xs font-bold text-danger bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
            <LifeBuoy class="w-3.5 h-3.5" />
            <span>Hotline Sahabat Anak: 129</span>
          </span>
          <p class="text-[10px] text-slate-500">KemenPPPA RI / Layanan Bebas Pulsa</p>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-tx-secondary">
      <p>© 2026 SMK Bagimu Negeriku · OSIS Sekbid 3 IT. Seluruh hak cipta dilindungi.</p>
      <div class="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
        <span>Berbudi · Berkualitas · Berdaya · Berhasil</span>
      </div>
    </div>
  </div>
</footer>
