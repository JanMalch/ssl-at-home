import { exec } from '$lib/server/utils';

/**
 * Get Certificate's Content.
 * @see generateCaPublicCert
 */
export async function getCertificateContent(pemFilePath: string): Promise<string> {
	return exec(`openssl x509 -in "${pemFilePath}" -text`);
}
