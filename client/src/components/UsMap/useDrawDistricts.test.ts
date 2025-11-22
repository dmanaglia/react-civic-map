import { renderHook, act } from '@testing-library/react';
import type { FeatureCollection } from 'geojson';
import React from 'react';
import type { District } from '../../models/MapProps';
import { useDrawDistricts } from './useDrawDistricts';

vi.mock('./getDistrictClass', () => ({
	getDistrictClass: vi.fn(() => 'mock-class'),
}));

describe('useDrawDistricts (renderHook)', () => {
	let svgRef: React.RefObject<SVGSVGElement>;
	let gDistrictRef: React.RefObject<SVGGElement>;
	let zoomToBounds: (
		bounds: [[number, number], [number, number]],
		width: number,
		height: number,
	) => void;
	let applyCurrentTransform: () => void;
	let setDistrict: (feature: District | null) => void;
	let showTooltip: (text: string, x: number, y: number) => void;
	let hideTooltip: () => void;

	beforeEach(() => {
		svgRef = {
			current: document.createElement('svg') as unknown as SVGSVGElement,
		} as React.RefObject<SVGSVGElement>;
		gDistrictRef = {
			current: document.createElement('g') as unknown as SVGGElement,
		} as React.RefObject<SVGGElement>;
		zoomToBounds = vi.fn();
		applyCurrentTransform = vi.fn();
		setDistrict = vi.fn();
		showTooltip = vi.fn();
		hideTooltip = vi.fn();
	});

	it('does nothing if districtMap is null', () => {
		renderHook(() =>
			useDrawDistricts({
				svgRef,
				gDistrictRef,
				districtMap: null,
				type: 'cd',
				sidebarType: 'summary',
				zoomToBounds,
				applyCurrentTransform,
				setDistrict,
				showTooltip,
				hideTooltip,
			}),
		);

		expect(applyCurrentTransform).not.toHaveBeenCalled();
	});

	it('renders paths and responds to events', () => {
		const districtMap: FeatureCollection = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: { party: 'Democratic', NAMELSAD: 'District 1', CD119FP: '01' },
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
			useDrawDistricts({
				svgRef,
				gDistrictRef,
				districtMap,
				type: 'cd',
				sidebarType: 'summary',
				zoomToBounds,
				applyCurrentTransform,
				setDistrict,
				showTooltip,
				hideTooltip,
			}),
		);

		const path = gDistrictRef.current.querySelector('path')!;
		expect(path).toBeTruthy();
		expect(path.getAttribute('class')).toBe('mock-class');

		// simulate click
		act(() => {
			path.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});
		expect(setDistrict).toHaveBeenCalledWith({
			TYPE: 'cd',
			NAME: 'District 1',
			ID: '01',
		});
		expect(zoomToBounds).toHaveBeenCalled();

		// simulate mouseover / mousemove
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

		expect(showTooltip).toHaveBeenCalledWith('District 1', 10, 20);
		expect(showTooltip).toHaveBeenCalledWith('District 1', 30, 40);
		expect(hideTooltip).toHaveBeenCalled();
		expect(applyCurrentTransform).toHaveBeenCalled();
	});

	it('appends a <g> to svg if gDistrictRef.current is null', () => {
		const nullgDistrictRef = {
			current: null,
		} as React.RefObject<SVGGElement | null>;

		const districtMap: FeatureCollection = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: { party: 'Democratic', NAMELSAD: 'District 1', CD119FP: '01' },
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
			useDrawDistricts({
				svgRef,
				gDistrictRef: nullgDistrictRef,
				districtMap,
				type: 'cd',
				sidebarType: 'summary',
				zoomToBounds,
				applyCurrentTransform,
				setDistrict,
				showTooltip,
				hideTooltip,
			}),
		);

		// the <g> should have been appended to svg
		const appendedG = svgRef.current.querySelector('g');
		expect(appendedG).toBeTruthy();
	});

	it('renders paths and responds to events with non congressional districts', () => {
		const districtMap: FeatureCollection = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: { party: 'Democratic', NAME: '1', NAMELSAD: 'State House District 1' },
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
			useDrawDistricts({
				svgRef,
				gDistrictRef,
				districtMap,
				type: 'sldl',
				sidebarType: 'summary',
				zoomToBounds,
				applyCurrentTransform,
				setDistrict,
				showTooltip,
				hideTooltip,
			}),
		);

		const path = gDistrictRef.current.querySelector('path')!;
		expect(path).toBeTruthy();
		expect(path.getAttribute('class')).toBe('mock-class');

		// simulate click
		act(() => {
			path.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});
		expect(setDistrict).toHaveBeenCalledWith({
			TYPE: 'sldl',
			NAME: 'State House District 1',
			ID: '1',
		});
		expect(zoomToBounds).toHaveBeenCalled();

		// simulate mouseover / mousemove
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

		expect(showTooltip).toHaveBeenCalledWith('State House District 1', 10, 20);
		expect(showTooltip).toHaveBeenCalledWith('State House District 1', 30, 40);
		expect(hideTooltip).toHaveBeenCalled();
		expect(applyCurrentTransform).toHaveBeenCalled();
	});
});
