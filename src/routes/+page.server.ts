import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
  getApprovedPublicReports,
  getDashboardStats,
  createReport,
  getReportBySecretToken,
  addMessage
} from '#lib/server/db';
import { checkRateLimit, validateHoneypot } from '#lib/server/security';
import type { ReportCategory, ReportVisibility } from '#lib/types';

export const load: PageServerLoad = async ({ url }) => {
  const codeParam = url.searchParams.get('kode');
  const [publicReports, stats] = await Promise.all([
    getApprovedPublicReports('all'),
    getDashboardStats()
  ]);

  let trackedReport = null;
  if (codeParam && codeParam.trim().length >= 6) {
    trackedReport = await getReportBySecretToken(codeParam.trim());
  }

  return {
    publicReports,
    stats,
    trackedReport,
    initialCode: codeParam ? codeParam.trim() : ''
  };
};

export const actions: Actions = {
  submitReport: async ({ request, getClientAddress }) => {
    let clientIp = '127.0.0.1';
    try {
      clientIp = getClientAddress();
    } catch {
      clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
    }

    const data = await request.formData();

    // 1. Validasi Honeypot Anti-Spam
    const honeypot = data.get('hp_confirm_identity');
    if (!validateHoneypot(honeypot)) {
      return fail(400, {
        submitError: 'Permintaan tidak valid terdeteksi sistem keamanan.',
        formType: 'submit'
      });
    }

    // 2. Proteksi Rate Limiting IP
    const rateCheck = checkRateLimit(clientIp);
    if (!rateCheck.allowed) {
      return fail(429, {
        submitError: `Batas pengiriman terlampaui. Mohon tunggu ${rateCheck.retryAfterSeconds} detik sebelum mengirim kembali demi menjaga ketertiban sistem.`,
        formType: 'submit'
      });
    }

    const title = (data.get('title') as string) || '';
    const category = (data.get('category') as ReportCategory) || 'saran';
    const content = (data.get('content') as string) || '';
    const visibility = (data.get('visibility') as ReportVisibility) || 'public';
    const agreement = data.get('agreement');

    if (!title || title.trim().length < 5 || title.trim().length > 120) {
      return fail(400, {
        submitError: 'Judul aspirasi wajib diisi antara 5 hingga 120 karakter.',
        formType: 'submit',
        values: { title, category, content, visibility }
      });
    }

    if (!content || content.trim().length < 20 || content.trim().length > 5000) {
      return fail(400, {
        submitError: 'Isi aspirasi wajib diisi minimal 20 karakter dan maksimal 5.000 karakter.',
        formType: 'submit',
        values: { title, category, content, visibility }
      });
    }

    const validCategories: ReportCategory[] = [
      'kritik',
      'saran',
      'osis',
      'fasilitas',
      'bullying',
      'kekerasan',
      'masalah_pribadi',
      'lainnya'
    ];

    if (!validCategories.includes(category)) {
      return fail(400, {
        submitError: 'Kategori yang dipilih tidak valid.',
        formType: 'submit',
        values: { title, category, content, visibility }
      });
    }

    if (!agreement) {
      return fail(400, {
        submitError: 'Anda wajib menyetujui pernyataan integritas dan privasi sebelum mengirim laporan.',
        formType: 'submit',
        values: { title, category, content, visibility }
      });
    }

    // Tangani lampiran opsional
    const attachmentFile = data.get('attachment') as File | null;
    let attachments: { name: string; size_bytes: number; mime_type: string; storage_path: string }[] = [];

    if (attachmentFile && attachmentFile.size > 0) {
      if (attachmentFile.size > 15 * 1024 * 1024) {
        return fail(400, {
          submitError: 'Ukuran lampiran melebihi batas 15MB.',
          formType: 'submit',
          values: { title, category, content, visibility }
        });
      }

      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
      if (!allowedMimes.includes(attachmentFile.type)) {
        return fail(400, {
          submitError: 'Format lampiran hanya mendukung JPEG, PNG, WebP, MP4, atau WebM.',
          formType: 'submit',
          values: { title, category, content, visibility }
        });
      }

      attachments.push({
        name: attachmentFile.name,
        size_bytes: attachmentFile.size,
        mime_type: attachmentFile.type,
        storage_path: `uploads/${Date.now()}-${attachmentFile.name.replace(/[^a-zA-Z0-9._-]/g, '')}`
      });
    }

    try {
      const result = await createReport({
        title,
        category,
        content,
        visibility,
        attachments
      });

      return {
        formType: 'submit',
        submitSuccess: true,
        secretCode: result.secretCode,
        publicReference: result.report.public_reference,
        category: result.report.category,
        visibility: result.report.visibility
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses aspirasi.';
      return fail(500, {
        submitError: msg,
        formType: 'submit',
        values: { title, category, content, visibility }
      });
    }
  },

  lookupReport: async ({ request }) => {
    const data = await request.formData();
    const secretCode = (data.get('secretCode') as string) || '';

    if (!secretCode || secretCode.trim().length < 6) {
      return fail(400, {
        formType: 'lookup',
        lookupError: 'Masukkan kode rahasia yang valid (contoh: KAS-DEMO-0001).'
      });
    }

    const cleanCode = secretCode.trim();
    const report = await getReportBySecretToken(cleanCode);

    if (!report) {
      return fail(404, {
        formType: 'lookup',
        lookupError: 'Kode rahasia tidak ditemukan. Periksa kembali karakter kode rahasiamu.',
        enteredCode: cleanCode
      });
    }

    return {
      formType: 'lookup',
      lookupSuccess: true,
      trackedReport: report,
      enteredCode: cleanCode
    };
  },

  replyReport: async ({ request }) => {
    const data = await request.formData();
    const secretCode = (data.get('secretCode') as string) || '';
    const messageContent = (data.get('content') as string) || '';

    if (!secretCode) {
      return fail(400, { formType: 'reply', replyError: 'Sesi kode rahasia tidak valid.' });
    }

    if (!messageContent || messageContent.trim().length < 5) {
      return fail(400, {
        formType: 'reply',
        replyError: 'Pesan balasan minimal 5 karakter.',
        enteredCode: secretCode
      });
    }

    const report = await getReportBySecretToken(secretCode.trim());
    if (!report) {
      return fail(404, { formType: 'reply', replyError: 'Laporan tidak ditemukan.' });
    }

    try {
      await addMessage({
        report_id: report.id,
        sender_type: 'student',
        sender_name: 'Siswa SMK Bagimu Negeriku',
        content: messageContent.trim()
      });

      const updatedReport = await getReportBySecretToken(secretCode.trim());

      return {
        formType: 'reply',
        replySuccess: true,
        trackedReport: updatedReport,
        enteredCode: secretCode.trim()
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengirim pesan tindak lanjut.';
      return fail(500, { formType: 'reply', replyError: msg, enteredCode: secretCode });
    }
  }
};
