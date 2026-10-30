import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin_osis';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'osis_amanah_2026';

export const load: PageServerLoad = async ({ cookies }) => {
  const session = cookies.get('admin_session');
  if (session === 'authenticated_admin') {
    throw redirect(303, '/admin-aspirasi');
  }
  return {};
};

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = (data.get('username') as string) || '';
    const password = (data.get('password') as string) || '';

    if (username.trim() === ADMIN_USER && password === ADMIN_PASS) {
      cookies.set('admin_session', 'authenticated_admin', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 12 // 12 jam
      });

      throw redirect(303, '/admin-aspirasi');
    }

    return fail(401, {
      error: 'Username atau password pengurus OSIS salah.',
      username
    });
  },

  logout: async ({ cookies }) => {
    cookies.delete('admin_session', { path: '/' });
    throw redirect(303, '/admin-aspirasi/login');
  }
};
