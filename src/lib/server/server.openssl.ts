import { exec, serversDir } from '$lib/server/utils';
import { mkdirSync } from 'node:fs';
import { rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

export function getServerRsaFilePath(name: string) {
	const dest = resolve(serversDir, name, 'cert-key.pem');
	mkdirSync(dirname(dest), { recursive: true });
	return dest;
}

export function getServerCsrFilePath(name: string) {
	const dest = resolve(serversDir, name, 'cert.csr');
	mkdirSync(dirname(dest), { recursive: true });
	return dest;
}

export function getServerExtFilePath(name: string) {
	const dest = resolve(serversDir, name, 'extfile.cnf');
	mkdirSync(dirname(dest), { recursive: true });
	return dest;
}

export function getServerPublicCertFilePath(name: string) {
	const dest = resolve(serversDir, name, 'cert.pem');
	mkdirSync(dirname(dest), { recursive: true });
	return dest;
}

/**
 * Create an RSA key for a server certificate.
 */
export async function generateServerRsa(name: string): Promise<{
	filePath: string;
}> {
	const filePath = getServerRsaFilePath(name);
	await exec(`openssl genrsa -out "${filePath}" 4096`);
	return { filePath };
}

/**
 * Create a Certificate Signing Request (CSR).
 *
 * CN is the common name. Can be anything.
 */
export async function generateServerCsr({
	name,
	serverRsaFilePath,
	cn = 'Home'
}: {
	name: string;
	cn?: string;
	serverRsaFilePath: string;
}): Promise<{
	filePath: string;
}> {
	const filePath = getServerCsrFilePath(name);
	await exec(
		`openssl req -new -sha256 -subj "/CN=${cn}" -key "${serverRsaFilePath}" -out "${filePath}"`
	);
	return { filePath };
}

/**
 * Creates an extfile with all the alternative names
 * and then creates an server certificate.
 *
 * DNS names can be a wildcard like `"*.foobar.home"`.
 */
export async function generateServerPublicCert({
	name,
	dnsNames,
	ips,
	passphrase,
	serverCsrFilePath,
	caPublicCertFilePath,
	caKeyFilePath,
	days
}: {
	name: string;
	dnsNames: string[];
	ips: string[];
	passphrase: string;
	serverCsrFilePath: string;
	caPublicCertFilePath: string;
	caKeyFilePath: string;
	days: number;
}): Promise<{
	filePath: string;
	extFilePath: string;
}> {
	if (dnsNames.length === 0 && ips.length === 0) {
		throw new Error('Atleast one DNS name or IP required.');
	}

	const extFilePath = getServerExtFilePath(name);
	const subjectAltName = [
		...dnsNames.map((name) => `DNS:${name}`),
		...ips.map((ip) => `IP:${ip}`)
	].join(',');
	await writeFile(extFilePath, `subjectAltName=${subjectAltName}`, 'utf-8');

	const filePath = getServerPublicCertFilePath(name);
	await exec(
		`openssl x509 -req -sha256 -days ${days} -in "${serverCsrFilePath}" -CA "${caPublicCertFilePath}" -CAkey "${caKeyFilePath}" -out "${filePath}" -extfile "${extFilePath}" -passin "pass:${passphrase}" -CAcreateserial`
	);
	return { filePath, extFilePath };
}

export async function generateServer({
	name,
	passphrase,
	dnsNames,
	ips,
	caPublicCertFilePath,
	caKeyFilePath,
	cn,
	days
}: {
	name: string;
	dnsNames: string[];
	ips: string[];
	cn: string;
	passphrase: string;
	caPublicCertFilePath: string;
	caKeyFilePath: string;
	days: number;
}): Promise<{
	publicCertFilePath: string;
}> {
	try {
		const { filePath: serverRsaFilePath } = await generateServerRsa(name);
		const { filePath: serverCsrFilePath } = await generateServerCsr({
			name,
			serverRsaFilePath,
			cn
		});
		const { filePath: publicCertFilePath } = await generateServerPublicCert({
			name,
			dnsNames,
			ips,
			days,
			passphrase,
			serverCsrFilePath,
			caPublicCertFilePath,
			caKeyFilePath
		});
		return { publicCertFilePath };
	} catch (e) {
		await rm(resolve(serversDir, name), { recursive: true });
		throw e;
	}
}
