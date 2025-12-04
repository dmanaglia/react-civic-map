import * as d3 from 'd3';
import type { FeatureCollection } from 'geojson';
import React, { useEffect, useRef } from 'react';
import type { District, MapType, State } from '../../../models/MapProps';
import type { AddressOfficials } from '../../../models/OfficialProps';
import { useDrawDistricts } from '../DistrictLayer/useDrawDistricts';
import { useDrawOfficials } from '../OfficialLayer/useDrawOfficials';
import { useDrawStates } from '../StateLayer/useDrawStates';
import { useMapZoom } from '../utils/useMapZoom';
import { useTooltip } from '../utils/useTooltip';

interface SvgMapModeProps {
	officialList: AddressOfficials | null;
	districtMap: FeatureCollection | null;
	nationalMap: FeatureCollection | null;
	type: MapType;
	sidebarType: 'summary' | 'address';
	state: State | null;
	district: District | null;
	setState: (stateId: State | null) => void;
	setDistrict: (feature: District | null) => void;
}

const width = 960;
const height = 600;
const projection = d3.geoAlbersUsa().scale(1300).translate([480, 300]);
const pathGenerator = d3.geoPath().projection(projection);

export const SvgMap: React.FC<SvgMapModeProps> = ({
	officialList,
	nationalMap,
	districtMap,
	sidebarType,
	state,
	district,
	type,
	setState,
	setDistrict,
}) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const gStatesRef = useRef<SVGGElement>(null);
	const gDistrictRef = useRef<SVGGElement>(null);
	const gOfficialsRef = useRef<SVGGElement>(null);

	const { zoomToBounds } = useMapZoom(svgRef, gStatesRef, gDistrictRef, gOfficialsRef);
	const { showTooltip, hideTooltip } = useTooltip();

	useEffect(() => {
		if (sidebarType === 'address') return;
		if (district) {
			zoomToBounds(district.bounds, width, height);
			return;
		}
		if (state) zoomToBounds(state.bounds, width, height);
	}, [state, district, type, sidebarType, zoomToBounds]);

	// Draw map layers
	useDrawStates({
		gStatesRef,
		nationalMap,
		pathGenerator,
		setState,
		setDistrict,
		showTooltip,
		hideTooltip,
	});

	useDrawDistricts({
		gDistrictRef,
		districtMap,
		pathGenerator: pathGenerator,
		type,
		setDistrict,
		showTooltip,
		hideTooltip,
	});

	useDrawOfficials({
		gOfficialsRef,
		officialList,
		pathGenerator: pathGenerator,
		projection: projection,
		showTooltip,
		hideTooltip,
	});

	return (
		<div className="relative w-full max-h-11/12 border-4 border-double">
			<svg
				ref={svgRef}
				className="w-full h-full"
				viewBox="0 0 960 600"
				preserveAspectRatio="xMidYMid meet"
			>
				<g ref={gStatesRef} />
				<g ref={gDistrictRef} />
				<g ref={gOfficialsRef} />
			</svg>
		</div>
	);
};
