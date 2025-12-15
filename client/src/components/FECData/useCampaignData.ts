import { useEffect, useState } from 'react';
import type { CampaignSummary, OfficialFECSummary } from '../../models/OfficialProps';

interface UseCampaignDataProps {
	officialFECSummary: OfficialFECSummary | null;
	cycle: number | null;
}

export const UseCampaignData = ({ officialFECSummary, cycle }: UseCampaignDataProps) => {
	const [campaignSummary, setCampaignSummary] = useState<CampaignSummary | null>(null);
	const [loadingCampaign, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!officialFECSummary || !cycle) return;

		const fetchOfficial = async () => {
			setLoading(true);
			try {
				const res = await fetch(
					`http://localhost:8000/official/fec/${officialFECSummary.candidate_id}/${cycle}`,
				);
				const data = await res.json();
				console.log(data);
				setCampaignSummary(data);
			} catch (err) {
				setCampaignSummary(null);
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetchOfficial();
	}, [officialFECSummary, cycle]);

	return { campaignSummary, loadingCampaign };
};
