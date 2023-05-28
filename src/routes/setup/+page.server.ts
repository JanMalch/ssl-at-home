import { isPasswordSet, setPassword } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	if (await isPasswordSet()) {
		throw redirect(303, '/quickstart');
	}
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const password = data.get('password');
		const passwordRepeat = data.get('password_repeat');

		if (typeof password !== 'string' || password.trim().length === 0) {
			return fail(400, { invalid: true });
		}
		if (typeof passwordRepeat !== 'string' || passwordRepeat.trim().length === 0) {
			return fail(400, { invalid: true });
		}
		if (password !== passwordRepeat) {
			return fail(400, { mismatch: true });
		}

		await setPassword(password.trim());
		throw redirect(303, '/quickstart');
	}
} satisfies Actions;
