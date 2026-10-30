import type {
  Report,
  ReportMessage,
  ReportAccess,
  AuditLog,
  DashboardStats,
  HandlingStatus,
  PublicationStatus,
  ReportCategory,
  ReportVisibility
} from '#lib/types';
import { generateSecretCode, generatePublicReference, hashSecretToken, verifySecretToken } from './crypto';

// Deteksi konfigurasi Supabase
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

// Data in-memory awal yang realistis untuk pengujian lokal & fallback
let memoryReports: Report[] = [
  {
    id: 'rep-001',
    public_reference: 'ASP-7492',
    title: 'Penambahan stopkontak dan kipas di laboratorium komputer 2',
    category: 'fasilitas',
    content: 'Saat praktikum jaringan, banyak laptop siswa kehabisan baterai karena hanya ada 4 stopkontak aktif di bagian depan. Suhu ruangan juga sering terlalu gerah saat jam siang. Mohon pertimbangan penambahan colokan dan servis kipas angin.',
    visibility: 'public',
    publication_status: 'approved',
    handling_status: 'in_progress',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    messages: [
      {
        id: 'msg-001',
        report_id: 'rep-001',
        sender_type: 'admin',
        sender_name: 'Pengurus OSIS',
        content: 'Terima kasih atas aspirasinya. Kami sudah meneruskan usulan ini ke Bagian Sarana dan Prasarana sekolah. Rencana perbaikan stopkontak dijadwalkan akhir pekan ini.',
        created_at: new Date(Date.now() - 2 * 86400000).toISOString()
      }
    ]
  },
  {
    id: 'rep-002',
    public_reference: 'ASP-8813',
    title: 'Usulan durasi istirahat kedua diperpanjang 10 menit untuk ibadah Dzuhur',
    category: 'saran',
    content: 'Waktu istirahat kedua saat ini 25 menit. Dengan antrean wudhu musala yang panjang, banyak siswa terburu-buru makan siang. Jika bisa diperpanjang 10 menit akan sangat membantu.',
    visibility: 'public',
    publication_status: 'approved',
    handling_status: 'reviewing',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    messages: [
      {
        id: 'msg-002',
        report_id: 'rep-002',
        sender_type: 'admin',
        sender_name: 'Pengurus OSIS',
        content: 'Usulan sedang dikompilasi oleh tim divisi Advokasi OSIS untuk dibahas dalam rapat koordinasi bulanan bersama Wakasek Kesiswaan.',
        created_at: new Date(Date.now() - 2 * 86400000).toISOString()
      }
    ]
  },
  {
    id: 'rep-003',
    public_reference: 'ASP-2940',
    title: 'Kantin sekolah perlu sistem nomor antrean pada stan makanan berat',
    category: 'saran',
    content: 'Di stan nasi goreng dan bakso sering terjadi saling serobot saat istirahat pertama karena tidak ada batas antrean yang teratur. Mohon bantuan OSIS berkoordinasi dengan pengelola kantin.',
    visibility: 'public',
    publication_status: 'pending',
    handling_status: 'new',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    messages: []
  },
  {
    id: 'rep-004',
    public_reference: 'ASP-9011',
    title: 'Laporan intimidasi verbal dan pemalakan di koridor belakang lapangan basket',
    category: 'bullying',
    content: 'Ada sekelompok oknum kelas 12 yang sering menghentikan adik kelas yang lewat koridor belakang saat pulang sekolah dan meminta uang paksa secara verbal. Tolong dijaga oleh satpam atau guru piket saat jam bubar sekolah.',
    visibility: 'private',
    publication_status: 'rejected',
    handling_status: 'in_progress',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    messages: [
      {
        id: 'msg-003',
        report_id: 'rep-004',
        sender_type: 'admin',
        sender_name: 'Tim Konseling & OSIS',
        content: 'Laporan ini telah kami koordinasikan secara tertutup dengan Guru BK dan petugas keamanan sekolah. Mulai hari ini koridor tersebut dijaga oleh guru piket. Identitas pelapor tetap terlindungi dan aman.',
        created_at: new Date(Date.now() - 12 * 3600000).toISOString()
      }
    ]
  }
];

