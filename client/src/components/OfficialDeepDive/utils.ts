export const formatCurrency = (value: number) =>
	value.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
	});

export function formatName(name: string): string {
	const parts = name.split(',').map((part) => part.trim());

	if (parts.length !== 2) {
		return name;
	}

	const [lastName, firstAndMiddle] = parts;

	return `${firstAndMiddle} ${lastName}`;
}
