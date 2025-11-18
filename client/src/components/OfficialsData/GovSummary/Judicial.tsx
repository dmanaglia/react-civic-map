import { Box, Typography } from '@mui/material';
import type { District, MapType, State } from '../../../models/MapProps';
import type { Official } from '../../../models/OfficialProps';
import { Representative } from '../Representative';

interface JudicialProps {
	officials: Official[];
	type: MapType;
	state: State | null;
	district: District | null;
}

export const Judicial = ({ officials, state, district }: JudicialProps) => {
	return !officials.length ? (
		<Box className="text-center py-6">
			<Typography variant="h6" className="font-semibold text-gray-900 mb-1">
				Judicial Branch
			</Typography>
			<Typography variant="body2" className="text-gray-500">
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
