import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Card, CardContent, Chip, Paper, Typography } from '@mui/material';
import { useMemo } from 'react';
import type { Official } from '../../models/OfficialProps';
import { formatName } from './utils';

interface CareerOverviewProps {
	official: Official | null;
}

export const CareerOverview = ({ official }: CareerOverviewProps) => {
	const groupedTerms = useMemo(() => {
		if (!official || !official.terms || official.terms.length === 0) return [];

		const groups: { chamber: string; startYear: number; endYear: number; termCount: number }[] = [];

		official.terms.forEach((term) => {
			if (!term.chamber || !term.start_year) return;

			const endYear = term.end_year || new Date().getFullYear();
			const yearsServed = endYear - term.start_year;

			// Determine term length based on chamber
			const lowerChamber = term.chamber.toLowerCase();
			const termLength = lowerChamber.includes('house') ? 2 : 6; // House = 2 years, Senate = 6 years

			const termCount = Math.ceil(yearsServed / termLength);

			groups.push({
				chamber: term.chamber,
				startYear: term.start_year,
				endYear: endYear,
				termCount: termCount,
			});
		});

		return groups;
	}, [official]);

	const getChamberStyles = (chamber: string) => {
		const lowerChamber = chamber.toLowerCase();
		if (lowerChamber.includes('senate')) {
			return {
				color: 'var(--color-primary)',
				bgColor: 'bg-primary/10',
			};
		}
		if (lowerChamber.includes('house')) {
			return {
				color: 'var(--color-secondary)',
				bgColor: 'bg-secondary/10',
			};
		}
		return {
			color: 'var(--color-muted-foreground)',
			bgColor: 'bg-muted/50',
		};
	};

	const formatChamber = (chamber: string) => {
		const lowerChamber = chamber.toLowerCase();
		if (lowerChamber.includes('senate')) return 'Senate';
		if (lowerChamber.includes('house')) return 'House of Representatives';
		return chamber;
	};

	const calculateYearsServed = (startYear: number, endYear: number) => {
		const years = endYear - startYear;
		return years === 1 ? '1 year' : `${years} years`;
	};

	if (!groupedTerms.length) {
		return (
			<Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'var(--color-card)' }}>
				<Typography sx={{ color: 'var(--color-muted-foreground)' }}>
					No term data available
				</Typography>
			</Paper>
		);
	}

	return (
		<>
			{official && (
				<div className="m-3">
					<Typography variant="h5" fontWeight={600} color="text.primary">
						{formatName(official.name.toUpperCase())}
					</Typography>
				</div>
			)}
			<Card>
				<CardContent className="bg-background">
					<Typography
						variant="h6"
						gutterBottom
						sx={{ mb: 3, fontWeight: 600, color: 'var(--color-foreground)' }}
					>
						Terms in Office
					</Typography>

					<Timeline position="right" sx={{ p: 0, m: 0 }}>
						{groupedTerms.map((group, index) => {
							const isLast = index === groupedTerms.length - 1;
							const chamberStyles = getChamberStyles(group.chamber);
							const yearsServed = calculateYearsServed(group.startYear, group.endYear);

							return (
								<TimelineItem key={index}>
									<TimelineOppositeContent
										sx={{
											flex: 0.3,
											py: 2,
											px: 1,
										}}
									>
										<Typography
											variant="body2"
											fontWeight={600}
											sx={{ color: 'var(--color-foreground)' }}
										>
											{group.startYear}–{group.endYear}
										</Typography>
										<Typography variant="caption" sx={{ color: 'var(--color-muted-foreground)' }}>
											{yearsServed}
										</Typography>
									</TimelineOppositeContent>

									<TimelineSeparator>
										<TimelineDot
											sx={{
												bgcolor: chamberStyles.color,
												boxShadow: `0 0 0 4px var(--color-background)`,
												border: `2px solid ${chamberStyles.color}`,
											}}
										/>
										{!isLast && <TimelineConnector sx={{ bgcolor: 'var(--color-border)' }} />}
									</TimelineSeparator>

									<TimelineContent sx={{ py: 2, px: 2 }}>
										<Paper
											elevation={0}
											sx={{
												p: 2,
												bgcolor: 'var(--color-muted)',
												border: '1px solid var(--color-border)',
											}}
										>
											<Typography
												variant="subtitle2"
												fontWeight={600}
												gutterBottom
												sx={{ color: 'var(--color-foreground)' }}
											>
												{formatChamber(group.chamber)}
											</Typography>
											<Chip
												label={`${group.termCount} ${group.termCount === 1 ? 'term' : 'terms'}`}
												size="small"
												className={chamberStyles.bgColor}
												sx={{
													mt: 0.5,
													color: chamberStyles.color,
													fontWeight: 500,
												}}
											/>
										</Paper>
									</TimelineContent>
								</TimelineItem>
							);
						})}
					</Timeline>
				</CardContent>
			</Card>
		</>
	);
};
