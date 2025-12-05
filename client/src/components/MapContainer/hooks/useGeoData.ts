import type { FeatureCollection } from 'geojson';
import { useEffect, useState } from 'react';
import type {
	FederalSummary,
	StateSummary,
	State,
	FederalResponse,
	StateResponse,
	MapType,
} from '../../../models/MapProps';

export const useGeoData = (type: MapType, state: State | null) => {
	const [nationalMap, setNationalMap] = useState<FeatureCollection | null>(null);
	const [districtMap, setDistrictMap] = useState<FeatureCollection | null>(null);
	const [loadingMap, setLoading] = useState<boolean>(false);
	const [summary, setSummary] = useState<FederalSummary | StateSummary | null>(null);

	useEffect(() => {
		const fetchStateMap = async () => {
			setLoading(true);
			try {
				const res = await fetch(
					`http://localhost:8000/geojson/${type}/${state?.STATEFP}?stateUSPS=${state?.USPS}`,
				);
				const data: StateResponse = await res.json();
				setSummary(data.summary);
				setDistrictMap(data.map);
				setLoading(false);
			} catch (err) {
				setSummary(null);
				setDistrictMap(null);
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		const fetchFederalMap = async () => {
			setLoading(true);
			try {
				const res = await fetch('http://localhost:8000/geojson/states');
				const data: FederalResponse = await res.json();
				setSummary(data.summary);
				setNationalMap(data.map);
				setLoading(false);
			} catch (err) {
				setSummary(null);
				setNationalMap(null);
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		if (state) fetchStateMap();
		else fetchFederalMap();
	}, [state, type]);

	return { nationalMap, districtMap, summary, loadingMap };
};
