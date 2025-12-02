import { useEffect, useState } from 'react';
import type { BackdropMap } from '../../../models/MapProps';

export const useBackdropData = () => {
	const [backdropData, setBackdropData] = useState<BackdropMap | null>(null);
	const [loadingBackdrop, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchStateMap = async () => {
			// Only used to get a single Official from a given district
			setLoading(true); // now inside async function
			try {
				const res = await fetch(`http://localhost:8000/geojson/backdrop`);
				const data: BackdropMap = await res.json();
				console.log(data);
				setBackdropData(data);
				setLoading(false);
			} catch (err) {
				setBackdropData(null);
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchStateMap();
	}, []);

	return { backdropData, loadingBackdrop };
};
