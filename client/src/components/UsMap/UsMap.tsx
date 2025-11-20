import type { FeatureCollection } from 'geojson';
import React, { useRef } from 'react';
import type { District, State } from '../../models/MapProps';
import { SvgWrapper } from './SvgWrapper';
import { useDrawDistricts } from './useDrawDistricts';
import { useDrawStates } from './useDrawStates';
import { useMapZoom } from './useMapZoom';
import { useTooltip } from './useTooltip';

interface UsMapProps {
	districtMap: FeatureCollection | null;
	nationalMap: FeatureCollection | null;
	type: string;
	setState: (stateId: State | null) => void;
	setDistrict: (feature: District | null) => void;
}

export const UsMap: React.FC<UsMapProps> = ({
	nationalMap,
	districtMap,
	type,
	setState,
	setDistrict,
}) => {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const gStatesRef = useRef<SVGGElement | null>(null);
	const gFeatureRef = useRef<SVGGElement | null>(null);

	const { showTooltip, hideTooltip } = useTooltip();
	const { zoomToBounds, applyCurrentTransform } = useMapZoom(svgRef, gStatesRef, gFeatureRef);

	// draw states (uses d3 inside)
	useDrawStates({
		svgRef,
		gStatesRef,
		nationalMap,
		zoomToBounds,
		applyCurrentTransform,
		setState,
		setDistrict,
		showTooltip,
		hideTooltip,
	});

	// draw districts (uses d3 inside)
	useDrawDistricts({
		svgRef,
		gFeatureRef,
		districtMap,
		type,
		zoomToBounds,
		applyCurrentTransform,
		setDistrict,
		showTooltip,
		hideTooltip,
	});

	return <SvgWrapper svgRef={svgRef} gStatesRef={gStatesRef} gFeatureRef={gFeatureRef} />;
};

export default UsMap;
