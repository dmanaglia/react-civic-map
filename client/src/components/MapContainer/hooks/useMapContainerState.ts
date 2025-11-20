import { useState, useCallback } from 'react';
import type { State, District, MapType } from '../../../models/MapProps';
import type { Official } from '../../../models/OfficialProps';

export function useMapContainerState() {
	const [state, setState] = useState<State | null>(null);
	const [district, setDistrict] = useState<District | null>(null);
	const [official, setOfficial] = useState<Official | null>(null);
	const [type, setType] = useState<MapType>('cd');
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const handleSetState = useCallback(
		(newState: State | null) => {
			setState(newState);
			setOfficial(null);
			setSidebarOpen(true);
		},
		[setOfficial],
	);

	const handleSetDistrict = useCallback((newDistrict: District | null) => {
		setDistrict(newDistrict);
		setSidebarOpen(true);
	}, []);

	const handleSetType = useCallback(
		(newType: MapType) => {
			setDistrict(null);
			setOfficial(null);
			setType(newType);
		},
		[setOfficial],
	);

	const toggleSidebar = () => setSidebarOpen((open) => !open);

	return {
		state,
		district,
		official,
		type,
		sidebarOpen,
		handleSetState,
		handleSetDistrict,
		handleSetType,
		toggleSidebar,
		setOfficial,
	};
}
