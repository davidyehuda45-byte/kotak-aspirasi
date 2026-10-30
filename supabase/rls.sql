-- Row Level Security (RLS) Policies
-- Kotak Aspirasi Siswa

-- 1. Aktifkan RLS di seluruh tabel
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. Kebijakan untuk Tabel `reports`
-- Publik hanya dapat membaca aspirasi umum yang disetujui (publication_status = 'approved' dan visibility = 'public')
CREATE POLICY "Public read approved reports"
  ON reports
  FOR SELECT
  TO anon, authenticated
  USING (
    visibility = 'public' AND publication_status = 'approved'
  );

-- Admin terautentikasi dapat membaca semua laporan
CREATE POLICY "Admin view all reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid())
  );

-- Admin dapat memperbarui status penanganan dan publikasi
CREATE POLICY "Admin update reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid())
  )
  WITH CHECK (
    -- Menolak publikasi laporan kategori sensitif
    NOT (
      category IN ('bullying', 'kekerasan', 'masalah_pribadi')
      AND publication_status = 'approved'
    )
  );

-- 3. Kebijakan untuk Tabel `report_access`
-- Tabel report_access TIDAK BOLEH dapat dibaca atau dimanipulasi langsung oleh anon.
-- Seluruh verifikasi hash kode rahasia dilakukan via server-side service role atau stored RPC.
CREATE POLICY "Admin access token management"
  ON report_access
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid())
  );

-- 4. Kebijakan untuk Tabel `messages`
-- Publik hanya dapat melihat pesan balasan pada aspirasi umum yang telah disetujui
CREATE POLICY "Public view messages on approved reports"
  ON messages
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM reports
      WHERE reports.id = messages.report_id
        AND reports.visibility = 'public'
        AND reports.publication_status = 'approved'
    )
  );

-- Admin dapat membaca dan mengirim pesan pada semua laporan
CREATE POLICY "Admin full access messages"
  ON messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid())
  );

-- 5. Kebijakan untuk Tabel `attachments`
-- Lampiran privat hanya dapat diakses melalui signed URL server-side atau admin terotorisasi
CREATE POLICY "Admin access attachments"
  ON attachments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid())
  );

-- 6. Kebijakan untuk Tabel `audit_logs`
-- Audit log hanya dapat dibaca oleh admin
CREATE POLICY "Admin read audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE admin_profiles.id = auth.uid())
  );
