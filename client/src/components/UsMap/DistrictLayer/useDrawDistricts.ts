import * as d3 from 'd3';
import type { FeatureCollection } from 'geojson';
import { useEffect } from 'react';
import type { District, MapType } from '../../../models/MapProps';
import getDistrictClass from '../utils/getDistrictClass';

interface UseDrawDistrictsProps {
	gDistrictRef: React.RefObject<SVGGElement | null>;
	districtMap: FeatureCollection | null;
	pathGenerator: d3.GeoPath;
	type: MapType;
	setDistrict: (district: District | null) => void;
	showTooltip: (text: string, x: number, y: number) => void;
	hideTooltip: () => void;
}

export function useDrawDistricts({
	gDistrictRef,
	districtMap,
	pathGenerator,
	type,
	setDistrict,
	showTooltip,
	hideTooltip,
}: UseDrawDistrictsProps) {
	useEffect(() => {
		if (!districtMap || !gDistrictRef.current) return;

		const g = d3.select(gDistrictRef.current);

		g.selectAll<SVGPathElement, unknown>('path')
			.data(districtMap.features)
			.join('path')
			.attr('class', (d) => getDistrictClass(d.properties?.party))
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
	}, [type, gDistrictRef, districtMap, pathGenerator, setDistrict, showTooltip, hideTooltip]);
}
