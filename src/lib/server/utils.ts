import childprocess from 'child_process';
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

const execAsync = promisify(childprocess.exec);

export async function exec(command: string): Promise<string> {
	console.debug('$', command);
	const { stdout } = await execAsync(command);
	return stdout?.trim() || '';
}

export function execSync(command: string): string {
	console.debug('$', command);
	return childprocess.execSync(command).toString('utf-8').trim();
}

export const filesDir = resolve('./files');
export const rootCasDir = resolve(filesDir, 'root-cas');
export const serversDir = resolve(filesDir, 'servers');

export async function collectRootCas(): Promise<Array<{ name: string; certificate_url: string }>> {
	const list = await readdir(rootCasDir);
	return list.map((name) => ({
		name,
		certificate_url: `/download/root-cas/${name}/ca.pem`
	}));
}

export function isValidString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0;
}

export function isValidNumberGreaterZero(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value) && value > 0;
}
