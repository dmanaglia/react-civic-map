// src/components/UsMap/getDistrictClass.ts
export const getDistrictClass = (party?: string) => {
	const baseClass =
		'cursor-pointer stroke-black hover:drop-shadow transition-all transition-stroke ';

	if (!party) return baseClass + 'fill-unknown hover:fill-gray-600';

	const p = party.toLowerCase();

	if (p.includes('democratic')) {
		return baseClass + 'fill-democrat hover:fill-blue-600';
	}

	if (p.includes('republican')) {
		return baseClass + 'fill-republican hover:fill-red-700';
	}

	if (p.includes('independent')) {
		return baseClass + 'fill-independent hover:fill-green-600';
	}

	return baseClass + 'fill-unknown hover:fill-orange-600';
};

export default getDistrictClass;
