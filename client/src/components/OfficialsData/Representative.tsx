import { Card, CardContent, Typography } from '@mui/material';
import type { District, State } from '../../models/MapProps';
import type { Official } from '../../models/OfficialProps';

interface RepresentativeProps {
	official: Official;
	state: State | null;
	district: District | null;
}

export const Representative = ({ official }: RepresentativeProps) => {
	return (
		<Card className="flex items-center gap-4 p-3 shadow-sm border-b border-gray-200 mb-4 last:mb-0">
			<img
				src={official.depiction_url}
				alt={official.name}
				className="w-28 h-36 rounded-xl object-cover shrink-0"
			/>

			<CardContent className="p-0 flex flex-col">
				<Typography variant="h6" component="h2" className="text-gray-900 leading-tight">
					{official.name}
				</Typography>

				{official.party && (
					<Typography variant="body2" className="mt-1 text-gray-500 font-medium">
						{official.party}
					</Typography>
				)}
			</CardContent>
		</Card>
	);
};
