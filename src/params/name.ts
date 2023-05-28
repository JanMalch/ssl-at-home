import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((name) => /^[a-z0-9\\-]+$/.test(name)) satisfies ParamMatcher;