// Token rahasia mock untuk rep-001 s.d rep-004
// Contoh kode token demo:
// rep-001 -> KAS-DEMO-0001
// rep-004 -> KAS-DEMO-0004
let memoryAccessTokens: ReportAccess[] = [
  {
    report_id: 'rep-001',
    token_hash: hashSecretToken('KAS-DEMO-0001'),
    created_at: new Date().toISOString()
  },
  {
    report_id: 'rep-002',
    token_hash: hashSecretToken('KAS-DEMO-0002'),
    created_at: new Date().toISOString()
  },
  {
    report_id: 'rep-003',
    token_hash: hashSecretToken('KAS-DEMO-0003'),
    created_at: new Date().toISOString()
  },
  {
    report_id: 'rep-004',
    token_hash: hashSecretToken('KAS-DEMO-0004'),
    created_at: new Date().toISOString()
  }
];

let memoryAuditLogs: AuditLog[] = [
  {
    id: 'log-001',
    actor_name: 'Admin OSIS (Sistem)',
    action: 'Inisialisasi sistem kotak aspirasi',
    target_id: 'SYSTEM',
    details: 'Sistem diaktifkan dengan perlindungan privasi ketat',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'log-002',
    actor_name: 'Admin OSIS',
    action: 'Update Status Laporan',
    target_id: 'rep-001',
    details: 'Status diubah ke in_progress',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'log-003',
    actor_name: 'Admin OSIS',
    action: 'Kirim Balasan Tanggapan',
    target_id: 'rep-004',
    details: 'Balasan tindak lanjut protektif dikirim ke saluran privat',
    created_at: new Date(Date.now() - 12 * 3600000).toISOString()
  }
];

export async function getReports(filters?: {
  category?: string;
  handling_status?: string;
  visibility?: string;
  search?: string;
}): Promise<Report[]> {
  let list = [...memoryReports];

  if (filters?.category && filters.category !== 'all') {
    list = list.filter((r) => r.category === filters.category);
  }
  if (filters?.handling_status && filters.handling_status !== 'all') {
    list = list.filter((r) => r.handling_status === filters.handling_status);
  }
  if (filters?.visibility && filters.visibility !== 'all') {
    list = list.filter((r) => r.visibility === filters.visibility);
  }
  if (filters?.search && filters.search.trim().length > 0) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q) ||
        r.public_reference.toLowerCase().includes(q)
    );
  }

  // Urutkan dari yang terbaru
  return list.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getReportById(id: string): Promise<Report | null> {
  const rep = memoryReports.find((r) => r.id === id);
  return rep ? { ...rep } : null;
}

export async function getReportBySecretToken(token: string): Promise<Report | null> {
  const trimmed = token.trim();
  const foundAccess = memoryAccessTokens.find((a) =>
    verifySecretToken(trimmed, a.token_hash)
  );

  if (!foundAccess) {
    return null;
  }

  const rep = memoryReports.find((r) => r.id === foundAccess.report_id);
  return rep ? { ...rep } : null;
}

