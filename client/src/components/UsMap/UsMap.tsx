import type { FeatureCollection } from 'geojson';
import { UseSettings } from '../../context/SettingsContext';
import type { District, MapType, State } from '../../models/MapProps';
import type { AddressOfficials } from '../../models/OfficialProps';
import { LeafletMap } from './LeafletMapMode/LeafletMap';
import { SvgMap } from './SvgMapMode/SvgMap';

interface UsMapProps {
	officialList: AddressOfficials | null;
	districtMap: FeatureCollection | null;
	nationalMap: FeatureCollection | null;
	type: MapType;
	sidebarType: 'summary' | 'address';
	state: State | null;
	district: District | null;
	setState: (stateId: State | null) => void;
	setDistrict: (feature: District | null) => void;
}

export const UsMap: React.FC<UsMapProps> = (props) => {
	const { backdropEnabled } = UseSettings();

	if (backdropEnabled) return <LeafletMap {...props} />;

	return <SvgMap {...props} />;
};
