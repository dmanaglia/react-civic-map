import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import type {
	District,
	FederalSummary,
	MapType,
	StateSummary,
	State,
} from '../../../models/MapProps';
import type { Official } from '../../../models/OfficialProps';
import { Representative } from '../Representative';
import { Executive } from './Executive/Executive';
import { Judicial } from './Judicial/Judicial';
import { Legislative } from './Legislative/Legislative';

interface GovSummaryDataProps {
	summary: FederalSummary | StateSummary | null;
	type: MapType;
	state: State | null;
	district: District | null;
	official: Official | null;
	handleSetType: (type: MapType) => void;
	setOfficial: (official: Official | null) => void;
}

export const GovSummary = ({
	summary,
	type,
	state,
	district,
	official,
	handleSetType,
	setOfficial,
}: GovSummaryDataProps) => {
	const [activeBranch, setActiveBranch] = useState<'Legislative' | 'Executive' | 'Judicial'>(
		'Legislative',
	);

	const showBranches = (state && type !== 'cd') || !state;

	const handleChange = (_: React.SyntheticEvent, value: typeof activeBranch) => {
		setActiveBranch(value);
	};

	return (
		<>
			{state && district && official ? (
				<div className="p-3">
					<Representative
						state={state}
						district={district}
						official={official}
						setOfficial={setOfficial}
					/>
				</div>
			) : (
				summary && (
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
								<Tab
									label="Legislative"
									value="Legislative"
									className="font-semibold normal-case"
								/>
								<Tab label="Judicial" value="Judicial" className="font-semibold normal-case" />
							</Tabs>
						)}

						<div>
							{activeBranch === 'Legislative' && (
								<Legislative
									type={type}
									summary={summary}
									state={state}
									district={district}
									handleSetType={handleSetType}
									setOfficial={setOfficial}
								/>
							)}
							{activeBranch === 'Executive' && (
								<Executive
									officials={summary.executive}
									type={type}
									state={state}
									district={district}
									setOfficial={setOfficial}
								/>
							)}
							{activeBranch === 'Judicial' && (
								<Judicial
									officials={summary.judicial}
									type={type}
									state={state}
									district={district}
								/>
							)}
						</div>
					</div>
				)
			)}
		</>
	);
};
