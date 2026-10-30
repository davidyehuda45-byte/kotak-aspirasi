import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  // Biarkan route /admin-aspirasi/login tetap dapat diakses
  if (url.pathname === '/admin-aspirasi/login') {
    return { isAuthenticated: false };
  }

  const session = cookies.get('admin_session');
  if (session !== 'authenticated_admin') {
    throw redirect(303, '/admin-aspirasi/login');
  }

  return {
    isAuthenticated: true,
    adminName: 'Pengurus OSIS Sekbid 3 IT'
  };
};
