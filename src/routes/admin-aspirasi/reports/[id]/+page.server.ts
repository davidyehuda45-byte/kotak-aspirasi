import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
  getReportById,
  updateHandlingStatus,
  updatePublicationStatus,
  addMessage
} from '#lib/server/db';
import type { HandlingStatus, PublicationStatus } from '#lib/types';

export const load: PageServerLoad = async ({ params }) => {
  const report = await getReportById(params.id);
  if (!report) {
    throw error(404, 'Laporan tidak ditemukan.');
  }

  return { report };
};

export const actions: Actions = {
  updateStatus: async ({ request, params }) => {
    const data = await request.formData();
    const newStatus = data.get('handling_status') as HandlingStatus;

    if (!newStatus) {
      return fail(400, { statusError: 'Status penanganan tidak valid.' });
    }

    try {
      await updateHandlingStatus(params.id, newStatus, 'Admin OSIS Sekbid 3 IT');
      return { successStatus: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengubah status.';
      return fail(500, { statusError: msg });
    }
  },

  updatePublication: async ({ request, params }) => {
    const data = await request.formData();
    const newStatus = data.get('publication_status') as PublicationStatus;

    if (!newStatus) {
      return fail(400, { pubError: 'Status publikasi tidak valid.' });
    }

    try {
      await updatePublicationStatus(params.id, newStatus, 'Admin OSIS Sekbid 3 IT');
      return { successPub: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui publikasi.';
      return fail(400, { pubError: msg });
    }
  },

  reply: async ({ request, params }) => {
    const data = await request.formData();
    const content = (data.get('content') as string) || '';

    if (!content || content.trim().length < 5) {
      return fail(400, { replyError: 'Pesan balasan minimal 5 karakter.' });
    }

    try {
      await addMessage({
        report_id: params.id,
        sender_type: 'admin',
        sender_name: 'Pengurus OSIS (Sekbid 3 IT)',
        content: content.trim()
      });
      return { successReply: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengirim balasan.';
      return fail(500, { replyError: msg });
    }
  }
};
