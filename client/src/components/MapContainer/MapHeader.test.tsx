import { render, screen, fireEvent } from '@testing-library/react';
import { MapHeader } from './MapHeader';

describe('MapHeader', () => {
	const featureLabels = [
		'Counties',
		'State House',
		'State Senate',
		'Congressional Districts',
		'City Boundaries',
		'County Subdivisions',
	];

	it('renders all chips with correct labels', () => {
		render(<MapHeader type="county" setType={() => {}} />);

		for (const label of featureLabels) {
			expect(screen.getByText(label)).toBeInTheDocument();
		}
	});

	it('marks the selected chip with variant="filled"', () => {
		render(<MapHeader type="sldl" setType={() => {}} />);

		// MUI Chip renders variant onto a class: MuiChip-filled or MuiChip-outlined
		const activeChip = screen.getByText('State House');
		expect(activeChip.parentElement).toHaveClass('MuiChip-filled');
	});

	it('marks non-selected chips with variant="outlined"', () => {
		render(<MapHeader type="county" setType={() => {}} />);

		const senateChip = screen.getByText('State Senate');
		expect(senateChip.parentElement).toHaveClass('MuiChip-outlined');
	});

	it('calls setType when a chip is clicked', () => {
		const mockSetType = vi.fn();
		render(<MapHeader type="county" setType={mockSetType} />);

		const chip = screen.getByText('State Senate');
		fireEvent.click(chip);

		expect(mockSetType).toHaveBeenCalledWith('sldu');
	});
});
