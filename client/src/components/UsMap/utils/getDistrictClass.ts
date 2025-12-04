export const getDistrictClass = (party?: string) => {
	const baseClass =
		'cursor-pointer stroke-black hover:drop-shadow transition-all transition-stroke ';

	if (!party) return baseClass + 'fill-unknown hover:fill-unknown-hover';

	const p = party.toLowerCase();

	if (p.includes('democratic')) {
		return baseClass + 'fill-democrat hover:fill-democrat-hover';
	}

	if (p.includes('republican')) {
		return baseClass + 'fill-republican hover:fill-republican-hover';
	}

	if (p.includes('independent')) {
		return baseClass + 'fill-independent hover:fill-independent-hover';
	}

	return baseClass + 'fill-unknown hover:fill-unknown-hover';
};

export const getDistrictColor = (party?: string): { base: string; hover: string } => {
	if (!party) {
		return { base: '#9ca3af', hover: '#6b7280' }; // gray for unknown
	}

	const p = party.toLowerCase();

	if (p.includes('democratic')) {
		return { base: '#3b82f6', hover: '#2563eb' }; // blue
	}

	if (p.includes('republican')) {
		return { base: '#ef4444', hover: '#dc2626' }; // red
	}

	if (p.includes('independent')) {
		return { base: '#8b5cf6', hover: '#7c3aed' }; // purple
	}

	return { base: '#9ca3af', hover: '#6b7280' }; // gray for unknown
};
