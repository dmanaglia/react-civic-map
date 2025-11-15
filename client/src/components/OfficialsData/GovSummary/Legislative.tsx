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

	const data = useMemo(() => {
		if (!summary) return null;
		return activeChamber === 'House'
			? (summary.legislative.house as Chamber)
			: (summary.legislative.senate as Chamber);
	}, [summary, activeChamber]);

	if (!data) {
		return <div className="empty-state">No legislative data available.</div>;
	}
	return (
		<div className="legislative">
			<div className="subtabs">
				<button
					className={`subtab ${activeChamber === 'House' ? 'active' : ''}`}
					onClick={() => setActiveChamber('House')}
					aria-pressed={activeChamber === 'House'}
				>
					House
				</button>
				<button
					className={`subtab ${activeChamber === 'Senate' ? 'active' : ''}`}
					onClick={() => setActiveChamber('Senate')}
					aria-pressed={activeChamber === 'Senate'}
				>
					{type === 'cd' && state ? 'Senators' : 'Senate'}
				</button>
			</div>

			{type === 'cd' && fedReps ? (
				<>
					{activeChamber === 'House' ? (
						<div className="leg-body">
							<div className="leg-left">
								<ChamberSummary chamber={fedReps.house} />
							</div>
						</div>
					) : (
						<>
							{fedReps.senators.map((official) => (
								<Representative official={official} state={state} district={district} />
							))}
						</>
					)}
				</>
			) : (
				<div className="leg-body">
					<div className="leg-left">
						<ChamberSummary chamber={data} />
					</div>
				</div>
			)}
		</div>
	);
};
