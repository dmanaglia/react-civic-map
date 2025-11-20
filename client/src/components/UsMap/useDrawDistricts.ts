// src/components/UsMap/useDrawDistricts.ts
import * as d3 from 'd3';
import type { FeatureCollection } from 'geojson';
import { useEffect } from 'react';
import type { District } from '../../models/MapProps';
import { getDistrictClass } from './getDistrictClass'; // or './getDistrictClass' depending on path

interface UseDrawDistrictsProps {
	svgRef: React.RefObject<SVGSVGElement | null>;
	gFeatureRef: React.RefObject<SVGGElement | null>;
	districtMap: FeatureCollection | null;
	type: string;
	zoomToBounds: (
		bounds: [[number, number], [number, number]],
		width: number,
		height: number,
	) => void;
	applyCurrentTransform: () => void;
	setDistrict: (feature: District | null) => void;
	showTooltip: (text: string, x: number, y: number) => void;
	hideTooltip: () => void;
}

export function useDrawDistricts({
	svgRef,
	gFeatureRef,
	districtMap,
	type,
	zoomToBounds,
	applyCurrentTransform,
	setDistrict,
	showTooltip,
	hideTooltip,
}: UseDrawDistrictsProps) {
	useEffect(() => {
		if (!districtMap) return;

		const svg = d3.select(svgRef.current);
		const gFeature = gFeatureRef.current ? d3.select(gFeatureRef.current) : svg.append('g');

		const width = 960;
		const height = 600;
		const projection = d3.geoAlbersUsa().scale(1300).translate([480, 300]);
		const path = d3.geoPath().projection(projection);

		gFeature
			.selectAll('path')
			.data(districtMap.features)
			.join('path')
			.attr('d', path)
			.attr('class', (d) => getDistrictClass(d.properties?.party))
			.on('click', (event: MouseEvent, feature) => {
				event.stopPropagation();
				console.log(feature);
				const bounds = path.bounds(feature);
				zoomToBounds(bounds, width, height);
				setDistrict({
					TYPE: type,
					NAME: feature.properties?.NAMELSAD,
					ID: type === 'cd' ? feature.properties?.CD119FP : feature.properties?.NAME,
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
		districtMap,
		type,
		zoomToBounds,
		applyCurrentTransform,
		setDistrict,
		showTooltip,
		hideTooltip,
		svgRef,
		gFeatureRef,
	]);
}
