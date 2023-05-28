import type { RequestHandler } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { createReadStream, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { Readable } from 'node:stream';

const sendFile = (file: string, attachmentFileName: string) =>
	new Response(Readable.toWeb(createReadStream(file, 'utf-8')) as ReadableStream, {
		headers: {
			'Content-Disposition': `attachment; filename=${attachmentFileName}`
		}
	});

export const GET = (async ({ params: { type, name, file }, locals }) => {
	if (!type || !name || !file) {
		throw error(404, 'No such file.');
	}
	// only root CA is public
	if (file !== 'ca.pem' && !locals.isAuthenticated) {
		throw error(404, 'No such file.');
	}
	const filePath = resolve('./files', type, name, file);
	if (existsSync(filePath)) {
		return sendFile(filePath, `${name}.${file}`);
	}
	throw error(404, 'No such file.');
}) satisfies RequestHandler;
