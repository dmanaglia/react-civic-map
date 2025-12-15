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
import { useMemo, useState } from 'react';
import type { OfficialFECSummary } from '../../models/OfficialProps';
import { Spinner } from '../Spinner';
import { ContributionChart } from './ContributionChart';
import { UseCampaignData } from './useCampaignData';

interface FECDataProps {
	officialFECSummary: OfficialFECSummary | null;
	loadingSummary: boolean;
}

const formatCurrency = (value: number) =>
	value.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
	});

export const FECData = ({ officialFECSummary, loadingSummary }: FECDataProps) => {
	const [cycle, setCycle] = useState<number | null>(officialFECSummary?.cycles?.at(-1) ?? null);

	useMemo(() => {
		setCycle(officialFECSummary?.cycles?.at(-1) ?? null);
	}, [officialFECSummary]);

	const { campaignSummary, loadingCampaign } = UseCampaignData({
		officialFECSummary,
		cycle,
	});

	return (
		<div className="space-y-6 m-10" id="FEC-info">
			<Card className="p-5" sx={{ position: 'relative', minHeight: 500 }}>
				{loadingSummary ? (
					<Spinner />
				) : (
					officialFECSummary && (
						<>
							<div className="flex flex-col m-3 gap-2 sm:flex-row sm:items-center sm:justify-between">
								<div>
									<Typography variant="h5" fontWeight={600} color="text.primary">
										{officialFECSummary.prefix} {officialFECSummary.name}{' '}
										{officialFECSummary.suffix}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{officialFECSummary.office} • District {officialFECSummary.district}
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

							{loadingCampaign ? (
								<div className="flex justify-center mt-6">
									<Spinner />
								</div>
							) : (
								<>
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
											{campaignSummary ? (
												<ContributionChart
													campaignSummary={campaignSummary}
													formatCurrency={formatCurrency}
												/>
											) : null}
										</CardContent>
									</Card>
								</>
							)}
						</>
					)
				)}
			</Card>
		</div>
	);
};
