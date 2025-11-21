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
		findOfficials(address);
	};

	return (
		<>
			<TextField variant="standard" value={address} onChange={updateAddress} />
			<Button onClick={submit}>Submit</Button>
		</>
	);
};
