import { generateCa } from '$lib/server/ca.openssl';
import { isValidNumberGreaterZero, isValidString, rootCasDir } from '$lib/server/utils';
import { fail, redirect } from '@sveltejs/kit';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { paramCase } from 'param-case';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.isAuthenticated) {
			return fail(401);
		}
		const data = await request.formData();

		let name = data.get('name');
		if (!isValidString(name)) {
			return fail(400, { name, invalid: true });
		}
		name = paramCase(name);
		if (existsSync(resolve(rootCasDir, name))) {
			return fail(400, { name, conflict: true });
		}
		const passphrase = data.get('passphrase');
		if (!isValidString(passphrase)) {
			return fail(400, { invalid: true });
		}
		const cn = data.get('cn');
		if (!isValidString(cn)) {
			return fail(400, { cn, invalid: true });
		}
		const days = Number.parseInt(`${data.get('days')}`, 10);
		if (!isValidNumberGreaterZero(days)) {
			return fail(400, { days, invalid: true });
		}

		await generateCa({
			name,
			passphrase,
			cn,
			days
		});
		throw redirect(303, '/');
	}
} satisfies Actions;
