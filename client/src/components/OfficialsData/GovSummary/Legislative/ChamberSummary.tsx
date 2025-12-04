import { Box, Typography } from '@mui/material';
import type { Chamber } from '../../../../models/MapProps';
import { Dial } from './Dial';

interface ChamberSummaryProps {
	chamber: Chamber;
}

const sortKeys = ['democrat', 'republican', 'independent', 'other', 'vacant'] as const;

export const ChamberSummary = ({ chamber }: ChamberSummaryProps) => {
	const chamberToSortedArray = () =>
		sortKeys
			.map((key) => ({
				key,
				value: chamber[key],
			}))
			.sort((a, b) => b.value - a.value)
			.filter(({ value }) => value > 0);

	const swatchColors: Record<string, string> = {
		democrat: 'bg-democrat',
		republican: 'bg-republican',
		independent: 'bg-independent',
		other: 'bg-unknown',
		vacant: 'bg-vacant',
	};

	return (
		<Box className="flex flex-col items-center w-full">
			{/* Dial */}
			<Dial
				dem={chamber.democrat}
				rep={chamber.republican}
				ind={chamber.independent}
				oth={chamber.other}
				vac={chamber.vacant}
			/>

			{/* Legend */}
			<Box className="mt-3 w-full max-w-[180px]">
				{chamberToSortedArray().map(({ key, value }) => (
					<Box
						key={key}
						className="flex items-center justify-between p-2 mb-1 rounded-md bg-card border border-border"
					>
						<Box className="flex items-center">
							<span
								className={`w-3 h-3 rounded-sm inline-block mr-2 ${swatchColors[key] ?? 'bg-muted'}`}
							/>
							<Typography className="text-foreground text-sm capitalize">{key}</Typography>
						</Box>
						<Typography className="font-bold text-foreground text-sm">{value}</Typography>
					</Box>
				))}
			</Box>
		</Box>
	);
};
