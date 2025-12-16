import { PieChart } from '@mui/x-charts';
import type { CampaignSummary } from '../../models/OfficialProps';

interface ContributionChartProps {
	campaignSummary: CampaignSummary;
	formatCurrency: (value: number) => string;
}

export const ContributionChart = ({ campaignSummary, formatCurrency }: ContributionChartProps) => {
	const valueFormatter = (item: { value: number }) => formatCurrency(item.value);

	const innerLayer = [
		{
			id: 'individual',
			value: campaignSummary.individual_contributions,
			label: 'Individual',
			color: '#2563EB',
		},
		{
			id: 'pac',
			value: campaignSummary.pac_contributions,
			label: 'PAC',
			color: '#DC2626',
		},
		{
			id: 'party',
			value: campaignSummary.party_contributions,
			label: 'Party',
			color: '#16A34A',
		},
	];

	const outerLayer = [
		{
			id: 'small',
			value: campaignSummary.small_donor_amount,
			label: 'Small Donors (<$200)',
			color: '#60A5FA',
		},
		{
			id: 'large',
			value: campaignSummary.large_donor_amount,
			label: 'Large Donors (>$200)',
			color: '#1E40AF',
		},
	];

	return (
		<PieChart
			series={[
				{
					data: innerLayer.filter((item) => item.value > 0),
					innerRadius: 40,
					outerRadius: 70,
					valueFormatter,
					cornerRadius: 4,
				},
				{
					data: outerLayer.filter((item) => item.value > 0),
					innerRadius: 72,
					outerRadius: 95,
					valueFormatter,
					startAngle: 0,
					endAngle:
						360 *
						(campaignSummary.individual_contributions /
							(campaignSummary.individual_contributions +
								campaignSummary.pac_contributions +
								campaignSummary.party_contributions)),
					cornerRadius: 4,
				},
			]}
			width={240}
			height={240}
		/>
	);
};
