import { renderHook, act } from '@testing-library/react';
import type { FeatureCollection } from 'geojson';
import React from 'react';
import type { District, State } from '../../../models/MapProps';
import { useDrawStates } from './useDrawStates';

describe('useDrawStates (renderHook)', () => {
	let svgRef: React.RefObject<SVGSVGElement>;
	let gStatesRef: React.RefObject<SVGGElement>;
	let applyCurrentTransform: () => void;
	let setDistrict: (feature: District | null) => void;
	let setState: (stateId: State | null) => void;
	let showTooltip: (text: string, x: number, y: number) => void;
	let hideTooltip: () => void;

	beforeEach(() => {
		svgRef = {
			current: document.createElement('svg') as unknown as SVGSVGElement,
		} as React.RefObject<SVGSVGElement>;
		gStatesRef = {
			current: document.createElement('g') as unknown as SVGGElement,
		} as React.RefObject<SVGGElement>;
		applyCurrentTransform = vi.fn();
		setDistrict = vi.fn();
		setState = vi.fn();
		showTooltip = vi.fn();
		hideTooltip = vi.fn();
	});

	it('does nothing if nationalMap is null', () => {
		renderHook(() =>
			useDrawStates({
				svgRef,
				gStatesRef,
				nationalMap: null,
				applyCurrentTransform,
				setState,
				setDistrict,
				showTooltip,
				hideTooltip,
			}),
		);

		expect(applyCurrentTransform).not.toHaveBeenCalled();
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
				svgRef,
				gStatesRef,
				nationalMap,
				applyCurrentTransform,
				setDistrict,
				setState,
				showTooltip,
				hideTooltip,
			}),
		);

		const path = gStatesRef.current.querySelector('path')!;
		expect(path).toBeTruthy();

		// simulate click
		act(() => {
			path.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		});
		expect(setState).toHaveBeenCalledWith({
			NAME: 'Alabama',
			STATEFP: '01',
			USPS: 'AL',
			bounds: [
				[Infinity, Infinity],
				[-Infinity, -Infinity],
			],
		});
		expect(setDistrict).toHaveBeenCalledWith(null);

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

		expect(showTooltip).toHaveBeenCalledWith('Alabama', 10, 20);
		expect(showTooltip).toHaveBeenCalledWith('Alabama', 30, 40);
		expect(hideTooltip).toHaveBeenCalled();
		expect(applyCurrentTransform).toHaveBeenCalled();
	});

	it('appends a <g> to svg if gStatesRef.current is null', () => {
		const nullgStatesRef = {
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
				svgRef,
				gStatesRef: nullgStatesRef,
				nationalMap,
				applyCurrentTransform,
				setDistrict,
				setState,
				showTooltip,
				hideTooltip,
			}),
		);

		// the <g> should have been appended to svg
		const appendedG = svgRef.current.querySelector('g');
		expect(appendedG).toBeTruthy();
	});
});
