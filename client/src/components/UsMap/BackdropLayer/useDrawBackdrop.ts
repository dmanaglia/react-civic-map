import * as d3 from 'd3';
import type { FeatureCollection, Point } from 'geojson';
import { useEffect } from 'react';
import type { State, District } from '../../../models/MapProps';

interface UseDrawBackdropProps {
	gBackdropRef: React.RefObject<SVGGElement | null>;
	citiesGeoJSON: FeatureCollection | null;
	roadsGeoJSON: FeatureCollection | null;
	waterGeoJSON: FeatureCollection | null;
	state: State | null;
	district: District | null;
	enabled: boolean;
	showTooltip: (text: string, x: number, y: number) => void;
	hideTooltip: () => void;
}

export function useDrawBackdrop({
	gBackdropRef,
	citiesGeoJSON,
	roadsGeoJSON,
	waterGeoJSON,
	state,
	district,
	enabled,
	showTooltip,
	hideTooltip,
}: UseDrawBackdropProps) {
	useEffect(() => {
		const gBackdrop = d3.select(gBackdropRef.current);
		const projection = d3.geoAlbersUsa().scale(1300).translate([480, 300]);
		const path = d3.geoPath().projection(projection);

		if (!enabled) {
			gBackdrop.selectAll('*').remove();
			return;
		}

		// Determine zoom level
		const zoomLevel = district ? 3 : state ? 2 : 1;

		// === DRAW WATER BODIES (bottom layer) ===
		if (waterGeoJSON) {
			const visibleWater = waterGeoJSON.features.filter((feature) => {
				// Filter logic based on zoom level
				const waterType = feature.properties?.type; // e.g., 'ocean', 'lake', 'river'

				if (zoomLevel === 1) {
					// National: only major water bodies
					return waterType === 'ocean' || (waterType === 'lake' && feature.properties?.area > 1000);
				}
				if (zoomLevel === 2) {
					// State: add medium lakes and major rivers
					return (
						waterType === 'ocean' ||
						waterType === 'lake' ||
						(waterType === 'river' && feature.properties?.major)
					);
				}
				// District: show all significant water
				return true;
			});

			gBackdrop
				.selectAll<SVGPathElement, unknown>('path.water')
				.data(visibleWater)
				.join('path')
				.attr('class', 'water fill-blue-200 stroke-blue-300 stroke-1 pointer-events-none')
				.attr('d', path);
		}

		// === DRAW ROADS (middle layer) ===
		if (roadsGeoJSON) {
			const visibleRoads = roadsGeoJSON.features.filter((feature) => {
				const roadType = feature.properties?.RTTYP;

				// I = Interstate, U = US Highway, S = State Highway, C = County, M = Common Name
				if (zoomLevel === 1) {
					// National: only interstates
					return roadType === 'I' || roadType === 'U';
				}
				if (zoomLevel === 2) {
					// State: add US/state highways
					return roadType === 'S' || roadType === 'I' || roadType === 'U';
				}
				if (zoomLevel === 3) return true;

				return false;
			});

			gBackdrop
				.selectAll<SVGPathElement, unknown>('path.road')
				.data(visibleRoads)
				.join('path')
				.attr('class', (d) => {
					// Style based on road type
					const type = d.properties?.type;
					if (type === 'motorway')
						return 'road stroke-orange-400 stroke-2 fill-none pointer-events-none';
					if (type === 'trunk' || type === 'primary')
						return 'road stroke-yellow-400 stroke-1 fill-none pointer-events-none';
					return 'road stroke-gray-300 stroke-1 fill-none pointer-events-none';
				})
				.attr('d', path);
		}

		// === DRAW CITIES (top layer) ===
		if (citiesGeoJSON) {
			const visibleCities = citiesGeoJSON.features.filter((feature) => {
				const pop = feature.properties?.population || 0;
				const cityState = feature.properties?.state;

				if (zoomLevel === 1) {
					// National: major cities only
					return pop > 500000;
				}
				if (zoomLevel === 2) {
					// State: medium cities in selected state
					return cityState === state?.USPS && pop > 100000;
				}
				// District: smaller cities in selected state
				return cityState === state?.USPS && pop > 25000;
			});

			// Draw city dots
			gBackdrop
				.selectAll<SVGCircleElement, unknown>('circle.city')
				.data(visibleCities)
				.join('circle')
				.attr('class', 'city cursor-pointer')
				.attr('cx', (d) => {
					const point: Point = d.geometry as Point;
					const coords = projection(point.coordinates as [number, number]);
					return coords ? coords[0] : 0;
				})
				.attr('cy', (d) => {
					const point: Point = d.geometry as Point;
					const coords = projection(point.coordinates as [number, number]);
					return coords ? coords[1] : 0;
				})
				.attr('r', (d) => {
					const pop = d.properties?.population || 0;
					if (pop > 1000000) return 5;
					if (pop > 500000) return 3.5;
					if (pop > 100000) return 2.5;
					return 2;
				})
				.attr('fill', '#374151') // gray-700
				.attr('stroke', '#ffffff')
				.attr('stroke-width', 0.5)
				.on('mouseover', (event: MouseEvent, feature) =>
					showTooltip(
						`${feature.properties?.name} (${feature.properties?.population?.toLocaleString()})`,
						event.pageX,
						event.pageY,
					),
				)
				.on('mousemove', (event: MouseEvent, feature) =>
					showTooltip(
						`${feature.properties?.name} (${feature.properties?.population?.toLocaleString()})`,
						event.pageX,
						event.pageY,
					),
				)
				.on('mouseout', hideTooltip);

			// Draw city labels (only for larger cities to avoid clutter)
			const labeledCities = visibleCities.filter((feature) => {
				const pop = feature.properties?.population || 0;
				if (zoomLevel === 1) return pop > 1000000;
				if (zoomLevel === 2) return pop > 300000;
				return pop > 100000;
			});

			gBackdrop
				.selectAll<SVGTextElement, unknown>('text.city-label')
				.data(labeledCities)
				.join('text')
				.attr('class', 'city-label text-xs fill-gray-800 font-medium pointer-events-none')
				.attr('x', (d) => {
					const point: Point = d.geometry as Point;
					const coords = projection(point.coordinates as [number, number]);
					return coords ? coords[0] + 6 : 0; // Offset to right of dot
				})
				.attr('y', (d) => {
					const point: Point = d.geometry as Point;
					const coords = projection(point.coordinates as [number, number]);
					return coords ? coords[1] + 4 : 0; // Slight vertical offset
				})
				.text((d) => d.properties?.name || '');
		}
	}, [
		gBackdropRef,
		citiesGeoJSON,
		roadsGeoJSON,
		waterGeoJSON,
		state,
		district,
		enabled,
		showTooltip,
		hideTooltip,
	]);
}
