import * as d3 from 'd3';
import { useEffect } from 'react';
import type { AddressOfficials } from '../../../models/OfficialProps';

interface UseDrawOfficialsProps {
	svgRef: React.RefObject<SVGSVGElement | null>;
	gOfficialsRef: React.RefObject<SVGGElement | null>;
	officialList: AddressOfficials | null;
	sidebarType: 'address' | 'summary';
	zoomToBounds: (
		bounds: [[number, number], [number, number]],
		width: number,
		height: number,
	) => void;
	applyCurrentTransform: () => void;
	showTooltip: (text: string, x: number, y: number) => void;
	hideTooltip: () => void;
}

export function useDrawOfficials({
	svgRef,
	gOfficialsRef,
	officialList,
	sidebarType,
	zoomToBounds,
	applyCurrentTransform,
	showTooltip,
	hideTooltip,
}: UseDrawOfficialsProps) {
	useEffect(() => {
		if (!officialList) return;

		const svg = d3.select(svgRef.current);
		const gOfficials = gOfficialsRef.current ? d3.select(gOfficialsRef.current) : svg.append('g');

		if (sidebarType !== 'address') {
			gOfficials.selectAll('*').remove();
			return;
		}

		const width = 960;
		const height = 600;
		const projection = d3.geoAlbersUsa().scale(1300).translate([480, 300]);
		const path = d3.geoPath().projection(projection);

		const districts = [
			{ type: 'congressional', feature: officialList.congressional.feature },
			{ type: 'senate', feature: officialList.senate.feature },
			{ type: 'house', feature: officialList.house.feature },
		];

		const color = d3
			.scaleOrdinal<string, string>()
			.domain(['congressional', 'senate', 'house'])
			.range(['#1f77b4', '#2ca02c', '#d62728']);

		// --- Draw districts ---
		gOfficials
			.selectAll('path.district')
			.data(districts)
			.join('path')
			.attr('class', 'district cursor-pointer transition-all')
			.attr('fill', (d) => color(d.type))
			.attr('stroke', '#333')
			.attr('d', (d) => path(d.feature))
			.on('click', (event: MouseEvent, d) => {
				event.stopPropagation();
				zoomToBounds(path.bounds(d.feature), width, height);
			})
			.on('mouseover', (event, d) =>
				showTooltip(d.feature.properties?.NAMELSAD, event.pageX, event.pageY),
			)
			.on('mousemove', (event, d) =>
				showTooltip(d.feature.properties?.NAMELSAD, event.pageX, event.pageY),
			)
			.on('mouseout', hideTooltip);

		// --- Draw address point ---
		const [px, py] = projection(officialList.point.coordinates as [number, number])!;

		gOfficials
			.selectAll('circle.address-point')
			.data([officialList.point])
			.join('circle')
			.attr('class', 'address-point')
			.attr('cx', px)
			.attr('cy', py)
			.attr('r', 0.1)
			.attr('fill', 'black')
			.attr('stroke', 'white')
			.attr('stroke', 0)
			.on('mousemove', (event) => showTooltip('Current Address', event.pageX, event.pageY))
			.on('mouseout', hideTooltip);

		// --- Zoom to the combined district bounds ---
		const allBounds: [[number, number], [number, number]] = districts.reduce(
			(acc, d) => {
				const b = path.bounds(d.feature); // also a [[number, number], [number, number]]

				return [
					[Math.min(acc[0][0], b[0][0]), Math.min(acc[0][1], b[0][1])],
					[Math.max(acc[1][0], b[1][0]), Math.max(acc[1][1], b[1][1])],
				];
			},
			// As soon as TS sees this, it knows the output shape
			[
				[Infinity, Infinity],
				[-Infinity, -Infinity],
			] as [[number, number], [number, number]],
		);
		applyCurrentTransform();
		zoomToBounds(allBounds, width, height);
	}, [
		officialList,
		svgRef,
		gOfficialsRef,
		sidebarType,
		zoomToBounds,
		showTooltip,
		hideTooltip,
		applyCurrentTransform,
	]);
}
