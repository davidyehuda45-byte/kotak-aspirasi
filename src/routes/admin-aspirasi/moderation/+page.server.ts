import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getReports, updatePublicationStatus } from '#lib/server/db';
import type { PublicationStatus } from '#lib/types';

export const load: PageServerLoad = async () => {
  const allReports = await getReports({ visibility: 'public' });
  const pendingReports = allReports.filter((r) => r.publication_status === 'pending');
  const moderatedReports = allReports.filter((r) => r.publication_status !== 'pending');

  return {
    pendingReports,
    moderatedReports
  };
};

export const actions: Actions = {
  moderate: async ({ request }) => {
    const data = await request.formData();
    const reportId = data.get('reportId') as string;
    const newStatus = data.get('status') as PublicationStatus;

    if (!reportId || !newStatus) {
      return fail(400, { error: 'Parameter moderasi tidak lengkap.' });
    }

    try {
      await updatePublicationStatus(reportId, newStatus, 'Admin OSIS Sekbid 3 IT');
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memproses moderasi.';
      return fail(400, { error: msg });
    }
  }
};
