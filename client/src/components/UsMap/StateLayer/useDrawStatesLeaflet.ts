import * as d3 from 'd3';
import type { FeatureCollection } from 'geojson';
import L from 'leaflet';
import { useEffect } from 'react';
import type { District, State } from '../../../models/MapProps';
import { createLeafletProjection } from '../utils/createLeafletProjection';

interface UseDrawStatesLeafletProps {
	gStatesRef: React.RefObject<SVGGElement | null>;
	nationalMap: FeatureCollection | null;
	leafletMap: L.Map | null;
	setState: (state: State | null) => void;
	setDistrict: (district: District | null) => void;
	showTooltip: (text: string, x: number, y: number) => void;
	hideTooltip: () => void;
}

export function useDrawStatesLeaflet({
	gStatesRef,
	nationalMap,
	leafletMap,
	setState,
	setDistrict,
	showTooltip,
	hideTooltip,
}: UseDrawStatesLeafletProps) {
	useEffect(() => {
		if (!nationalMap || !gStatesRef.current || !leafletMap) return;

		const svgGroup = d3.select(gStatesRef.current);

		const projectPoint = () => createLeafletProjection(leafletMap);
		let path = d3.geoPath().projection(projectPoint());

		// Initial render only once
		const paths = svgGroup
			.selectAll<SVGPathElement, unknown>('path')
			.data(nationalMap.features)
			.join('path')
			.attr('class', 'cursor-pointer fill-light-blue stroke-map-stroke')
			.attr('d', path)
			.on('click', (event, feature) => {
				event.stopPropagation();
				const bounds = path.bounds(feature);
				setState({
					NAME: feature.properties?.NAME,
					STATEFP: feature.properties?.STATEFP,
					USPS: feature.properties?.STUSPS,
					bounds,
				});
				setDistrict(null);
			})
			.on('mouseover', (event, feature) =>
				showTooltip(feature.properties?.NAME, event.pageX, event.pageY),
			)
			.on('mousemove', (event, feature) =>
				showTooltip(feature.properties?.NAME, event.pageX, event.pageY),
			)
			.on('mouseout', hideTooltip);

		// 🔥 Recompute shape only when zoom completely finishes
		const onZoomEnd = () => {
			path = d3.geoPath().projection(projectPoint());
			paths.attr('d', path); // redraw
		};

		// ⚡ Pan/zoom animation: move entire group, no redraw
		const onViewReset = () => {
			const bounds = leafletMap.getBounds();
			const topLeft = leafletMap.latLngToLayerPoint(bounds.getNorthWest());
			svgGroup.attr('transform', `translate(${-topLeft.x},${-topLeft.y})`);
		};

		// Register correct events
		leafletMap.on('zoomend', onZoomEnd);
		leafletMap.on('move', onViewReset);
		leafletMap.on('zoom', onViewReset); // sync zoom animation

		// Initial positioning
		onViewReset();

		return () => {
			leafletMap.off('zoomend', onZoomEnd);
			leafletMap.off('move', onViewReset);
			leafletMap.off('zoom', onViewReset);
		};
	}, [gStatesRef, nationalMap, leafletMap, setState, setDistrict, showTooltip, hideTooltip]);
}
