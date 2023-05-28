import { authenticate } from '$lib/server/auth';
import { execSync } from '$lib/server/utils';
import type { Handle } from '@sveltejs/kit';

console.log(execSync('openssl version') + '\n');
console.log('Server initialized.');

export const handle: Handle = async ({ event, resolve }) => {
	authenticate(event.cookies, event.locals);
	return resolve(event);
};
