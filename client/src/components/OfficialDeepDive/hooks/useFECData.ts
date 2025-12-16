import { useEffect, useState } from 'react';
import type { MapType } from '../../../models/MapProps';
import type { Official, OfficialFECSummary } from '../../../models/OfficialProps';

interface UseFECDataProps {
	official: Official | null;
	type: MapType;
}

export const useFECData = ({ official, type }: UseFECDataProps) => {
	const [officialFECSummary, setOfficialFEC] = useState<OfficialFECSummary | null>(null);
	const [cycle, setCycle] = useState<number | null>(null);

	useEffect(() => {
		if (!official || type !== 'cd') return;
		console.log(official);

		const fetchSummary = async () => {
			try {
				const res = await fetch(
					`http://localhost:8000/official/fec/${official.name}?state=${official.stateUSPS}&district=${official.district}`,
				);
				const data = await res.json();
				setCycle(data?.cycles?.at(-1) || null);
				setOfficialFEC(data);
			} catch (err) {
				setOfficialFEC(null);
				console.error(err);
			}
		};
		fetchSummary();
	}, [official, type]);

	return { officialFECSummary, cycle, setCycle };
};
