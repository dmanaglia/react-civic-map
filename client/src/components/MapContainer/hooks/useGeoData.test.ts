import { renderHook } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import type { FeatureCollection } from 'geojson';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import type { Mock } from 'vitest';
import type {
	State,
	FederalResponse,
	StateResponse,
	StateSummary,
	FederalSummary,
} from '../../../models/MapProps';
import { useGeoData } from './useGeoData';

describe('useGeoData', () => {
	const mockState: State = { STATEFP: '06', USPS: 'CA', NAME: 'California' } as State;

	let mockFetch: Mock;

	beforeEach(() => {
		vi.clearAllMocks();
		mockFetch = vi.fn();
		globalThis.fetch = mockFetch as unknown as typeof fetch;
	});

	it('fetches state data when state is provided', async () => {
		const mockDistrictMap: FeatureCollection = { type: 'FeatureCollection', features: [] };
		const mockSummary: StateSummary = {
			executive: [],
			judicial: [],
			legislative: {
				house: {
					seats: 0,
					democrat: 0,
					republican: 0,
					independent: 0,
					other: 0,
					vacant: 0,
				},
				senate: {
					seats: 0,
					democrat: 0,
					republican: 0,
					independent: 0,
					other: 0,
					vacant: 0,
				},
			},
			federal: {
				senators: [],
				house: {
					seats: 0,
					democrat: 0,
					republican: 0,
					independent: 0,
					other: 0,
					vacant: 0,
				},
			},
		};
		const mockStateResponse: StateResponse = { map: mockDistrictMap, summary: mockSummary };

		mockFetch.mockResolvedValueOnce({
			json: async () => mockStateResponse,
		});

		const { result } = renderHook(() => useGeoData('sldl', mockState));

		// loadingMap should start as true inside fetch
		await waitFor(() => expect(result.current.loadingMap).toBe(false));

		expect(result.current.districtMap).toEqual(mockDistrictMap);
		expect(result.current.summary).toEqual(mockSummary);
		expect(result.current.nationalMap).toBeNull();
		expect(mockFetch).toHaveBeenCalledTimes(1);
		expect(mockFetch).toHaveBeenCalledWith(
			`http://localhost:8000/geojson/sldl/${mockState.STATEFP}?stateUSPS=${mockState.USPS}`,
		);
	});

	it('fetches federal data when state is null', async () => {
		const mockNationalMap: FeatureCollection = { type: 'FeatureCollection', features: [] };
		const mockSummary: FederalSummary = {
			executive: [],
			judicial: [],
			legislative: {
				house: {
					seats: 0,
					democrat: 0,
					republican: 0,
					independent: 0,
					other: 0,
					vacant: 0,
				},
				senate: {
					seats: 0,
					democrat: 0,
					republican: 0,
					independent: 0,
					other: 0,
					vacant: 0,
				},
			},
		};
		const mockFederalResponse: FederalResponse = { map: mockNationalMap, summary: mockSummary };

		mockFetch.mockResolvedValueOnce({
			json: async () => mockFederalResponse,
		});

		const { result } = renderHook(() => useGeoData('cd', null));

		await waitFor(() => expect(result.current.loadingMap).toBe(false));

		expect(result.current.nationalMap).toEqual(mockNationalMap);
		expect(result.current.summary).toEqual(mockSummary);
		expect(result.current.districtMap).toBeNull();
		expect(mockFetch).toHaveBeenCalledTimes(1);
		expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/geojson/states');
	});

	it('handles fetch error gracefully on state call', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Fetch failed'));

		const { result } = renderHook(() => useGeoData('sldu', mockState));

		await waitFor(() => expect(result.current.loadingMap).toBe(false));

		expect(result.current.districtMap).toBeNull();
		expect(result.current.summary).toBeNull();
		expect(result.current.nationalMap).toBeNull();
		expect(mockFetch).toHaveBeenCalledTimes(1);
		expect(mockFetch).toHaveBeenCalledWith(
			`http://localhost:8000/geojson/sldu/${mockState.STATEFP}?stateUSPS=${mockState.USPS}`,
		);
	});

	it('handles fetch error gracefully on federal call', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Fetch failed'));

		const { result } = renderHook(() => useGeoData('cd', null));

		await waitFor(() => expect(result.current.loadingMap).toBe(false));

		expect(result.current.districtMap).toBeNull();
		expect(result.current.summary).toBeNull();
		expect(result.current.nationalMap).toBeNull();
		expect(mockFetch).toHaveBeenCalledTimes(1);
		expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/geojson/states');
	});
});
