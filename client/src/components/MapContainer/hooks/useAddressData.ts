import { useState } from 'react';
import type { AddressOfficials } from '../../../models/OfficialProps';

export const useAddressData = () => {
	const [officialList, setOfficialList] = useState<AddressOfficials | null>(null);
	const [loadingAddressOfficials, setLoading] = useState<boolean>(false);

	const findOfficials = async (address: string) => {
		setLoading(true);
		try {
			const res = await fetch(`http://localhost:8000/official/${address}`);
			const data = await res.json();
			setOfficialList(data);
			console.log(data);
		} catch (err) {
			setOfficialList(null);
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return { officialList, loadingAddressOfficials, findOfficials };
};
