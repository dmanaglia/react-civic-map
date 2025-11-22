import type { FeatureCollection } from 'geojson';
import React, { useRef } from 'react';
import type { District, State } from '../../models/MapProps';
import type { AddressOfficials } from '../../models/OfficialProps';
import { SvgWrapper } from './SvgWrapper';
import { useDrawDistricts } from './useDrawDistricts';
import { useDrawOfficials } from './useDrawOfficials';
import { useDrawStates } from './useDrawStates';
import { useMapZoom } from './useMapZoom';
import { useTooltip } from './useTooltip';

interface UsMapProps {
	officialList: AddressOfficials | null;
	districtMap: FeatureCollection | null;
	nationalMap: FeatureCollection | null;
	type: string;
	sidebarType: 'summary' | 'address';
	setState: (stateId: State | null) => void;
	setDistrict: (feature: District | null) => void;
}

export const UsMap: React.FC<UsMapProps> = ({
	officialList,
	nationalMap,
	districtMap,
	type,
	sidebarType,
	setState,
	setDistrict,
}) => {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const gStatesRef = useRef<SVGGElement | null>(null);
	const gDistrictRef = useRef<SVGGElement | null>(null);
	const gOfficialsRef = useRef<SVGGElement | null>(null);

	const { showTooltip, hideTooltip } = useTooltip();
	const { zoomToBounds, applyCurrentTransform } = useMapZoom(
		svgRef,
		gStatesRef,
		gDistrictRef,
		gOfficialsRef,
	);

	// draw address point and districts containing it
	useDrawOfficials({
		svgRef,
		gOfficialsRef,
		officialList,
		sidebarType,
		zoomToBounds,
		applyCurrentTransform,
		showTooltip,
		hideTooltip,
	});

	// draw states
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

	// draw districts
	useDrawDistricts({
		svgRef,
		gDistrictRef,
		districtMap,
		type,
		sidebarType,
		zoomToBounds,
		applyCurrentTransform,
		setDistrict,
		showTooltip,
		hideTooltip,
	});

	return (
		<SvgWrapper
			svgRef={svgRef}
			gOfficialsRef={gOfficialsRef}
			gStatesRef={gStatesRef}
			gDistrictRef={gDistrictRef}
			sidebarType={sidebarType}
		/>
	);
};

export default UsMap;
