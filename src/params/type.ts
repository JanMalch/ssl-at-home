import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((type) => type === 'root-cas' || type === 'servers') satisfies ParamMatcher;
