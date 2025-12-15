export const getDistrictClass = (active: boolean, party?: string): string => {
	const baseClass =
		'cursor-pointer stroke-black hover:drop-shadow transition-all transition-stroke ';

	if (!party) {
		if (active) return baseClass + 'fill-unknown-hover';
		return baseClass + 'fill-unknown hover:fill-unknown-hover';
	}

	const p = party.toLowerCase();

	if (p.includes('democratic')) {
		if (active) return baseClass + 'fill-democrat-hover';
		return baseClass + 'fill-democrat hover:fill-democrat-hover';
	}

	if (p.includes('republican')) {
		if (active) return baseClass + 'fill-republican-hover';
		return baseClass + 'fill-republican hover:fill-republican-hover';
	}

	if (p.includes('independent')) {
		if (active) return baseClass + 'fill-independent-hover';
		return baseClass + 'fill-independent hover:fill-independent-hover';
	}

	if (active) return baseClass + 'fill-unknown-hover';
	return baseClass + 'fill-unknown hover:fill-unknown-hover';
};

export const getDistrictColor = (party?: string): string => {
	if (!party) return '#9ca3af'; // gray for unknown

	const p = party.toLowerCase();

	if (p.includes('democratic')) return '#3b82f6'; // blue

	if (p.includes('republican')) return '#ef4444'; // red

	if (p.includes('independent')) return '#8b5cf6'; // purple

	return '#9ca3af'; // gray for unknown
};
