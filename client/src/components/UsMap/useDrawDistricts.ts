// src/components/UsMap/useDrawDistricts.ts
import * as d3 from 'd3';
import type { FeatureCollection } from 'geojson';
import { useEffect } from 'react';
import type { District } from '../../models/MapProps';
import { getDistrictClass } from './getDistrictClass'; // or './getDistrictClass' depending on path

interface UseDrawDistrictsProps {
	svgRef: React.RefObject<SVGSVGElement | null>;
	gDistrictRef: React.RefObject<SVGGElement | null>;
	districtMap: FeatureCollection | null;
	type: string;
	sidebarType: 'address' | 'summary';
	applyCurrentTransform: () => void;
	setDistrict: (feature: District | null) => void;
	showTooltip: (text: string, x: number, y: number) => void;
	hideTooltip: () => void;
}

export function useDrawDistricts({
	svgRef,
	gDistrictRef,
	districtMap,
	type,
	sidebarType,
	applyCurrentTransform,
	setDistrict,
	showTooltip,
	hideTooltip,
}: UseDrawDistrictsProps) {
	useEffect(() => {
		if (!districtMap) return;

		const svg = d3.select(svgRef.current);
		const gDistrict = gDistrictRef.current ? d3.select(gDistrictRef.current) : svg.append('g');

		if (sidebarType !== 'summary') {
			gDistrict.selectAll('*').remove();
			return;
		}

		const projection = d3.geoAlbersUsa().scale(1300).translate([480, 300]);
		const path = d3.geoPath().projection(projection);

		gDistrict
			.selectAll('path')
			.data(districtMap.features)
			.join('path')
			.attr('d', path)
			.attr('class', (d) => getDistrictClass(d.properties?.party))
			.on('click', (event: MouseEvent, feature) => {
				event.stopPropagation();
				console.log(feature);
				const bounds = path.bounds(feature);
				setDistrict({
					TYPE: type,
					NAME: feature.properties?.NAMELSAD,
					ID: type === 'cd' ? feature.properties?.CD119FP : feature.properties?.NAME,
					bounds: bounds,
				});
			})
			.on('mouseover', (event: MouseEvent, feature) =>
				showTooltip(feature.properties?.NAMELSAD, event.pageX, event.pageY),
			)
			.on('mousemove', (event: MouseEvent, feature) =>
				showTooltip(feature.properties?.NAMELSAD, event.pageX, event.pageY),
			)
			.on('mouseout', () => hideTooltip());

		applyCurrentTransform();
	}, [
		svgRef,
		gDistrictRef,
		districtMap,
		type,
		sidebarType,
		applyCurrentTransform,
		setDistrict,
		showTooltip,
		hideTooltip,
	]);
}
