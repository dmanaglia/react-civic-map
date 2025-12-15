import type { AddressOfficials, Official } from '../../../models/OfficialProps';
import { Representative } from '../Representative';
import { AddressInput } from './AddressInput';

interface AddressLookupSidebarProps {
	findOfficials: (address: string) => Promise<void>;
	officialList: AddressOfficials | null;
	setOfficial: (official: Official | null) => void;
}

export const AddressLookupSidebar = ({
	findOfficials,
	officialList,
	setOfficial,
}: AddressLookupSidebarProps) => {
	return (
		<>
			<AddressInput findOfficials={findOfficials} />
			{officialList && (
				<div className="p-3">
					<h2 className="text-l font-semibold">Senators:</h2>
					<Representative
						state={null}
						district={null}
						official={officialList.senators[0]}
						setOfficial={setOfficial}
					/>
					<Representative
						state={null}
						district={null}
						official={officialList.senators[1]}
						setOfficial={setOfficial}
					/>
					<h2 className="text-l font-semibold">Federal House Representative:</h2>
					<Representative
						state={null}
						district={null}
						official={officialList.congressional.official}
						setOfficial={setOfficial}
					/>
					<h2 className="text-l font-semibold">State Senate Representative:</h2>
					<Representative
						state={null}
						district={null}
						official={officialList.senate.official}
						setOfficial={setOfficial}
					/>
					<h2 className="text-l font-semibold">State House Representative:</h2>
					<Representative
						state={null}
						district={null}
						official={officialList.house.official}
						setOfficial={setOfficial}
					/>
				</div>
			)}
		</>
	);
};
