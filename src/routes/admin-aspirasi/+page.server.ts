import type { PageServerLoad } from './$types';
import { getDashboardStats, getReports } from '#lib/server/db';

export const load: PageServerLoad = async () => {
  const [stats, recentReports] = await Promise.all([
    getDashboardStats(),
    getReports()
  ]);

  return {
    stats,
    priorityReports: recentReports.slice(0, 5)
  };
};
