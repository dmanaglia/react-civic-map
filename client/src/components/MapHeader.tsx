import Chip from '@mui/material/Chip';
import type { MapType } from '../models/MapProps';

const featureTypes: { id: MapType; label: string }[] = [
	{ id: 'county', label: 'Counties' },
	{ id: 'sldl', label: 'State House' },
	{ id: 'sldu', label: 'State Senate' },
	{ id: 'cd', label: 'Congressional Districts' },
	{ id: 'place', label: 'City Boundaries' },
	{ id: 'cousub', label: 'County Subdivisions' },
];

interface MapHeaderProps {
	type: MapType;
	setType: (types: MapType) => void;
}

export const MapHeader = ({ type, setType }: MapHeaderProps) => {
	return (
		<div className="bg-white/95 m-4 px-4 py-3 rounded-xl flex justify-between flex-wrap">
			{featureTypes.map((feature) => (
				<Chip
					key={feature.id}
					label={feature.label}
					component="button"
					clickable
					onClick={() => setType(feature.id)}
					variant={type === feature.id ? 'filled' : 'outlined'}
					color="primary"
				/>
			))}
		</div>
	);
};
