import { getCaPublicCertFilePath, getCaRsaFilePath } from '$lib/server/ca.openssl';
import { generateServer } from '$lib/server/server.openssl';
import {
	collectRootCas,
	isValidNumberGreaterZero,
	isValidString,
	serversDir
} from '$lib/server/utils';
import { fail, redirect } from '@sveltejs/kit';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { paramCase } from 'param-case';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const rootCas = await collectRootCas();
	return {
		rootCas
	};
}) satisfies PageServerLoad;

function toStringArray(value: unknown): string[] {
	if (typeof value !== 'string' || value.trim() === '') {
		return [];
	}
	return value.split(',').map((s) => s.trim());
}

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.isAuthenticated) {
			return fail(401);
		}
		const data = await request.formData();

		const name = data.get('name');
		if (!isValidString(name)) {
			return fail(400, { name, invalid: true });
		}
		if (existsSync(resolve(serversDir, name))) {
			return fail(400, { name, conflict: true });
		}
		const root_ca = data.get('root_ca');
		if (!isValidString(root_ca)) {
			return fail(400, { root_ca, invalid: true });
		}
		const caPublicCertFilePath = getCaPublicCertFilePath(root_ca);
		const caKeyFilePath = getCaRsaFilePath(root_ca);
		if (!existsSync(caKeyFilePath) || !existsSync(caPublicCertFilePath)) {
			return fail(400, { root_ca, unknown: true });
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
		const dnsNames = toStringArray(data.get('dns_names'));
		const ips = toStringArray(data.get('ip_addresses'));

		await generateServer({
			name: paramCase(name),
			passphrase,
			dnsNames,
			ips,
			caPublicCertFilePath,
			caKeyFilePath,
			cn,
			days
		});
		throw redirect(303, '/');
	}
} satisfies Actions;
