import * as d3 from 'd3';
import type { FeatureCollection } from 'geojson';
import L from 'leaflet';
import { useEffect } from 'react';
import type { District, MapType } from '../../../models/MapProps';
import { createLeafletProjection } from '../utils/createLeafletProjection';

interface UseDrawDistrictsLeafletProps {
	gDistrictRef: React.RefObject<SVGGElement | null>;
	districtMap: FeatureCollection | null;
	leafletMap: L.Map | null;
	type: MapType;
	setDistrict: (district: District | null) => void;
	showTooltip: (text: string, x: number, y: number) => void;
	hideTooltip: () => void;
}

export function useDrawDistrictsLeaflet({
	gDistrictRef,
	districtMap,
	leafletMap,
	type,
	setDistrict,
	showTooltip,
	hideTooltip,
}: UseDrawDistrictsLeafletProps) {
	useEffect(() => {
		if (!districtMap || !gDistrictRef.current || !leafletMap) return;

		const g = d3.select(gDistrictRef.current);
		const projection = createLeafletProjection(leafletMap);
		const pathGenerator = d3.geoPath().projection(projection);

		const paths = g
			.selectAll<SVGPathElement, unknown>('path')
			.data(districtMap.features)
			.join('path')
			.attr(
				'class',
				'cursor-pointer fill-light-green stroke-map-stroke hover:fill-dark-green transition-all',
			)
			.attr('d', pathGenerator)
			.on('click', (event: MouseEvent, feature) => {
				event.stopPropagation();
				const bounds = pathGenerator.bounds(feature);
				setDistrict({
					NAME: feature.properties?.NAMELSAD,
					ID: type === 'cd' ? feature.properties?.CD119FP : feature.properties?.NAME,
					TYPE: type,
					bounds,
				});
			})
			.on('mouseover', (event: MouseEvent, feature) =>
				showTooltip(feature.properties?.NAMELSAD, event.pageX, event.pageY),
			)
			.on('mousemove', (event: MouseEvent, feature) =>
				showTooltip(feature.properties?.NAMELSAD, event.pageX, event.pageY),
			)
			.on('mouseout', hideTooltip);

		const update = () => {
			const newProjection = createLeafletProjection(leafletMap);
			const newPath = d3.geoPath().projection(newProjection);
			paths.attr('d', (d) => newPath(d));
		};

		leafletMap.on('moveend', update);
		leafletMap.on('zoomend', update);

		return () => {
			leafletMap.off('moveend', update);
			leafletMap.off('zoomend', update);
		};
	}, [gDistrictRef, districtMap, leafletMap, type, setDistrict, showTooltip, hideTooltip]);
}
