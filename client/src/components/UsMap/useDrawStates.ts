// src/components/UsMap/useDrawStates.ts
import * as d3 from 'd3';
import type { FeatureCollection } from 'geojson';
import { useEffect } from 'react';
import type { District, State } from '../../models/MapProps';

interface UseDrawStatesProps {
	svgRef: React.RefObject<SVGSVGElement | null>;
	gStatesRef: React.RefObject<SVGGElement | null>;
	nationalMap: FeatureCollection | null;
	zoomToBounds: (
		bounds: [[number, number], [number, number]],
		width: number,
		height: number,
	) => void;
	applyCurrentTransform: () => void;
	setState: (stateId: State | null) => void;
	setDistrict: (feature: District | null) => void;
	showTooltip: (text: string, x: number, y: number) => void;
	hideTooltip: () => void;
}

export function useDrawStates({
	svgRef,
	gStatesRef,
	nationalMap,
	zoomToBounds,
	applyCurrentTransform,
	setState,
	setDistrict,
	showTooltip,
	hideTooltip,
}: UseDrawStatesProps) {
	useEffect(() => {
		if (!nationalMap) return;
		const svg = d3.select(svgRef.current);
		const gStates = gStatesRef.current ? d3.select(gStatesRef.current) : svg.append('g');

		const width = 960;
		const height = 600;
		const projection = d3.geoAlbersUsa().scale(1300).translate([480, 300]);
		const path = d3.geoPath().projection(projection);

		gStates
			.selectAll<SVGPathElement, unknown>('path')
			.data(nationalMap.features)
			.join('path')
			.attr(
				'class',
				'cursor-pointer fill-light-blue stroke-gray-700 hover:fill-dark-blue hover:drop-shadow transition-all transition-stroke',
			)
			.attr('d', path)
			.on('click', (event: MouseEvent, feature) => {
				event.stopPropagation();
				const bounds = path.bounds(feature);
				zoomToBounds(bounds, width, height);
				setState({
					NAME: feature.properties?.NAME,
					STATEFP: feature.properties?.STATEFP,
					USPS: feature.properties?.STUSPS,
				});
				setDistrict(null);
			})
			.on('mouseover', (event: MouseEvent, feature) =>
				showTooltip(feature.properties?.NAME, event.pageX, event.pageY),
			)
			.on('mousemove', (event: MouseEvent, feature) =>
				showTooltip(feature.properties?.NAME, event.pageX, event.pageY),
			)
			.on('mouseout', () => hideTooltip());

		applyCurrentTransform();
	}, [
		nationalMap,
		zoomToBounds,
		applyCurrentTransform,
		setState,
		setDistrict,
		showTooltip,
		hideTooltip,
		svgRef,
		gStatesRef,
	]);
}
