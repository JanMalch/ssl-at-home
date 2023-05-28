import { isPasswordSet } from '$lib/server/auth';
import { rootCasDir, serversDir } from '$lib/server/utils';
import { redirect } from '@sveltejs/kit';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ url }) => {
	if (url.pathname !== '/setup' && !(await isPasswordSet())) {
		throw redirect(307, '/setup');
	}
	if (!existsSync(rootCasDir) || !existsSync(serversDir)) {
		await mkdir(rootCasDir, { recursive: true });
		await mkdir(serversDir, { recursive: true });
		if (url.pathname !== '/quickstart') {
			throw redirect(307, '/quickstart');
		}
	}
}) satisfies LayoutServerLoad;
