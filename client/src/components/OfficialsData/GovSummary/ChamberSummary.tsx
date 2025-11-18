import { Box, Typography } from '@mui/material';
import type { Chamber } from '../../../models/MapProps';
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
		democrat: 'bg-blue-600',
		republican: 'bg-red-500',
		independent: 'bg-gray-500',
		other: 'bg-gray-400',
		vacant: 'bg-amber-500',
	};

	return (
		<Box className="flex flex-col items-center w-full">
			{/* Dial */}
			<Dial
				dem={chamber.democrat}
				rep={chamber.republican}
				ind={chamber.independent}
				vac={chamber.vacant}
			/>

			{/* Legend */}
			<Box className="mt-3 w-full max-w-[180px]">
				{chamberToSortedArray().map(({ key, value }) => (
					<Box
						key={key}
						className="flex items-center justify-between p-2 mb-1 rounded-md bg-white border border-gray-200"
					>
						<Box className="flex items-center">
							<span
								className={`w-3 h-3 rounded-sm inline-block mr-2 ${swatchColors[key] ?? 'bg-gray-300'}`}
							/>
							<Typography className="text-gray-700 text-sm capitalize">{key}</Typography>
						</Box>
						<Typography className="font-bold text-slate-900 text-sm">{value}</Typography>
					</Box>
				))}
			</Box>
		</Box>
	);
};
