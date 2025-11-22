import type { AddressOfficials } from '../../../models/OfficialProps';
import { Representative } from '../Representative';
import { AddressInput } from './AddressInput';

interface AddressLookupSidebarProps {
	findOfficials: (address: string) => Promise<void>;
	officialList: AddressOfficials | null;
}

export const AddressLookupSidebar = ({
	findOfficials,
	officialList,
}: AddressLookupSidebarProps) => {
	console.log(officialList?.senators);
	return (
		<>
			<AddressInput findOfficials={findOfficials} />
			{officialList && (
				<div className="p-3">
					<h2 className="text-l font-semibold">Senators:</h2>
					<Representative state={null} district={null} official={officialList.senators[0]} />
					<Representative state={null} district={null} official={officialList.senators[1]} />
					<h2 className="text-l font-semibold">Federal House Representative:</h2>
					<Representative
						state={null}
						district={null}
						official={officialList.congressional.official}
					/>
					<h2 className="text-l font-semibold">State Senate Representative:</h2>
					<Representative state={null} district={null} official={officialList.senate.official} />
					<h2 className="text-l font-semibold">State House Representative:</h2>
					<Representative state={null} district={null} official={officialList.house.official} />
				</div>
			)}
		</>
	);
};
