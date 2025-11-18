import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import type {
	District,
	FederalSummary,
	MapType,
	StateSummary,
	State,
} from '../../../models/MapProps';
import { Executive } from './Executive';
import { Judicial } from './Judicial';
import { Legislative } from './Legislative';

interface GovSummaryDataProps {
	summary: FederalSummary | StateSummary;
	type: MapType;
	state: State | null;
	district: District | null;
}

export const GovSummary = ({ summary, type, state, district }: GovSummaryDataProps) => {
	const [activeBranch, setActiveBranch] = useState<'Legislative' | 'Executive' | 'Judicial'>(
		'Legislative',
	);

	const showBranches = (state && type !== 'cd') || !state;

	const handleChange = (_: React.SyntheticEvent, value: typeof activeBranch) => {
		setActiveBranch(value);
	};

	return (
		<div className="p-3 text-gray-800 font-sans">
			{showBranches && (
				<Tabs
					value={activeBranch}
					onChange={handleChange}
					aria-label="Branches of Government"
					variant="fullWidth"
					textColor="primary"
					indicatorColor="primary"
					className="border-b border-gray-200 mb-3"
				>
					<Tab label="Executive" value="Executive" className="font-semibold normal-case" />
					<Tab label="Legislative" value="Legislative" className="font-semibold normal-case" />
					<Tab label="Judicial" value="Judicial" className="font-semibold normal-case" />
				</Tabs>
			)}

			<div className="branch-content">
				{activeBranch === 'Legislative' && (
					<Legislative type={type} summary={summary} state={state} district={district} />
				)}
				{activeBranch === 'Executive' && (
					<Executive officials={summary.executive} type={type} state={state} district={district} />
				)}
				{activeBranch === 'Judicial' && (
					<Judicial officials={summary.judicial} type={type} state={state} district={district} />
				)}
			</div>
		</div>
	);
};
