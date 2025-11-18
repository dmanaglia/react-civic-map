// src/components/UsMap/UsMap.tsx
import * as d3 from 'd3';
import type { FeatureCollection } from 'geojson';
import { useEffect, useRef } from 'react';
import type { District, State } from '../../models/MapProps';
import { useMapZoom } from './useMapZoom';
import { useTooltip } from './useTooltip';

interface UsMapProps {
	districtMap: FeatureCollection | null;
	nationalMap: FeatureCollection | null;
	type: string;
	setState: (stateId: State | null) => void;
	setDistrict: (feature: District | null) => void;
}

export const UsMap = ({ nationalMap, districtMap, type, setState, setDistrict }: UsMapProps) => {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const gStatesRef = useRef<SVGGElement | null>(null);
	const gFeatureRef = useRef<SVGGElement | null>(null);

	const { showTooltip, hideTooltip } = useTooltip();
	const { zoomToBounds, applyCurrentTransform } = useMapZoom(svgRef, gStatesRef, gFeatureRef);

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
			.on('click', (event, feature) => {
				event.stopPropagation();
				const bounds = path.bounds(feature);
				zoomToBounds(bounds, width, height);
				setState({
					NAME: feature?.properties?.NAME,
					STATEFP: feature?.properties?.STATEFP,
					USPS: feature?.properties?.STUSPS,
				});
				setDistrict(null);
			})
			.on('mouseover', (event, feature) =>
				showTooltip(feature?.properties?.NAME, event.pageX, event.pageY),
			)
			.on('mousemove', (event, feature) =>
				showTooltip(feature?.properties?.NAME, event.pageX, event.pageY),
			)
			.on('mouseout', hideTooltip);

		applyCurrentTransform();
	}, [
		nationalMap,
		applyCurrentTransform,
		hideTooltip,
		setDistrict,
		setState,
		showTooltip,
		zoomToBounds,
	]);

	useEffect(() => {
		if (!districtMap) return;
		const svg = d3.select(svgRef.current);
		const gFeature = gFeatureRef.current ? d3.select(gFeatureRef.current) : svg.append('g');
		const width = 960;
		const height = 600;
		const projection = d3.geoAlbersUsa().scale(1300).translate([480, 300]);
		const path = d3.geoPath().projection(projection);

		gFeature
			.selectAll<SVGPathElement, unknown>('path')
			.data(districtMap.features)
			.join('path')
			.attr('d', path)
			.attr('class', (d) => {
				const party = d.properties?.party?.toLowerCase();
				const baseStyle =
					'cursor-pointer stroke-black hover:drop-shadow transition-all transition-stroke ';

				if (party?.includes('democratic')) {
					return baseStyle.concat('fill-democrat hover:fill-blue-600');
				}

				if (party?.includes('republican')) {
					return baseStyle.concat('fill-republican hover:fill-red-700');
				}

				if (party?.includes('independent')) {
					return baseStyle.concat('fill-independent hover:fill-gray-600');
				}

				return baseStyle.concat('fill-unknown hover:fill-orange-600');
			})
			.on('click', (event, feature) => {
				event.stopPropagation();
				const bounds = path.bounds(feature);
				zoomToBounds(bounds, width, height);
				setDistrict({
					TYPE: type,
					NAME: feature.properties?.NAMELSAD,
					ID: type === 'cd' ? feature.properties?.CD119FP : feature.properties?.NAME,
				});
			})
			.on('mouseover', (event, feature) =>
				showTooltip(
					type === 'cd' ? feature.properties?.NAMELSAD : feature.properties?.NAME,
					event.pageX,
					event.pageY,
				),
			)
			.on('mousemove', (event, feature) =>
				showTooltip(
					type === 'cd' ? feature.properties?.NAMELSAD : feature.properties?.NAME,
					event.pageX,
					event.pageY,
				),
			)
			.on('mouseout', hideTooltip);

		applyCurrentTransform();
	}, [
		districtMap,
		type,
		applyCurrentTransform,
		hideTooltip,
		setDistrict,
		showTooltip,
		zoomToBounds,
	]);

	return (
		<div className="relative w-full max-h-11/12 border-4 border-double border-blue-800 bg-red-50">
			<div className="w-full h-full">
				<svg
					ref={svgRef}
					className="w-full h-full"
					viewBox="0 0 960 600"
					preserveAspectRatio="xMidYMid meet"
				>
					<g ref={gStatesRef}></g>
					<g ref={gFeatureRef}></g>
				</svg>
			</div>
		</div>
	);
};
