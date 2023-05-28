import { rootCasDir, serversDir } from '$lib/server/utils';
import { fail, redirect } from '@sveltejs/kit';
import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Actions } from './$types';

export const actions = {
	default: async ({ url, locals }) => {
		if (!locals.isAuthenticated) {
			return fail(401);
		}
		const rootCa = url.searchParams.get('root_ca');
		const server = url.searchParams.get('server');
		if (rootCa == null && server == null) {
			return fail(400, { no_instruction: true });
		}
		if (rootCa != null) {
			const dir = resolve(rootCasDir, rootCa);
			if (!existsSync(dir)) {
				return fail(404);
			}
			await rm(dir, { recursive: true });
		}
		if (server != null) {
			const dir = resolve(serversDir, server);
			if (!existsSync(dir)) {
				return fail(404);
			}
			await rm(dir, { recursive: true });
		}
		throw redirect(303, '/');
	}
} satisfies Actions;
