import { Button, TextField } from '@mui/material';
import { useState, type ChangeEventHandler } from 'react';

interface AddressInputProps {
	findOfficials: (address: string) => Promise<void>;
}

export const AddressInput = ({ findOfficials }: AddressInputProps) => {
	const [address, setAddress] = useState<string>('');

	const updateAddress: ChangeEventHandler<HTMLInputElement> = (event) => {
		setAddress(event.target.value);
	};

	const submit = () => {
		if (address) findOfficials(address);
	};

	return (
		<div className="p-3 flex flex-col">
			<TextField variant="standard" value={address} onChange={updateAddress} />
			<Button onClick={submit}>Submit</Button>
		</div>
	);
};
