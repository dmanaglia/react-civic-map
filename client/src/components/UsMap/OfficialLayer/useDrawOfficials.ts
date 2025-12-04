import * as d3 from 'd3';
import { useEffect } from 'react';
import type { AddressOfficials } from '../../../models/OfficialProps';

interface UseDrawOfficialsProps {
	gOfficialsRef: React.RefObject<SVGGElement | null>;
	officialList: AddressOfficials | null;
	projection: d3.GeoProjection;
	pathGenerator: d3.GeoPath;
	sidebarType: 'address' | 'summary';
	showTooltip: (text: string, x: number, y: number) => void;
	hideTooltip: () => void;
	zoomToBounds: (bounds: [[number, number], [number, number]]) => void;
}

export function useDrawOfficials({
	gOfficialsRef,
	officialList,
	projection,
	pathGenerator,
	sidebarType,
	showTooltip,
	hideTooltip,
	zoomToBounds,
}: UseDrawOfficialsProps) {
	useEffect(() => {
		if (!officialList || !gOfficialsRef.current) return;

		const g = d3.select(gOfficialsRef.current);

		if (sidebarType !== 'address') {
			g.selectAll('*').remove();
			return;
		}

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
		g.selectAll('path.district')
			.data(districts)
			.join('path')
			.attr('class', 'district cursor-pointer transition-all')
			.attr('fill', (d) => color(d.type))
			.attr('stroke', '#333')
			.attr('d', (d) => pathGenerator(d.feature))
			.on('click', (event: MouseEvent) => {
				event.stopPropagation();
				// zoomToBounds(pathGenerator.bounds(d.feature), width, height);
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

		g.selectAll('circle.address-point')
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
				const b = pathGenerator.bounds(d.feature); // also a [[number, number], [number, number]]

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
		// applyCurrentTransform();
		zoomToBounds(allBounds);
	}, [
		gOfficialsRef,
		pathGenerator,
		officialList,
		projection,
		sidebarType,
		showTooltip,
		hideTooltip,
		zoomToBounds,
	]);
}
