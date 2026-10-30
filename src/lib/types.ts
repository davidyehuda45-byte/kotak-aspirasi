export type ReportCategory =
  | 'kritik'
  | 'saran'
  | 'osis'
  | 'fasilitas'
  | 'bullying'
  | 'kekerasan'
  | 'masalah_pribadi'
  | 'lainnya';

export type ReportVisibility = 'public' | 'private';

export type PublicationStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

export type HandlingStatus =
  | 'new'
  | 'reviewing'
  | 'in_progress'
  | 'awaiting_response'
  | 'resolved';

export interface Attachment {
  id: string;
  report_id: string;
  name: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
}

export interface ReportMessage {
  id: string;
  report_id: string;
  sender_type: 'student' | 'admin';
  sender_name?: string;
  content: string;
  created_at: string;
}

export interface Report {
  id: string;
  public_reference: string; // Kode publik pendek (misal: ASP-4921)
  title: string;
  category: ReportCategory;
  content: string;
  visibility: ReportVisibility;
  publication_status: PublicationStatus;
  handling_status: HandlingStatus;
  created_at: string;
  updated_at: string;
  messages?: ReportMessage[];
  attachments?: Attachment[];
}

export interface ReportAccess {
  report_id: string;
  token_hash: string;
  created_at: string;
  revoked_at?: string | null;
}

export interface AuditLog {
  id: string;
  actor_name: string;
  action: string;
  target_id: string;
  details?: string;
  created_at: string;
}

export interface DashboardStats {
  totalReports: number;
  newReports: number;
  inProgressReports: number;
  resolvedReports: number;
  pendingModeration: number;
  privateReports: number;
  publicApprovedReports: number;
}
