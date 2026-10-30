import type { PageServerLoad } from './$types';
import { getReports } from '#lib/server/db';

export const load: PageServerLoad = async ({ url }) => {
  const category = url.searchParams.get('category') || 'all';
  const handling_status = url.searchParams.get('status') || 'all';
  const visibility = url.searchParams.get('visibility') || 'all';
  const search = url.searchParams.get('search') || '';
  const period = url.searchParams.get('period') || 'all';

  let reports = await getReports({
    category,
    handling_status,
    visibility,
    search
  });

  if (period === '7d') {
    const cutoff = Date.now() - 7 * 86400000;
    reports = reports.filter((r) => new Date(r.created_at).getTime() >= cutoff);
  } else if (period === '30d') {
    const cutoff = Date.now() - 30 * 86400000;
    reports = reports.filter((r) => new Date(r.created_at).getTime() >= cutoff);
  }

  return {
    reports,
    filters: {
      category,
      handling_status,
      visibility,
      search,
      period
    }
  };
};
