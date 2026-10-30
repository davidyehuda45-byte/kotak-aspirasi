-- Skema Database Kotak Aspirasi Siswa
-- PostgreSQL / Supabase Migration

-- 1. Ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tipe Enum
CREATE TYPE report_category AS ENUM (
  'kritik',
  'saran',
  'osis',
  'fasilitas',
  'bullying',
  'kekerasan',
  'masalah_pribadi',
  'lainnya'
);

CREATE TYPE report_visibility AS ENUM (
  'public',
  'private'
);

CREATE TYPE publication_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'hidden'
);

CREATE TYPE handling_status AS ENUM (
  'new',
  'reviewing',
  'in_progress',
  'awaiting_response',
  'resolved'
);

CREATE TYPE message_sender_type AS ENUM (
  'student',
  'admin'
);

-- 3. Tabel Laporan (Reports)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_reference VARCHAR(16) NOT NULL UNIQUE,
  title VARCHAR(120) NOT NULL,
  category report_category NOT NULL,
  content TEXT NOT NULL,
  visibility report_visibility NOT NULL DEFAULT 'private',
  publication_status publication_status NOT NULL DEFAULT 'hidden',
  handling_status handling_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_category ON reports(category);
CREATE INDEX idx_reports_visibility ON reports(visibility);
CREATE INDEX idx_reports_publication ON reports(publication_status);
CREATE INDEX idx_reports_handling ON reports(handling_status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

-- 4. Tabel Akses Token Rahasia (Report Access)
-- Menyimpan hash SHA-256 dari kode rahasia siswa (tidak pernah plain text)
CREATE TABLE IF NOT EXISTS report_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  token_hash VARCHAR(128) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_report_access_hash ON report_access(token_hash);
CREATE INDEX idx_report_access_report_id ON report_access(report_id);

-- 5. Tabel Pesan Dua Arah (Messages)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  sender_type message_sender_type NOT NULL,
  sender_name VARCHAR(64),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_report_id ON messages(report_id);
CREATE INDEX idx_messages_created_at ON messages(created_at ASC);

-- 6. Tabel Lampiran (Attachments)
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attachments_report_id ON attachments(report_id);

-- 7. Tabel Profil Admin (Admin Profiles)
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(100) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Tabel Audit Log (Audit Logs)
-- DILARANG menyimpan isi teks pesan atau kode rahasia di audit log
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_name VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_id VARCHAR(100) NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
