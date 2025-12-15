import type { FeatureCollection } from 'geojson';
import L from 'leaflet';
import { useEffect } from 'react';
import type { District, MapType } from '../../../models/MapProps';
import { getDistrictColor } from '../utils/getDistrictClass';

interface UseDrawDistrictsLeafletProps {
	districtMap: FeatureCollection | null;
	leafletMap: L.Map | null;
	type: MapType;
	district: District | null;
	sidebarType: 'summary' | 'address';
	setDistrict: (district: District | null) => void;
}

export const useDrawDistrictsLeaflet = ({
	districtMap,
	leafletMap,
	type,
	district,
	sidebarType,
	setDistrict,
}: UseDrawDistrictsLeafletProps) => {
	useEffect(() => {
		if (!districtMap || !leafletMap || sidebarType !== 'summary') return;

		const geojsonLayer = L.geoJson(districtMap, {
			style: (feature) => {
				const props = feature?.properties;
				const active =
					type === 'cd' ? props?.CD119FP === district?.ID : props?.NAME === district?.ID;
				const color = getDistrictColor(props?.party);
				return {
					color: '#ffffff',
					weight: active ? 2 : 1,
					fillColor: color,
					fillOpacity: active ? 0.4 : 0.2,
				};
			},
			onEachFeature: (feature, layer) => {
				const districtName = feature.properties?.NAMELSAD;
				layer.bindTooltip(districtName, {
					sticky: true,
					direction: 'top',
				});
				layer.on({
					mouseover: (e) => {
						e.target.setStyle({ weight: 2, fillOpacity: 0.4 });
						e.target.openTooltip();
					},
					mouseout: (e) => {
						geojsonLayer.resetStyle(layer);
						e.target.closeTooltip();
					},
					click: (e) => {
						const props = feature.properties;
						const bounds = e.target.getBounds();

						setDistrict({
							NAME: props?.NAMELSAD,
							ID: type === 'cd' ? props?.CD119FP : props?.NAME,
							TYPE: type,
							bounds: [
								[0, 0],
								[960, 600],
							],
						});

						// Zoom/pan map to selected district
						leafletMap.fitBounds(bounds);
					},
				});
			},
		}).addTo(leafletMap);

		return () => {
			geojsonLayer.remove();
		};
	}, [districtMap, leafletMap, type, district, sidebarType, setDistrict]);
};
