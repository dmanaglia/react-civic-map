import { Box, Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import type {
	District,
	FederalSummary,
	MapType,
	State,
	StateSummary,
	Chamber,
} from '../../../models/MapProps';
import { Representative } from '../Representative';
import { ChamberSummary } from './ChamberSummary';

interface LegislativeProps {
	summary: FederalSummary | StateSummary;
	type: MapType;
	state: State | null;
	district: District | null;
}

export const Legislative = ({ summary, type, state, district }: LegislativeProps) => {
	const [activeChamber, setActiveChamber] = useState<'House' | 'Senate'>('House');

	const data = useMemo(() => {
		if (!summary) return null;
		return activeChamber === 'House'
			? (summary.legislative.house as Chamber)
			: (summary.legislative.senate as Chamber);
	}, [summary, activeChamber]);

	useEffect(() => {
		// updates chamber when state map type changes
		const updateChamber = () => {
			if (type === 'sldu') {
				setActiveChamber('Senate');
			} else if (type === 'sldl') {
				setActiveChamber('House');
			} else if (type === 'cd') {
				setActiveChamber('House');
			}
		};
		updateChamber();
	}, [state, type]);

	const fedReps = useMemo(() => {
		if (!state) return undefined;
		const stateSummary = summary as StateSummary;
		return stateSummary.federal;
	}, [state, summary]);

	if (!data) {
		return (
			<Box className="text-gray-600 text-sm text-center py-4">No legislative data available.</Box>
		);
	}

	const senateLabel = type === 'cd' && state ? 'Senators' : 'Senate';

	const pillStyles = (isActive: boolean) => ({
		borderRadius: '9999px',
		textTransform: 'none',
		fontWeight: 500,
		px: 3,
		py: 1,
		transition: 'background-color 0.2s ease',
		backgroundColor: isActive ? '#2563eb' : '#e5e7eb',
		color: isActive ? '#fff' : '#374151',
		'&:hover': {
			backgroundColor: isActive ? '#1e4fd8' : '#d6d8dd',
		},
		boxShadow: isActive ? '0 2px 6px rgba(37, 99, 235, 0.4)' : 'none',
	});

	return (
		<Box className="w-full">
			{/* Chamber tabs */}
			<Box className="flex justify-center gap-6 mb-4">
				<Button
					onClick={() => setActiveChamber('House')}
					aria-pressed={activeChamber === 'House'}
					sx={pillStyles(activeChamber === 'House')}
				>
					House
				</Button>

				<Button
					onClick={() => setActiveChamber('Senate')}
					aria-pressed={activeChamber === 'Senate'}
					sx={pillStyles(activeChamber === 'Senate')}
				>
					{senateLabel}
				</Button>
			</Box>

			{/* Content */}
			<Box className="mt-6">
				{type === 'cd' && fedReps ? (
					activeChamber === 'House' ? (
						<Box className="flex flex-col items-center">
							<ChamberSummary chamber={fedReps.house} />
						</Box>
					) : (
						<Box className="flex flex-col gap-4 items-center">
							{fedReps.senators?.map((official) => (
								<Representative
									key={official?.name}
									official={official}
									state={state}
									district={district}
								/>
							))}
						</Box>
					)
				) : (
					<Box className="flex flex-col items-center">
						<ChamberSummary chamber={data} />
					</Box>
				)}
			</Box>
		</Box>
	);
};
