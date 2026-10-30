import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getReports } from '#lib/server/db';
import type { Report } from '#lib/types';

function sanitizeCsvCell(text: string | number | null | undefined): string {
  if (text === null || text === undefined) return '""';
  let str = String(text).replace(/\r\n/g, ' ').replace(/\n/g, ' ').replace(/\r/g, ' ');
  // Mencegah CSV Formula Injection di Microsoft Excel
  if (/^[=+@-]/i.test(str)) {
    str = `'` + str;
  }
  // Escape quote ganda
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

export const GET: RequestHandler = async ({ cookies, url }) => {
  // Verifikasi sesi admin
  const session = cookies.get('admin_session');
  if (!session) {
    throw error(401, 'Akses tidak diizinkan. Sesi admin diperlukan.');
  }

  const category = url.searchParams.get('category') || undefined;
  const status = url.searchParams.get('status') || undefined;
  const visibility = url.searchParams.get('visibility') || undefined;
  const period = url.searchParams.get('period') || 'all';

  let reports: Report[] = await getReports({
    category: category !== 'all' ? category : undefined,
    handling_status: status !== 'all' ? status : undefined,
    visibility: visibility !== 'all' ? visibility : undefined
  });

  // Filter berdasarkan periode
  const now = Date.now();
  if (period === '7d') {
    const cutoff = now - 7 * 86400000;
    reports = reports.filter((r: Report) => new Date(r.created_at).getTime() >= cutoff);
  } else if (period === '30d') {
    const cutoff = now - 30 * 86400000;
    reports = reports.filter((r: Report) => new Date(r.created_at).getTime() >= cutoff);
  }

  // Header CSV
  const headers = [
    'No Referensi',
    'Tanggal Masuk',
    'Kategori',
    'Visibilitas',
    'Judul Aspirasi',
    'Status Penanganan',
    'Status Publikasi',
    'Jumlah Balasan OSIS',
    'Jumlah Lampiran'
  ];

  const categoryMap: Record<string, string> = {
    kritik: 'Kritik',
    saran: 'Saran',
    osis: 'Program OSIS',
    fasilitas: 'Fasilitas',
    bullying: 'Bullying (Privat)',
    kekerasan: 'Kekerasan (Privat)',
    masalah_pribadi: 'Masalah Pribadi (Privat)',
    lainnya: 'Lainnya'
  };

  const statusMap: Record<string, string> = {
    new: 'Baru',
    reviewing: 'Ditinjau',
    in_progress: 'Diproses',
    awaiting_response: 'Menunggu Siswa',
    resolved: 'Selesai'
  };

  const rows: string[][] = reports.map((r: Report) => [
    sanitizeCsvCell(r.public_reference),
    sanitizeCsvCell(new Date(r.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })),
    sanitizeCsvCell(categoryMap[r.category] || r.category),
    sanitizeCsvCell(r.visibility === 'private' ? 'Privat (Rahasia)' : 'Publik'),
    sanitizeCsvCell(r.title),
    sanitizeCsvCell(statusMap[r.handling_status] || r.handling_status),
    sanitizeCsvCell(r.publication_status),
    sanitizeCsvCell(r.messages?.length || 0),
    sanitizeCsvCell(r.attachments?.length || 0)
  ]);

  const csvContent = [headers.map((h: string) => `"${h}"`).join(','), ...rows.map((row: string[]) => row.join(','))].join('\r\n');

  // Menggunakan UTF-8 BOM agar Microsoft Excel di Windows dapat membaca aksen dan huruf dengan benar
  const bom = '\uFEFF';
  const timestamp = new Date().toISOString().slice(0, 10);

  return new Response(bom + csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="rekap-aspirasi-smk-bagimunegeriku-${timestamp}.csv"`
    }
  });
};
