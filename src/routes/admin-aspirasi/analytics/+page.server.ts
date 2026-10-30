import type { PageServerLoad } from './$types';
import { getReports, getDashboardStats } from '#lib/server/db';
import type { ReportCategory } from '#lib/types';

export const load: PageServerLoad = async () => {
  const [reports, stats] = await Promise.all([
    getReports(),
    getDashboardStats()
  ]);

  const categoryCount: Record<ReportCategory, number> = {
    kritik: 0,
    saran: 0,
    osis: 0,
    fasilitas: 0,
    bullying: 0,
    kekerasan: 0,
    masalah_pribadi: 0,
    lainnya: 0
  };

  reports.forEach((r) => {
    if (r.category in categoryCount) {
      categoryCount[r.category]++;
    }
  });

  const total = reports.length || 1;
  const resolutionRate = Math.round((stats.resolvedReports / total) * 100);

  return {
    stats,
    totalReports: reports.length,
    resolutionRate,
    categoryCount
  };
};
