import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import type { MapType } from '../../models/MapProps';
import { UsMap } from './UsMap';

// Mock children so we can detect which one renders
vi.mock('./LeafletMapMode/LeafletMap', () => ({
	LeafletMap: () => <div data-testid="leaflet-map" />,
}));
vi.mock('./SvgMapMode/SvgMap', () => ({
	SvgMap: () => <div data-testid="svg-map" />,
}));

// Mock Settings Context hook
const mockUseSettings = vi.fn();
vi.mock('../../context/SettingsContext', () => ({
	UseSettings: () => mockUseSettings(),
}));

const baseProps = {
	officialList: null,
	districtMap: null,
	nationalMap: null,
	type: 'cd' as MapType,
	sidebarType: 'summary' as 'summary' | 'address',
	state: null,
	district: null,
	setState: () => {},
	setDistrict: () => {},
};

describe('<UsMap />', () => {
	it('renders LeafletMap when backdropEnabled = true', () => {
		mockUseSettings.mockReturnValue({ backdropEnabled: true });

		render(<UsMap {...baseProps} />);

		expect(screen.getByTestId('leaflet-map')).toBeInTheDocument();
		expect(screen.queryByTestId('svg-map')).not.toBeInTheDocument();
	});

	it('renders SvgMap when backdropEnabled = false', () => {
		mockUseSettings.mockReturnValue({ backdropEnabled: false });

		render(<UsMap {...baseProps} />);

		expect(screen.getByTestId('svg-map')).toBeInTheDocument();
		expect(screen.queryByTestId('leaflet-map')).not.toBeInTheDocument();
	});
});