export async function getApprovedPublicReports(category?: string): Promise<Report[]> {
  let list = memoryReports.filter(
    (r) => r.visibility === 'public' && r.publication_status === 'approved'
  );

  if (category && category !== 'all') {
    list = list.filter((r) => r.category === category);
  }

  return list.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function createReport(params: {
  title: string;
  category: ReportCategory;
  content: string;
  visibility: ReportVisibility;
  attachments?: { name: string; size_bytes: number; mime_type: string; storage_path: string }[];
}): Promise<{ report: Report; secretCode: string }> {
  const secretCode = generateSecretCode();
  const tokenHash = hashSecretToken(secretCode);
  const publicRef = generatePublicReference();
  const id = `rep-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  // Kategori sensitif wajib terkunci ke visibilitas privat dan publication_status rejected
  const isSensitive = ['bullying', 'kekerasan', 'masalah_pribadi'].includes(params.category);
  const finalVisibility: ReportVisibility = isSensitive ? 'private' : params.visibility;
  const initialPublication: PublicationStatus = isSensitive
    ? 'rejected'
    : finalVisibility === 'public'
    ? 'pending'
    : 'hidden';

  const newReport: Report = {
    id,
    public_reference: publicRef,
    title: params.title.trim(),
    category: params.category,
    content: params.content.trim(),
    visibility: finalVisibility,
    publication_status: initialPublication,
    handling_status: 'new',
    created_at: now,
    updated_at: now,
    messages: [],
    attachments: params.attachments?.map((att, idx) => ({
      id: `att-${id}-${idx}`,
      report_id: id,
      name: att.name,
      storage_path: att.storage_path,
      mime_type: att.mime_type,
      size_bytes: att.size_bytes,
      created_at: now
    })) || []
  };

  memoryReports.unshift(newReport);
  memoryAccessTokens.push({
    report_id: id,
    token_hash: tokenHash,
    created_at: now
  });

  memoryAuditLogs.unshift({
    id: `log-${Date.now()}`,
    actor_name: 'Sistem Anonim Siswa',
    action: 'Pengiriman Laporan Baru',
    target_id: id,
    details: `Kategori: ${params.category}, Visibilitas: ${finalVisibility}`,
    created_at: now
  });

  return {
    report: newReport,
    secretCode
  };
}

export async function addMessage(params: {
  report_id: string;
  sender_type: 'student' | 'admin';
  sender_name?: string;
  content: string;
}): Promise<ReportMessage> {
  const report = memoryReports.find((r) => r.id === params.report_id);
  if (!report) {
    throw new Error('Laporan tidak ditemukan');
  }

  const now = new Date().toISOString();
  const newMsg: ReportMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    report_id: params.report_id,
    sender_type: params.sender_type,
    sender_name: params.sender_name || (params.sender_type === 'admin' ? 'Pengurus OSIS' : 'Siswa'),
    content: params.content.trim(),
    created_at: now
  };

  if (!report.messages) {
    report.messages = [];
  }
  report.messages.push(newMsg);
  report.updated_at = now;

  // Jika admin membalas, handling_status dapat disesuaikan otomatis jika masih 'new'
  if (params.sender_type === 'admin' && report.handling_status === 'new') {
    report.handling_status = 'reviewing';
  } else if (params.sender_type === 'student' && report.handling_status === 'awaiting_response') {
    report.handling_status = 'in_progress';
  }

  memoryAuditLogs.unshift({
    id: `log-${Date.now()}`,
    actor_name: params.sender_type === 'admin' ? (params.sender_name || 'Admin OSIS') : 'Pelapor Anonim',
    action: 'Kirim Pesan',
    target_id: params.report_id,
    details: `Pesan dikirim oleh ${params.sender_type}`,
    created_at: now
  });

  return newMsg;
}

export async function updateHandlingStatus(
  reportId: string,
  newStatus: HandlingStatus,
  actorName: string
): Promise<Report> {
  const report = memoryReports.find((r) => r.id === reportId);
  if (!report) {
    throw new Error('Laporan tidak ditemukan');
  }

  const oldStatus = report.handling_status;
  report.handling_status = newStatus;
  report.updated_at = new Date().toISOString();

  memoryAuditLogs.unshift({
    id: `log-${Date.now()}`,
    actor_name: actorName,
    action: 'Perubahan Status Penanganan',
    target_id: reportId,
    details: `Status diubah dari ${oldStatus} menjadi ${newStatus}`,
    created_at: report.updated_at
  });

  return report;
}

export async function updatePublicationStatus(
  reportId: string,
  newStatus: PublicationStatus,
  actorName: string
): Promise<Report> {
  const report = memoryReports.find((r) => r.id === reportId);
  if (!report) {
    throw new Error('Laporan tidak ditemukan');
  }

  // Guarding ketat: Laporan sensitif tidak boleh dipublikasikan
  const isSensitive = ['bullying', 'kekerasan', 'masalah_pribadi'].includes(report.category);
  if (isSensitive && newStatus === 'approved') {
    throw new Error('Pelanggaran keamanan: Laporan dengan kategori sensitif tidak dapat dipublikasikan ke umum.');
  }

  const oldStatus = report.publication_status;
  report.publication_status = newStatus;
  report.updated_at = new Date().toISOString();

  memoryAuditLogs.unshift({
    id: `log-${Date.now()}`,
    actor_name: actorName,
    action: 'Perubahan Status Moderasi Publik',
    target_id: reportId,
    details: `Status publikasi diubah dari ${oldStatus} menjadi ${newStatus}`,
    created_at: report.updated_at
  });

  return report;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const totalReports = memoryReports.length;
  const newReports = memoryReports.filter((r) => r.handling_status === 'new').length;
  const inProgressReports = memoryReports.filter(
    (r) => r.handling_status === 'in_progress' || r.handling_status === 'reviewing'
  ).length;
  const resolvedReports = memoryReports.filter((r) => r.handling_status === 'resolved').length;
  const pendingModeration = memoryReports.filter(
    (r) => r.visibility === 'public' && r.publication_status === 'pending'
  ).length;
  const privateReports = memoryReports.filter((r) => r.visibility === 'private').length;
  const publicApprovedReports = memoryReports.filter(
    (r) => r.visibility === 'public' && r.publication_status === 'approved'
  ).length;

  return {
    totalReports,
    newReports,
    inProgressReports,
    resolvedReports,
    pendingModeration,
    privateReports,
    publicApprovedReports
  };
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  return [...memoryAuditLogs].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
