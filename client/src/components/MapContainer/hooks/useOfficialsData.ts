import { useEffect, useState } from 'react';
import type { District, State } from '../../../models/MapProps';
import type { Official } from '../../../models/OfficialProps';

interface UseOfficialsDataProps {
	district: District | null;
	state: State | null;
	setOfficial: (official: Official | null) => void;
}

export const useOfficialsData = ({ district, state, setOfficial }: UseOfficialsDataProps) => {
	const [loadingOfficial, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!district || !state) return;

		const fetchOfficial = async () => {
			// Only used to get a single Official from a given district
			setLoading(true);
			try {
				const res = await fetch(
					`http://localhost:8000/official/${district.TYPE}/${state.USPS}/${district.ID}`,
				);
				const data = await res.json();
				setOfficial(data);
			} catch (err) {
				setOfficial(null);
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetchOfficial();
	}, [district, setOfficial, state]);

	return { loadingOfficial };
};
