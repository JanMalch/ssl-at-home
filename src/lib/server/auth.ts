import type { Cookies } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const sessionExpiry = new Map<string, Date>();

function in5min(): Date {
	const now = new Date();
	return new Date(now.getTime() + 300000);
}

export function authenticate(cookies: Cookies, locals: App.Locals) {
	const sessionId = cookies.get('session');
	if (sessionId == null) {
		return;
	}
	const expiry = sessionExpiry.get(sessionId);
	const now = new Date();
	if (expiry == null || now > expiry) {
		logout(sessionId, cookies, locals);
		return;
	}

	_login(sessionId, cookies, locals);
}

function _login(
	sessionId: string,

	cookies: Cookies,
	locals: App.Locals
) {
	const expires = in5min();
	sessionExpiry.set(sessionId, expires);
	cookies.set('session', sessionId, {
		expires,
		sameSite: 'strict',
		httpOnly: true,
		path: '/'
	});
	locals.isAuthenticated = true;
}

const pwdFile = resolve('./files', '.pwd.bcrypt');

export async function setPassword(password: string) {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	await writeFile(pwdFile, hash, 'utf-8');
}

export async function isCorrectPassword(password: unknown) {
	if (typeof password !== 'string') {
		return false;
	}
	const stored = await readFile(pwdFile, 'utf-8');
	return bcrypt.compare(password, stored.trim());
}

export async function isPasswordSet() {
	if (!existsSync(pwdFile)) {
		return false;
	}
	const stored = await readFile(pwdFile, 'utf-8');
	return stored.trim().length > 0;
}

export function login(cookies: Cookies, locals: App.Locals) {
	_login(randomUUID(), cookies, locals);
}

export function logout(sessionId: string, cookies: Cookies, locals: App.Locals) {
	cookies.delete('session');
	sessionExpiry.delete(sessionId);
	locals.isAuthenticated = false;
}
