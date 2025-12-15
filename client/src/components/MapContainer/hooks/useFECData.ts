import { useEffect, useState } from 'react';
import type { Official, OfficialFECSummary } from '../../../models/OfficialProps';

interface UseFECDataProps {
	official: Official | null;
}

export const useFECData = ({ official }: UseFECDataProps) => {
	const [officialFECSummary, setOfficialFEC] = useState<OfficialFECSummary | null>(null);
	const [loadingFEC, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!official) return;

		const fetchOfficial = async () => {
			setLoading(true);
			try {
				const res = await fetch(`http://localhost:8000/official/fec/${official.name}`);
				const data = await res.json();
				setOfficialFEC(data);
			} catch (err) {
				setOfficialFEC(null);
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetchOfficial();
	}, [official]);

	return { officialFECSummary, loadingFEC };
};
