import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useMapContainerState } from '../hooks/useMapContainerState';

describe('useMapContainerState', () => {
	it('handleSetDistrict sets district and opens sidebar', () => {
		const { result } = renderHook(() => useMapContainerState());

		// sidebarOpen is initially true
		expect(result.current.sidebarOpenR).toBe(true);

		// Close sidebar first to test toggle
		act(() => result.current.toggleSidebarR());
		expect(result.current.sidebarOpenR).toBe(false);

		// Set district
		act(() => result.current.handleSetDistrict({ TYPE: 'sldu', NAME: 'Mock', ID: '1' }));
		expect(result.current.district?.NAME).toBe('Mock');
		expect(result.current.sidebarOpenR).toBe(true); // should open automatically
	});

	it('handleSetState sets state, clears official, and opens sidebar', () => {
		const { result } = renderHook(() => useMapContainerState());

		// Set initial official
		act(() => result.current.setOfficial({ name: 'Jane Doe' }));

		act(() => result.current.handleSetState({ NAME: 'Alabama', STATEFP: 'AL', USPS: '01' }));
		expect(result.current.state?.NAME).toBe('Alabama');
		expect(result.current.official).toBeNull();
		expect(result.current.sidebarOpenR).toBe(true);
	});

	it('handleSetType resets district and official', () => {
		const { result } = renderHook(() => useMapContainerState());

		act(() => result.current.handleSetDistrict({ TYPE: 'sldl', NAME: 'Some Dist', ID: '01' }));
		act(() => result.current.setOfficial({ name: 'Someone' }));

		act(() => result.current.handleSetType('place'));
		expect(result.current.type).toBe('place');
		expect(result.current.district).toBeNull();
		expect(result.current.official).toBeNull();
	});

	it('toggleSidebar toggles the sidebarOpen state', () => {
		const { result } = renderHook(() => useMapContainerState());

		expect(result.current.sidebarOpenR).toBe(true);

		act(() => result.current.toggleSidebarR());
		expect(result.current.sidebarOpenR).toBe(false);

		act(() => result.current.toggleSidebarR());
		expect(result.current.sidebarOpenR).toBe(true);
	});

	// TODO: add test for left sidebar... or wait until it is moved to the right...
});
