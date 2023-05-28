import { isCorrectPassword, login } from '$lib/server/auth';
import { collectRootCas, serversDir } from '$lib/server/utils';
import { fail, redirect } from '@sveltejs/kit';
import { readdir } from 'node:fs/promises';
import type { Actions, PageServerLoad } from './$types';

async function collectServers(): Promise<
	Array<{ name: string; certificate_url: string; key_url: string }>
> {
	const list = await readdir(serversDir);
	return list.map((name) => ({
		name,
		certificate_url: `/download/servers/${name}/cert.pem`,
		key_url: `/download/servers/${name}/cert-key.pem`
	}));
}

export const load = (async ({ locals: { isAuthenticated } }) => {
	const rootCas = await collectRootCas();
	return {
		rootCas,
		servers: isAuthenticated ? await collectServers() : undefined,
		isAuthenticated
	};
}) satisfies PageServerLoad;

export const actions = {
	login: async ({ request, cookies, locals }) => {
		const data = await request.formData();

		const password = data.get('password');

		if (await isCorrectPassword(password)) {
			login(cookies, locals);
			throw redirect(303, '/');
		}

		return fail(400, { invalid: true });
	}
} satisfies Actions;
