import type { PageServerLoad } from './$types';
import { getAuditLogs } from '#lib/server/db';

export const load: PageServerLoad = async () => {
  const logs = await getAuditLogs();
  return { logs };
};
