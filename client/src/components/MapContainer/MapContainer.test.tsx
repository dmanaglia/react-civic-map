import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MapContainer } from './MapContainer';

describe('MapContainer', () => {
	// --- Mock child components so we don't need their implementations ---
	vi.mock('../MapHeader', () => ({
		MapHeader: () => <div data-testid="map-header">MapHeader</div>,
	}));

	vi.mock('../UsMap/UsMap', () => ({
		UsMap: () => <div data-testid="us-map">UsMap</div>,
	}));

	vi.mock('../OfficialsData/OfficialSidebar', () => ({
		OfficialSidebar: () => <div data-testid="sidebar">Sidebar</div>,
	}));

	vi.mock('../Spinner', () => ({
		Spinner: () => <div data-testid="spinner">Spinner</div>,
	}));

	// --- Mock hooks used inside the component ---
	vi.mock('./hooks/useGeoData', () => ({
		useGeoData: () => ({
			nationalMap: { fake: true }, // makes the <main> content render
			districtMap: null,
			summary: null,
			loadingMap: true, // makes the <spinner> content render
		}),
	}));

	vi.mock('../hooks/useOfficialsData', () => ({
		useOfficialsData: () => ({
			official: null,
			setOfficial: vi.fn(),
			loadingOfficial: false,
		}),
	}));

	it('renders the map header and map content', () => {
		render(<MapContainer />);

		// Header always shows
		expect(screen.getByTestId('map-header')).toBeInTheDocument();
		expect(screen.getByTestId('us-map')).toBeInTheDocument();
		expect(screen.getByTestId('sidebar')).toBeInTheDocument();
		expect(screen.getByTestId('spinner')).toBeInTheDocument();
	});
});
