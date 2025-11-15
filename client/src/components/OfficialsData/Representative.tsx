import type { District, State } from '../../models/MapProps';
import type { Official } from '../../models/OfficialProps';

interface RepresentativeProps {
	official: Official;
	state: State | null;
	district: District | null;
}

export const Representative = ({ official }: RepresentativeProps) => {
	return (
		<div className="official-row">
			<img className="official-photo" src={official.depiction_url} alt={official.name} />

			<div className="official-info">
				<h2 className="official-name">{official.name}</h2>
				{official.party && <small className="official-party">{official.party}</small>}
			</div>
		</div>
	);
};
