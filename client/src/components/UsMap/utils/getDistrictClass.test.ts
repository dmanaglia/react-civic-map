import { describe, it, expect } from 'vitest';
import { getDistrictClass, getDistrictColor } from './getDistrictClass';

describe('getDistrictClass', () => {
	const base = 'cursor-pointer stroke-black hover:drop-shadow transition-all transition-stroke ';

	it('returns unknown when no party provided', () => {
		expect(getDistrictClass(undefined)).toBe(base + 'fill-unknown hover:fill-unknown-hover');
	});

	it('handles democratic', () => {
		expect(getDistrictClass('Democratic')).toBe(base + 'fill-democrat hover:fill-democrat-hover');
	});

	it('handles republican', () => {
		expect(getDistrictClass('Republican')).toBe(
			base + 'fill-republican hover:fill-republican-hover',
		);
	});

	it('handles independent', () => {
		expect(getDistrictClass('Independent')).toBe(
			base + 'fill-independent hover:fill-independent-hover',
		);
	});

	it('falls back to unknown', () => {
		expect(getDistrictClass('Green')).toBe(base + 'fill-unknown hover:fill-unknown-hover');
	});
});

describe('getDistrictColor', () => {
	it('returns gray for no party', () => {
		expect(getDistrictColor(undefined)).toEqual({
			base: '#9ca3af',
			hover: '#6b7280',
		});
	});

	it('returns blue for democratic', () => {
		expect(getDistrictColor('Democratic')).toEqual({
			base: '#3b82f6',
			hover: '#2563eb',
		});
	});

	it('returns red for republican', () => {
		expect(getDistrictColor('Republican')).toEqual({
			base: '#ef4444',
			hover: '#dc2626',
		});
	});

	it('returns purple for independent', () => {
		expect(getDistrictColor('Independent')).toEqual({
			base: '#8b5cf6',
			hover: '#7c3aed',
		});
	});

	it('returns gray for unknown', () => {
		expect(getDistrictColor('Green')).toEqual({
			base: '#9ca3af',
			hover: '#6b7280',
		});
	});
});
