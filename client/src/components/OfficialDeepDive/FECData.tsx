import {
	Card,
	CardContent,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Typography,
	type SelectChangeEvent,
} from '@mui/material';
import type { OfficialFECSummary } from '../../models/OfficialProps';
import { Spinner } from '../Spinner';
import { ContributionChart } from './ContributionChart';
import { useCampaignData } from './hooks/useCampaignData';
import { formatCurrency, formatName } from './utils';

interface FECDataProps {
	officialFECSummary: OfficialFECSummary | null;
	cycle: number | null;
	setCycle: (cycle: number | null) => void;
}

export const FECData = ({ officialFECSummary, cycle, setCycle }: FECDataProps) => {
	const { campaignSummary, loadingCampaign } = useCampaignData({
		officialFECSummary,
		cycle,
	});

	return (
		<>
			{loadingCampaign ? (
				<Spinner />
			) : (
				officialFECSummary && (
					<>
						<div className="flex m-3 gap-2 sm:items-center sm:justify-between">
							<div>
								<Typography variant="h5" fontWeight={600} color="text.primary">
									{formatName(officialFECSummary.name)}
								</Typography>
							</div>

							<FormControl size="small" className="min-w-[140px]">
								<InputLabel>Cycle</InputLabel>
								<Select
									value={cycle ?? ''}
									label="Cycle"
									onChange={(e: SelectChangeEvent<number>) => setCycle(Number(e.target.value))}
								>
									{officialFECSummary.cycles.map((c) => (
										<MenuItem key={c} value={c}>
											{c}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</div>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
							<Card>
								<CardContent className="space-y-1 bg-background">
									<Typography variant="caption">Total Raised</Typography>
									<Typography variant="h6">
										{campaignSummary ? formatCurrency(campaignSummary.total_raised) : '—'}
									</Typography>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="space-y-1 bg-background">
									<Typography variant="caption">Total Spent</Typography>
									<Typography variant="h6">
										{campaignSummary ? formatCurrency(campaignSummary.total_spent) : '—'}
									</Typography>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="space-y-1 bg-background">
									<Typography variant="caption">Cash on Hand</Typography>
									<Typography variant="h6">
										{campaignSummary ? formatCurrency(campaignSummary.cash_on_hand) : '—'}
									</Typography>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="space-y-1 bg-background">
									<Typography variant="caption">Debt</Typography>
									<Typography variant="h6">
										{campaignSummary ? formatCurrency(campaignSummary.total_debt) : '—'}
									</Typography>
								</CardContent>
							</Card>
						</div>
						<Card className="mt-3">
							<CardContent className="bg-background">
								<Typography variant="subtitle1" gutterBottom>
									Contribution Breakdown
								</Typography>
								{campaignSummary && (
									<ContributionChart
										campaignSummary={campaignSummary}
										formatCurrency={formatCurrency}
									/>
								)}
							</CardContent>
						</Card>
					</>
				)
			)}
		</>
	);
};
