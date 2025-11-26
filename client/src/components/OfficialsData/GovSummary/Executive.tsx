import { Box, Typography } from '@mui/material';
import type { District, MapType, State } from '../../../models/MapProps';
import type { Official } from '../../../models/OfficialProps';
import { Representative } from '../Representative';

interface ExecutiveProps {
	officials: Official[];
	type: MapType;
	state: State | null;
	district: District | null;
}

export const Executive = ({ officials, state, district }: ExecutiveProps) => {
	return !officials.length ? (
		<Box className="text-center py-6">
			<Typography variant="h6" className="font-semibold text-foreground mb-1">
				Executive Branch
			</Typography>
			<Typography variant="body2" className="text-foreground">
				Work in progress…
			</Typography>
		</Box>
	) : (
		<>
			{officials.map((official, index) => (
				<Representative key={index} official={official} state={state} district={district} />
			))}
		</>
	);
};
