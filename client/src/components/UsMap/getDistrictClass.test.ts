import { describe, it, expect } from 'vitest';
import { getDistrictClass } from './getDistrictClass';

describe('getDistrictClass', () => {
	const base = 'cursor-pointer stroke-black hover:drop-shadow transition-all transition-stroke ';

	const classes = {
		unknown: base + 'fill-unknown hover:fill-gray-600',
		dem: base + 'fill-democrat hover:fill-blue-600',
		rep: base + 'fill-republican hover:fill-red-700',
		ind: base + 'fill-independent hover:fill-green-600',
		other: base + 'fill-unknown hover:fill-orange-600',
	};

	// --- Unknown -----

	it('returns unknown class when party is undefined', () => {
		expect(getDistrictClass(undefined)).toBe(classes.unknown);
	});

	// --- DEMOCRATIC ------

	it('matches "Democratic"', () => {
		expect(getDistrictClass('Democratic')).toBe(classes.dem);
	});

	it('matches long strings containing the substring', () => {
		expect(getDistrictClass('DEMOCRATIC PARTY MEMBER')).toBe(classes.dem);
	});

	// --- REPUBLICAN ------

	it('matches "Republican"', () => {
		expect(getDistrictClass('Republican')).toBe(classes.rep);
	});

	it('matches substring in sentence', () => {
		expect(getDistrictClass('Republican Party')).toBe(classes.rep);
	});

	// --- INDEPENDENT ------

	it('matches "Independent"', () => {
		expect(getDistrictClass('Independent')).toBe(classes.ind);
	});

	it('matches substring inside a bigger string', () => {
		expect(getDistrictClass('Independent Party of Somewhere')).toBe(classes.ind);
	});

	// --- FALLBACK LOGIC -----

	it('falls back to other for unrelated strings', () => {
		expect(getDistrictClass('Green')).toBe(classes.other);
	});
});
