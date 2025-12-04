import { renderHook, act } from '@testing-library/react';
import * as d3 from 'd3';
import type { FeatureCollection } from 'geojson';
import React from 'react';
import { vi, type Mock } from 'vitest';
import type { District, State } from '../../../models/MapProps';
import { useDrawStates } from './useDrawStates';

describe('useDrawStates (renderHook)', () => {
	let gStatesRef: React.RefObject<SVGGElement>;
	let pathGenerator: d3.GeoPath<unknown, d3.GeoPermissibleObjects>;
	let setDistrict: Mock<(feature: District | null) => void>;
	let setState: Mock<(stateId: State | null) => void>;
	let showTooltip: Mock<(text: string, x: number, y: number) => void>;
	let hideTooltip: Mock<() => void>;

	beforeEach(() => {
		gStatesRef = {
			current: document.createElement('g') as unknown as SVGGElement,
		} as React.RefObject<SVGGElement>;

		pathGenerator = d3.geoPath();
		setDistrict = vi.fn();
		setState = vi.fn();
		showTooltip = vi.fn();
		hideTooltip = vi.fn();
	});

	it('does nothing if nationalMap is null', () => {
		renderHook(() =>
			useDrawStates({
				gStatesRef,
				nationalMap: null,
				pathGenerator,
				setState,
				setDistrict,
				showTooltip,
				hideTooltip,
			}),
		);

		// Nothing should be added to gStatesRef
		expect(gStatesRef.current!.querySelector('path')).toBeNull();
	});

	it('renders paths and responds to events', () => {
		const nationalMap: FeatureCollection = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: { NAME: 'Alabama', STATEFP: '01', STUSPS: 'AL' },
					geometry: {
						type: 'Polygon',
						coordinates: [
							[
								[0, 0],
								[0, 1],
								[1, 1],
								[1, 0],
								[0, 0],
							],
						],
					},
				},
			],
		};

		renderHook(() =>
			useDrawStates({
				gStatesRef,
				nationalMap,
				pathGenerator,
				setState,
				setDistrict,
				showTooltip,
				hideTooltip,
			}),
		);

		const path = gStatesRef.current!.querySelector('path')!;
		expect(path).toBeTruthy();

		// simulate click
		act(() => {
			path.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		expect(setState).toHaveBeenCalledTimes(1);
		const calledWith = setState.mock.calls[0][0];

		expect(calledWith?.NAME).toBe('Alabama');
		expect(calledWith?.STATEFP).toBe('01');
		expect(calledWith?.USPS).toBe('AL');
		expect(Array.isArray(calledWith?.bounds)).toBe(true);

		expect(setDistrict).toHaveBeenCalledWith(null);

		// simulate mouse events
		act(() => {
			const mouseOver = new MouseEvent('mouseover', { bubbles: true });
			Object.defineProperty(mouseOver, 'pageX', { value: 10 });
			Object.defineProperty(mouseOver, 'pageY', { value: 20 });
			path.dispatchEvent(mouseOver);

			const mouseMove = new MouseEvent('mousemove', { bubbles: true });
			Object.defineProperty(mouseMove, 'pageX', { value: 30 });
			Object.defineProperty(mouseMove, 'pageY', { value: 40 });
			path.dispatchEvent(mouseMove);

			const mouseOut = new MouseEvent('mouseout', { bubbles: true });
			path.dispatchEvent(mouseOut);
		});

		expect(showTooltip).toHaveBeenCalledWith('Alabama', 10, 20);
		expect(showTooltip).toHaveBeenCalledWith('Alabama', 30, 40);
		expect(hideTooltip).toHaveBeenCalled();
	});

	it('does nothing if gStatesRef.current is null', () => {
		const nullRef = {
			current: null,
		} as React.RefObject<SVGGElement | null>;

		const nationalMap: FeatureCollection = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: { NAME: 'Alaska', STATEFP: '02', STUSPS: 'AK' },
					geometry: {
						type: 'Polygon',
						coordinates: [
							[
								[0, 0],
								[0, 1],
								[1, 1],
								[1, 0],
								[0, 0],
							],
						],
					},
				},
			],
		};

		renderHook(() =>
			useDrawStates({
				gStatesRef: nullRef,
				nationalMap,
				pathGenerator,
				setDistrict,
				setState,
				showTooltip,
				hideTooltip,
			}),
		);

		// Just ensure no errors and no DOM updates attempted
		expect(setState).not.toHaveBeenCalled();
	});
});
