import type { FeatureCollection } from 'geojson';
import React, { useEffect, useRef } from 'react';
import type { District, State } from '../../models/MapProps';
import type { AddressOfficials } from '../../models/OfficialProps';
import { useDrawDistricts } from './DistrictLayer/useDrawDistricts';
import { useDrawOfficials } from './OfficialLayer/useDrawOfficials';
import { useDrawStates } from './StateLayer/useDrawStates';
import { SvgWrapper } from './SvgWrapper';
import { useMapZoom } from './utils/useMapZoom';
import { useTooltip } from './utils/useTooltip';

interface UsMapProps {
	officialList: AddressOfficials | null;
	districtMap: FeatureCollection | null;
	nationalMap: FeatureCollection | null;
	type: string;
	sidebarType: 'summary' | 'address';
	state: State | null;
	district: District | null;
	setState: (stateId: State | null) => void;
	setDistrict: (feature: District | null) => void;
}

export const UsMap: React.FC<UsMapProps> = ({
	officialList,
	nationalMap,
	districtMap,
	type,
	sidebarType,
	state,
	district,
	setState,
	setDistrict,
}) => {
	const width = 960;
	const height = 600;
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

	useEffect(() => {
		if (sidebarType === 'address') return;
		if (district) {
			zoomToBounds(district.bounds, width, height);
			return;
		}
		if (state) zoomToBounds(state.bounds, width, height);
	}, [state, district, type, sidebarType, zoomToBounds]);

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
		/>
	);
};

export default UsMap;
