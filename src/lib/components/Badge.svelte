<script lang="ts">
  import type { HandlingStatus, PublicationStatus, ReportCategory } from '#lib/types';

  let {
    status,
    type = 'handling'
  }: {
    status: HandlingStatus | PublicationStatus | ReportCategory | string;
    type?: 'handling' | 'publication' | 'category';
  } = $props();

  const handlingLabels: Record<HandlingStatus, { text: string; bg: string; textCol: string; border: string; dot: string }> = {
    new: { text: 'Baru', bg: 'bg-sky-50/90', textCol: 'text-sky-800', border: 'border-sky-200/80', dot: 'bg-sky-500' },
    reviewing: { text: 'Ditinjau', bg: 'bg-amber-50/90', textCol: 'text-amber-800', border: 'border-amber-200/80', dot: 'bg-amber-500' },
    in_progress: { text: 'Diproses', bg: 'bg-blue-50/90', textCol: 'text-blue-800', border: 'border-blue-200/80', dot: 'bg-blue-600' },
    awaiting_response: { text: 'Menunggu Siswa', bg: 'bg-purple-50/90', textCol: 'text-purple-800', border: 'border-purple-200/80', dot: 'bg-purple-500' },
    resolved: { text: 'Selesai', bg: 'bg-emerald-50/90', textCol: 'text-emerald-800', border: 'border-emerald-200/80', dot: 'bg-emerald-500' }
  };

  const publicationLabels: Record<PublicationStatus, { text: string; bg: string; textCol: string; border: string; dot: string }> = {
    pending: { text: 'Menunggu Moderasi', bg: 'bg-amber-50/90', textCol: 'text-amber-800', border: 'border-amber-200/80', dot: 'bg-amber-500' },
    approved: { text: 'Dipublikasikan', bg: 'bg-blue-50/90', textCol: 'text-blue-800', border: 'border-blue-200/80', dot: 'bg-blue-600' },
    rejected: { text: 'Ditolak Publik', bg: 'bg-rose-50/90', textCol: 'text-rose-800', border: 'border-rose-200/80', dot: 'bg-rose-500' },
    hidden: { text: 'Privat', bg: 'bg-slate-100/90', textCol: 'text-slate-700', border: 'border-slate-200/80', dot: 'bg-slate-400' }
  };

  const categoryLabels: Record<ReportCategory, { text: string; bg: string; textCol: string; border: string; dot: string }> = {
    kritik: { text: 'Kritik', bg: 'bg-orange-50/90', textCol: 'text-orange-800', border: 'border-orange-200/80', dot: 'bg-orange-500' },
    saran: { text: 'Saran', bg: 'bg-cyan-50/90', textCol: 'text-cyan-800', border: 'border-cyan-200/80', dot: 'bg-cyan-500' },
    osis: { text: 'Program OSIS', bg: 'bg-indigo-50/90', textCol: 'text-indigo-800', border: 'border-indigo-200/80', dot: 'bg-indigo-500' },
    fasilitas: { text: 'Fasilitas', bg: 'bg-blue-50/90', textCol: 'text-blue-800', border: 'border-blue-200/80', dot: 'bg-blue-600' },
    bullying: { text: 'Bullying (Privat)', bg: 'bg-red-50/90', textCol: 'text-red-800', border: 'border-red-200/80', dot: 'bg-red-500' },
    kekerasan: { text: 'Kekerasan (Privat)', bg: 'bg-red-50/90', textCol: 'text-red-800', border: 'border-red-200/80', dot: 'bg-red-500' },
    masalah_pribadi: { text: 'Masalah Pribadi', bg: 'bg-rose-50/90', textCol: 'text-rose-800', border: 'border-rose-200/80', dot: 'bg-rose-500' },
    lainnya: { text: 'Lainnya', bg: 'bg-slate-100/90', textCol: 'text-slate-700', border: 'border-slate-200/80', dot: 'bg-slate-400' }
  };

  let config = $derived(() => {
    if (type === 'handling' && status in handlingLabels) {
      return handlingLabels[status as HandlingStatus];
    }
    if (type === 'publication' && status in publicationLabels) {
      return publicationLabels[status as PublicationStatus];
    }
    if (type === 'category' && status in categoryLabels) {
      return categoryLabels[status as ReportCategory];
    }
    return {
      text: String(status),
      bg: 'bg-slate-100',
      textCol: 'text-slate-700',
      border: 'border-slate-200',
      dot: 'bg-slate-400'
    };
  });
</script>

<span
  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border {config().bg} {config().textCol} {config().border} shadow-2xs"
>
  <span class="w-1.5 h-1.5 rounded-full {config().dot} shrink-0"></span>
  <span>{config().text}</span>
</span>
