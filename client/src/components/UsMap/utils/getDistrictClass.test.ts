import { describe, it, expect } from 'vitest';
import { getDistrictClass, getDistrictColor } from './getDistrictClass';

describe('getDistrictClass', () => {
	const base = 'cursor-pointer stroke-black hover:drop-shadow transition-all transition-stroke ';

	it('returns unknown when no party provided', () => {
		expect(getDistrictClass(false, undefined)).toBe(base + 'fill-unknown hover:fill-unknown-hover');
	});

	it('handles democratic', () => {
		expect(getDistrictClass(false, 'Democratic')).toBe(
			base + 'fill-democrat hover:fill-democrat-hover',
		);
	});

	it('handles republican', () => {
		expect(getDistrictClass(false, 'Republican')).toBe(
			base + 'fill-republican hover:fill-republican-hover',
		);
	});

	it('handles independent', () => {
		expect(getDistrictClass(false, 'Independent')).toBe(
			base + 'fill-independent hover:fill-independent-hover',
		);
	});

	it('falls back to unknown', () => {
		expect(getDistrictClass(false, 'Green')).toBe(base + 'fill-unknown hover:fill-unknown-hover');
	});
});

describe('getDistrictColor', () => {
	it('returns gray for no party', () => {
		expect(getDistrictColor(undefined)).toEqual('#9ca3af');
	});

	it('returns blue for democratic', () => {
		expect(getDistrictColor('Democratic')).toEqual('#3b82f6');
	});

	it('returns red for republican', () => {
		expect(getDistrictColor('Republican')).toEqual('#ef4444');
	});

	it('returns purple for independent', () => {
		expect(getDistrictColor('Independent')).toEqual('#8b5cf6');
	});

	it('returns gray for unknown', () => {
		expect(getDistrictColor('Green')).toEqual('#9ca3af');
	});
});
