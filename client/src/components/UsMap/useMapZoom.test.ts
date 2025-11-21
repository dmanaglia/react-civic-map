import { renderHook } from '@testing-library/react';
import type { ZoomTransform } from 'd3';
import { describe, it, expect } from 'vitest';
import { useMapZoom } from './useMapZoom';

function createSvgRefs() {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	const gStates = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	const gDistricts = document.createElementNS('http://www.w3.org/2000/svg', 'g');

	// Add paths to verify stroke-width logic
	const statePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	const districtPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

	gStates.appendChild(statePath);
	gDistricts.appendChild(districtPath);

	document.body.appendChild(svg);
	svg.appendChild(gStates);
	svg.appendChild(gDistricts);

	return {
		svgRef: { current: svg },
		gStatesRef: { current: gStates },
		gFeatureRef: { current: gDistricts },
	};
}

function makeG() {
	const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	g.appendChild(path);
	return { g, path };
}

describe('useMapZoom', () => {
	it('initializes without errors and returns API', () => {
		const refs = createSvgRefs();

		const { result } = renderHook(() => useMapZoom(refs.svgRef, refs.gStatesRef, refs.gFeatureRef));

		// returned API should exist
		expect(result.current).toHaveProperty('zoomTransformRef');
		expect(result.current).toHaveProperty('resetZoom');
		expect(result.current).toHaveProperty('zoomToBounds');
		expect(result.current).toHaveProperty('applyCurrentTransform');
	});

	it('returns early if any ref is null (effect does not crash)', () => {
		const svgRef = { current: null };
		const gStatesRef = { current: null };
		const gFeatureRef = { current: null };

		const { result } = renderHook(() => useMapZoom(svgRef, gStatesRef, gFeatureRef));

		// hook should still return its API
		expect(result.current).toHaveProperty('resetZoom');
		expect(result.current).toHaveProperty('zoomToBounds');
		expect(result.current).toHaveProperty('applyCurrentTransform');
		expect(result.current.zoomTransformRef.current).toBeNull();
	});

	it('applyCurrentTransform applies transform and stroke-width', () => {
		// setup DOM
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		document.body.appendChild(svg);

		const { g: gStates, path: statesPath } = makeG();
		const { g: gDistricts, path: districtsPath } = makeG();

		svg.appendChild(gStates);
		svg.appendChild(gDistricts);

		const svgRef = { current: svg };
		const gStatesRef = { current: gStates };
		const gFeatureRef = { current: gDistricts };

		const { result } = renderHook(() => useMapZoom(svgRef, gStatesRef, gFeatureRef));

		// mock zoom transform
		const mockTransform = {
			k: 2,
			toString: () => 'translate(10,20) scale(2)',
		};
		result.current.zoomTransformRef.current = mockTransform as unknown as ZoomTransform | null;

		// act: run the callback
		result.current.applyCurrentTransform();

		// assert: both <g> got transform
		expect(gStates.getAttribute('transform')).toBe('translate(10,20) scale(2)');
		expect(gDistricts.getAttribute('transform')).toBe('translate(10,20) scale(2)');

		// assert: stroke-width adjusted
		// 0.5 / k = 0.25
		expect(statesPath.getAttribute('stroke-width')).toBe('0.25');
		expect(districtsPath.getAttribute('stroke-width')).toBe('0.25');
	});
});
