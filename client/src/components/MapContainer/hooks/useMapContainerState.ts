import { useState, useCallback } from 'react';
import type { State, District, MapType } from '../../../models/MapProps';
import type { Official } from '../../../models/OfficialProps';

export function useMapContainerState() {
	const [state, setState] = useState<State | null>(null);
	const [district, setDistrict] = useState<District | null>(null);
	const [official, setOfficial] = useState<Official | null>(null);
	const [type, setType] = useState<MapType>('cd');
	const [sidebarOpenR, setSidebarOpenR] = useState(true);
	const [sidebarOpenL, setSidebarOpenL] = useState(false);

	const handleSetState = useCallback(
		(newState: State | null) => {
			setState(newState);
			setOfficial(null);
			setSidebarOpenR(true);
			setSidebarOpenL(false);
		},
		[setOfficial],
	);

	const handleSetDistrict = useCallback((newDistrict: District | null) => {
		setDistrict(newDistrict);
		setSidebarOpenR(true);
		setSidebarOpenL(false);
	}, []);

	const handleSetType = useCallback(
		(newType: MapType) => {
			setDistrict(null);
			setOfficial(null);
			setType(newType);
		},
		[setOfficial],
	);

	const toggleSidebarR = () =>
		setSidebarOpenR((open) => {
			if (sidebarOpenL) setSidebarOpenL(false);
			return !open;
		});
	const toggleSidebarL = () =>
		setSidebarOpenL((open) => {
			if (sidebarOpenR) setSidebarOpenR(false);
			return !open;
		});

	return {
		state,
		district,
		official,
		type,
		sidebarOpenR,
		sidebarOpenL,
		handleSetState,
		handleSetDistrict,
		handleSetType,
		toggleSidebarR,
		toggleSidebarL,
		setOfficial,
	};
}
