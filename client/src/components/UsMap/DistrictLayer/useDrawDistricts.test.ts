import { renderHook, act } from '@testing-library/react';
import * as d3 from 'd3';
import type { FeatureCollection } from 'geojson';
import React from 'react';
import type { Mock } from 'vitest';
import type { District } from '../../../models/MapProps';
import { useDrawDistricts } from './useDrawDistricts';

vi.mock('../utils/getDistrictClass', () => ({
	getDistrictClass: vi.fn(() => 'district-class'),
}));

describe('useDrawDistricts (renderHook)', () => {
	let gDistrictRef: React.RefObject<SVGGElement>;
	let pathGenerator: d3.GeoPath<unknown, d3.GeoPermissibleObjects>;
	let setDistrict: Mock<(district: District | null) => void>;
	let showTooltip: Mock<(text: string, x: number, y: number) => void>;
	let hideTooltip: Mock<() => void>;

	const baseDistrictMap: FeatureCollection = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				properties: {
					NAMELSAD: 'District 1',
					party: 'R',
					CD119FP: '01',
				},
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

	beforeEach(() => {
		gDistrictRef = {
			current: document.createElement('g') as unknown as SVGGElement,
		} as React.RefObject<SVGGElement>;

		pathGenerator = d3.geoPath();
		setDistrict = vi.fn();
		showTooltip = vi.fn();
		hideTooltip = vi.fn();
	});

	it('does nothing if districtMap is null', () => {
		renderHook(() =>
			useDrawDistricts({
				gDistrictRef,
				districtMap: null,
				pathGenerator,
				type: 'cd',
				sidebarType: 'summary',
				setDistrict,
				showTooltip,
				hideTooltip,
			}),
		);

		expect(gDistrictRef.current!.querySelector('path')).toBeNull();
	});

	it('clears existing elements when sidebarType !== summary', () => {
		// Add a dummy element to ensure clear behavior
		gDistrictRef.current!.appendChild(document.createElement('path'));

		renderHook(() =>
			useDrawDistricts({
				gDistrictRef,
				districtMap: baseDistrictMap,
				pathGenerator,
				type: 'cd',
				sidebarType: 'address',
				setDistrict,
				showTooltip,
				hideTooltip,
			}),
		);

		expect(gDistrictRef.current!.children.length).toBe(0);
	});

	it('renders district paths and handles events', () => {
		renderHook(() =>
			useDrawDistricts({
				gDistrictRef,
				districtMap: baseDistrictMap,
				pathGenerator,
				type: 'cd',
				sidebarType: 'summary',
				setDistrict,
				showTooltip,
				hideTooltip,
			}),
		);

		const path = gDistrictRef.current!.querySelector('path')!;
		expect(path).toBeTruthy();

		// CLICK
		act(() => {
			path.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});

		expect(setDistrict).toHaveBeenCalledTimes(1);
		const calledWith = setDistrict.mock.calls[0][0];

		expect(calledWith?.NAME).toBe('District 1');
		expect(calledWith?.ID).toBe('01'); // cd uses CD119FP
		expect(calledWith?.TYPE).toBe('cd');
		expect(Array.isArray(calledWith?.bounds)).toBe(true);

		// MOUSE EVENTS
		act(() => {
			const over = new MouseEvent('mouseover', { bubbles: true });
			Object.defineProperty(over, 'pageX', { value: 15 });
			Object.defineProperty(over, 'pageY', { value: 25 });
			path.dispatchEvent(over);

			const move = new MouseEvent('mousemove', { bubbles: true });
			Object.defineProperty(move, 'pageX', { value: 30 });
			Object.defineProperty(move, 'pageY', { value: 40 });
			path.dispatchEvent(move);

			path.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
		});

		expect(showTooltip).toHaveBeenCalledWith('District 1', 15, 25);
		expect(showTooltip).toHaveBeenCalledWith('District 1', 30, 40);
		expect(hideTooltip).toHaveBeenCalled();
	});

	it('does nothing if gDistrictRef.current is null', () => {
		const nullRef = {
			current: null,
		} as React.RefObject<SVGGElement | null>;

		renderHook(() =>
			useDrawDistricts({
				gDistrictRef: nullRef,
				districtMap: baseDistrictMap,
				pathGenerator,
				type: 'cd',
				sidebarType: 'summary',
				setDistrict,
				showTooltip,
				hideTooltip,
			}),
		);

		expect(setDistrict).not.toHaveBeenCalled();
	});
});
