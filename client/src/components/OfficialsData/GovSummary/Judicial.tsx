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
		<>
			<h4>Judicial Branch</h4>
			<p className="muted">Work in progress...</p>
		</>
	) : (
		<>
			{officials.map((official, index) => (
				<Representative key={index} official={official} state={state} district={district} />
			))}
		</>
	);
};
