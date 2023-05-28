import { generateCa } from '$lib/server/ca.openssl';
import { generateServer } from '$lib/server/server.openssl';
import { isValidString } from '$lib/server/utils';
import { fail, redirect } from '@sveltejs/kit';
import { paramCase } from 'param-case';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.isAuthenticated) {
			return fail(401);
		}
		const data = await request.formData();

		const domain = data.get('domain');
		if (!isValidString(domain)) {
			return fail(400, { domain, invalid: true });
		}
		const passphrase = data.get('passphrase');
		if (!isValidString(passphrase)) {
			return fail(400, { invalid: true });
		}

		const days = 36500;
		const name = paramCase(domain);
		const ca = await generateCa({
			name,
			passphrase,
			cn: domain,
			days
		});

		const wildcard = `*.${domain}`;
		await generateServer({
			name: paramCase(name + '-wildcard'),
			passphrase,
			cn: name,
			days,
			dnsNames: [domain, wildcard],
			ips: [],
			caPublicCertFilePath: ca.publicCertFilePath,
			caKeyFilePath: ca.keyFilePath
		});

		throw redirect(303, '/');
	}
} satisfies Actions;
