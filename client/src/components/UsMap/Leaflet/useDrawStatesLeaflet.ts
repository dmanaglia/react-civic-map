// src/components/UsMap/useDrawStatesLeaflet.ts
import * as d3 from 'd3';
import type { FeatureCollection } from 'geojson';
import * as L from 'leaflet';
import { useEffect } from 'react';
import type { District, State } from '../../../models/MapProps';

interface UseDrawStatesLeafletProps {
	map: L.Map | null;
	gStatesRef: React.RefObject<SVGGElement | null>;
	nationalMap: FeatureCollection | null;
	setState: (stateId: State | null) => void;
	setDistrict: (feature: District | null) => void;
	showTooltip: (text: string, x: number, y: number) => void;
	hideTooltip: () => void;
}

export function useDrawStatesLeaflet({
	map,
	gStatesRef,
	nationalMap,
	setState,
	setDistrict,
	showTooltip,
	hideTooltip,
}: UseDrawStatesLeafletProps) {
	useEffect(() => {
		if (!nationalMap || !map || !gStatesRef.current) return;

		const gStates = d3.select(gStatesRef.current);

		// Create a custom D3 projection that uses Leaflet's coordinate transformation
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, react-hooks/unsupported-syntax
		const projectPoint = function (this: any, x: number, y: number) {
			const point = map.latLngToLayerPoint(new L.LatLng(y, x));
			this.stream.point(point.x, point.y);
		};

		const projection = d3.geoTransform({ point: projectPoint });
		const path = d3.geoPath().projection(projection);

		// Function to update the paths (called on initial render and after zoom/pan)
		const update = () => {
			gStates
				.selectAll<SVGPathElement, unknown>('path')
				.data(nationalMap.features)
				.join('path')
				.attr(
					'class',
					'cursor-pointer fill-light-blue stroke-map-stroke hover:fill-dark-blue hover:drop-shadow transition-all transition-stroke',
				)
				.attr('d', path)
				.on('click', function (event: MouseEvent, feature) {
					event.stopPropagation();

					// Calculate bounds in lat/lng for zooming
					const geoBounds = d3.geoBounds(feature);
					const bounds: [[number, number], [number, number]] = [
						[geoBounds[0][1], geoBounds[0][0]], // SW corner [lat, lng]
						[geoBounds[1][1], geoBounds[1][0]], // NE corner [lat, lng]
					];

					setState({
						NAME: feature.properties?.NAME,
						STATEFP: feature.properties?.STATEFP,
						USPS: feature.properties?.STUSPS,
						bounds: bounds,
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
		};

		// Initial draw
		update();

		// Redraw on zoom/pan
		const onViewReset = () => update();
		map.on('moveend', onViewReset);
		map.on('zoomend', onViewReset);

		return () => {
			map.off('moveend', onViewReset);
			map.off('zoomend', onViewReset);
		};
	}, [map, gStatesRef, nationalMap, setState, setDistrict, showTooltip, hideTooltip]);
}
