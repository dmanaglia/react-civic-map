export const getDistrictClass = (party?: string, transparent: boolean = false) => {
	let baseClass = 'cursor-pointer stroke-black hover:drop-shadow transition-all transition-stroke ';

	if (transparent) baseClass += 'opacity-25 ';

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

export default getDistrictClass;
