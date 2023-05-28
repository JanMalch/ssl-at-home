import { exec, rootCasDir } from '$lib/server/utils';
import { mkdirSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

export function getCaRsaFilePath(name: string): string {
	const dest = resolve(rootCasDir, name, 'ca-key.pem');
	mkdirSync(dirname(dest), { recursive: true });
	return dest;
}

export function getCaPublicCertFilePath(name: string): string {
	const dest = resolve(rootCasDir, name, 'ca.pem');
	mkdirSync(dirname(dest), { recursive: true });
	return dest;
}

/**
 * Generate RSA for CA.
 */
export async function generateCaRsa({
	passphrase,
	name
}: {
	passphrase: string;
	name: string;
}): Promise<{
	filePath: string;
}> {
	const filePath = getCaRsaFilePath(name);
	await exec(`openssl genrsa -aes256 -out "${filePath}" -passout "pass:${passphrase}" 4096`);
	return { filePath };
}

/**
 * Generate a public CA Cert in pem format.
 */
export async function generateCaPublicCert({
	passphrase,
	rootCaKeyPath,
	cn,
	name,
	days
}: {
	passphrase: string;
	name: string;
	rootCaKeyPath: string;
	days: number;
	cn: string;
}): Promise<{
	filePath: string;
}> {
	const filePath = getCaPublicCertFilePath(name);
	await exec(
		`openssl req -new -x509 -sha256 -days ${days} -key "${rootCaKeyPath}" -subj "/CN=${cn}" -passin "pass:${passphrase}" -out "${filePath}"`
	);
	return { filePath };
}

/**
 * Create a new CA.
 */
export async function generateCa({
	passphrase,
	cn,
	name,
	days
}: {
	passphrase: string;
	name: string;
	days: number;
	cn: string;
}): Promise<{
	keyFilePath: string;
	publicCertFilePath: string;
}> {
	try {
		const { filePath: rootCaKeyPath } = await generateCaRsa({ name, passphrase });

		const { filePath: publicCertFilePath } = await generateCaPublicCert({
			rootCaKeyPath,
			passphrase,
			name,
			days,
			cn
		});
		return { keyFilePath: rootCaKeyPath, publicCertFilePath };
	} catch (e) {
		await rm(resolve(rootCasDir, name), { recursive: true });
		throw e;
	}
}
