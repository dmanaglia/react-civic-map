import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import type { District, State } from '../../../models/MapProps';
import type { Official } from '../../../models/OfficialProps';
import { useOfficialsData } from './useOfficialsData';

const mockFetch = vi.fn() as Mock;
globalThis.fetch = mockFetch;

describe('useOfficialsData', () => {
	let district: District;
	let state: State;
	let official: Official | null;

	const setOfficial = vi.fn((o: Official | null) => {
		official = o;
	});

	beforeEach(() => {
		vi.clearAllMocks();
		official = null;
		district = { ID: '1', TYPE: 'house' } as District;
		state = { USPS: 'CA', NAME: 'California' } as State;
	});

	it('fetches and sets the official', async () => {
		const mockData = { name: 'John Doe' };
		mockFetch.mockResolvedValueOnce({
			json: async () => mockData,
		});

		const { result } = renderHook(() => useOfficialsData({ district, state, setOfficial }));

		expect(result.current.loadingOfficial).toBe(true);

		// wait for async effect to finish
		await waitFor(() => expect(result.current.loadingOfficial).toBe(false));

		expect(setOfficial).toHaveBeenCalledWith(mockData);
		expect(official).toEqual(mockData);
	});

	it('handles fetch error', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Fetch failed'));

		const { result } = renderHook(() => useOfficialsData({ district, state, setOfficial }));

		expect(result.current.loadingOfficial).toBe(true);

		await waitFor(() => expect(result.current.loadingOfficial).toBe(false));

		expect(setOfficial).toHaveBeenCalledWith(null);
	});

	it('does nothing if district or state is null', () => {
		renderHook(() => useOfficialsData({ district: null, state, setOfficial }));

		expect(fetch).not.toHaveBeenCalled();
		expect(setOfficial).not.toHaveBeenCalled();
	});
});
