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

// Data in-memory awal (bersih untuk lingkungan produksi)
let memoryReports: Report[] = [];
let memoryAccessTokens: ReportAccess[] = [];
let memoryAuditLogs: AuditLog[] = [
  {
    id: 'log-001',
    actor_name: 'davidyehuda (Sistem)',
    action: 'Inisialisasi sistem kotak aspirasi produksi',
    target_id: 'SYSTEM',
    details: 'Sistem diaktifkan bersih dengan perlindungan privasi penuh',
    created_at: new Date().toISOString()
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
