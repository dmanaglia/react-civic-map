// import * as d3 from 'd3';
import L from 'leaflet';
import { useEffect } from 'react';
import type { AddressOfficials } from '../../../models/OfficialProps';

interface UseDrawOfficialsLeafletProps {
	gOfficialsRef: React.RefObject<SVGGElement | null>;
	officialList: AddressOfficials | null;
	leafletMap: L.Map | null;
	showTooltip: (text: string, x: number, y: number) => void;
	hideTooltip: () => void;
}

export function useDrawOfficialsLeaflet({
	gOfficialsRef,
	officialList,
	leafletMap,
	showTooltip,
	hideTooltip,
}: UseDrawOfficialsLeafletProps) {
	useEffect(() => {
		if (!officialList || !gOfficialsRef.current || !leafletMap) return;

		// const g = d3.select(gOfficialsRef.current);

		// const districts = [
		// 	{ type: 'congressional', feature: officialList.congressional.feature },
		// 	{ type: 'senate', feature: officialList.senate.feature },
		// 	{ type: 'house', feature: officialList.house.feature },
		// ];
		// Example: Convert officials to coordinates
		// const officials = Object.entries(officialList).flatMap(([address, data]) => {
		// 	return data.officials.map((official) => ({
		// 		...official,
		// 		coordinates: [0, 0], // Replace with actual lat/lng
		// 	}));
		// });

		// const circles = g
		// 	.selectAll<SVGCircleElement, unknown>('circle')
		// 	.data(districts)
		// 	.join('circle')
		// 	.attr('class', 'cursor-pointer fill-red-500 hover:fill-red-700')
		// 	.attr('r', 5)
		// 	.on('mouseover', (event: MouseEvent, d) => showTooltip(d.type, event.pageX, event.pageY))
		// 	.on('mousemove', (event: MouseEvent, d) => showTooltip(d.type, event.pageX, event.pageY))
		// 	.on('mouseout', hideTooltip);

		// const update = () => {
		// 	circles
		// 		.attr('cx', (d) => {
		// 			const point = leafletMap.latLngToLayerPoint(
		// 				new L.LatLng(d.feature[1], d.coordinates[0]),
		// 			);
		// 			return point.x;
		// 		})
		// 		.attr('cy', (d) => {
		// 			const point = leafletMap.latLngToLayerPoint(
		// 				new L.LatLng(d.coordinates[1], d.coordinates[0]),
		// 			);
		// 			return point.y;
		// 		});
		// };

		// update();
		// leafletMap.on('moveend', update);
		// leafletMap.on('zoomend', update);

		// return () => {
		// 	leafletMap.off('moveend', update);
		// 	leafletMap.off('zoomend', update);
		// };
	}, [officialList, leafletMap, showTooltip, hideTooltip]);
}
