import { describe, it, expect } from 'vitest';
import { getDistrictClass } from './getDistrictClass';

describe('getDistrictClass', () => {
	const base = 'cursor-pointer stroke-black hover:drop-shadow transition-all transition-stroke ';

	const classes = {
		unknown: base + 'fill-unknown hover:fill-unknown-hover',
		dem: base + 'fill-democrat hover:fill-democrat-hover',
		rep: base + 'fill-republican hover:fill-republican-hover',
		ind: base + 'fill-independent hover:fill-independent-hover',
		other: base + 'fill-unknown hover:fill-unknown-hover',
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
