import { Person } from '@mui/icons-material';
import { Card, CardContent, Typography } from '@mui/material';
import { useState } from 'react';
import type { District, State } from '../../models/MapProps';
import type { Official } from '../../models/OfficialProps';

interface RepresentativeProps {
	official: Official;
	state: State | null;
	district: District | null;
	setOfficial: (official: Official | null) => void;
}

export const Representative = ({ official, setOfficial, state }: RepresentativeProps) => {
	const [imgError, setImgError] = useState(false);

	const fetchFEC = () => {
		setOfficial({ ...official, stateUSPS: state?.USPS });
		const targetElement = document.getElementById('FEC-info');
		if (targetElement) {
			const elementPosition = targetElement.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.pageYOffset - 75;

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth',
			});
		}
	};

	return (
		<Card
			className="flex items-center gap-4 p-3 shadow-sm border-b mb-4 last:mb-0 cursor-pointer"
			onClick={fetchFEC}
		>
			{imgError ? (
				<div className="w-28 h-36 rounded-xl  flex items-center justify-center">
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
				{official.title && (
					<Typography variant="body1" component="h4" className="leading-tight">
						{official.title}
					</Typography>
				)}

				{/* @ts-expect-error need to adjust the official object to include title on the backend */}
				{!official.title && official?.metadata?.current_role?.title && (
					<Typography variant="body1" component="h4" className="leading-tight">
						{/* @ts-expect-error need to adjust the official object to include title on the backend */}
						{official?.metadata?.current_role?.title}
					</Typography>
				)}

				<Typography variant="h6" component="h4" className="leading-tight">
					{official.name}
				</Typography>

				{official.party && (
					<Typography variant="body2" className="mt-1 font-medium">
						{official.party}
					</Typography>
				)}
			</CardContent>
		</Card>
	);
};
