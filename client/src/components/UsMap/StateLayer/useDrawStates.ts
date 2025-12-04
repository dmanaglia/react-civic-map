import * as d3 from 'd3';
import type { FeatureCollection } from 'geojson';
import { useEffect } from 'react';
import type { District, State } from '../../../models/MapProps';

interface UseDrawStatesProps {
	gStatesRef: React.RefObject<SVGGElement | null>;
	nationalMap: FeatureCollection | null;
	pathGenerator: d3.GeoPath;
	setState: (state: State | null) => void;
	setDistrict: (district: District | null) => void;
	showTooltip: (text: string, x: number, y: number) => void;
	hideTooltip: () => void;
}

export function useDrawStates({
	gStatesRef,
	nationalMap,
	pathGenerator,
	setState,
	setDistrict,
	showTooltip,
	hideTooltip,
}: UseDrawStatesProps) {
	useEffect(() => {
		if (!nationalMap || !gStatesRef.current) return;

		const g = d3.select(gStatesRef.current);

		g.selectAll<SVGPathElement, unknown>('path')
			.data(nationalMap.features)
			.join('path')
			.attr(
				'class',
				'cursor-pointer fill-light-blue stroke-map-stroke hover:fill-dark-blue hover:drop-shadow transition-all',
			)
			.attr('d', pathGenerator)
			.on('click', (event: MouseEvent, feature) => {
				event.stopPropagation();
				const bounds = pathGenerator.bounds(feature);
				setState({
					NAME: feature.properties?.NAME,
					STATEFP: feature.properties?.STATEFP,
					USPS: feature.properties?.STUSPS,
					bounds,
				});
				setDistrict(null);
			})
			.on('mouseover', (event: MouseEvent, feature) =>
				showTooltip(feature.properties?.NAME, event.pageX, event.pageY),
			)
			.on('mousemove', (event: MouseEvent, feature) =>
				showTooltip(feature.properties?.NAME, event.pageX, event.pageY),
			)
			.on('mouseout', hideTooltip);
	}, [gStatesRef, nationalMap, pathGenerator, setState, setDistrict, showTooltip, hideTooltip]);
}
