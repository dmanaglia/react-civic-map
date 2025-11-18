import { Person } from '@mui/icons-material';
import { Card, CardContent, Typography } from '@mui/material';
import { useState } from 'react';
import type { District, State } from '../../models/MapProps';
import type { Official } from '../../models/OfficialProps';

interface RepresentativeProps {
	official: Official;
	state: State | null;
	district: District | null;
}

export const Representative = ({ official }: RepresentativeProps) => {
	const [imgError, setImgError] = useState(false);

	return (
		<Card className="flex items-center gap-4 p-3 shadow-sm border-b border-gray-200 mb-4 last:mb-0">
			{imgError ? (
				<div className="w-28 h-36 rounded-xl bg-gray-200 flex items-center justify-center">
					<Person sx={{ fontSize: 48, opacity: 0.6 }} />
				</div>
			) : (
				<img
					src={official.depiction_url}
					alt={official.name}
					className="w-28 h-36 rounded-xl object-cover shrink-0"
					onError={() => setImgError(true)}
				/>
			)}
			<CardContent className="p-0 flex flex-col">
				<Typography variant="h6" component="h2" className="text-gray-900 leading-tight">
					{official.name}
				</Typography>

				{/* @ts-expect-error need to adjust the official object to include title on the backend */}
				{official?.metadata?.current_role?.title && (
					<Typography variant="body1" component="h4" className="text-gray-900 leading-tight">
						{/* @ts-expect-error need to adjust the official object to include title on the backend */}
						{official?.metadata?.current_role?.title}
					</Typography>
				)}

				{official.party && (
					<Typography variant="body2" className="mt-1 text-gray-500 font-medium">
						{official.party}
					</Typography>
				)}
			</CardContent>
		</Card>
	);
};
