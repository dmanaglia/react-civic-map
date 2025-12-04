import L from 'leaflet';
import { useEffect } from 'react';
import type { AddressOfficials } from '../../../models/OfficialProps';

interface UseDrawOfficialsLeafletProps {
	officialList: AddressOfficials | null;
	leafletMap: L.Map | null;
	sidebarType: 'address' | 'summary';
}

export function useDrawOfficialsLeaflet({
	officialList,
	leafletMap,
	sidebarType,
}: UseDrawOfficialsLeafletProps) {
	useEffect(() => {
		if (!officialList || !leafletMap || sidebarType !== 'address') return;

		const districts = [
			{ type: 'congressional', feature: officialList.congressional.feature },
			{ type: 'senate', feature: officialList.senate.feature },
			{ type: 'house', feature: officialList.house.feature },
		];

		const colorMap: Record<string, string> = {
			congressional: '#1f77b4',
			senate: '#2ca02c',
			house: '#d62728',
		};

		// Create layer group for all district layers
		const districtLayers: L.GeoJSON[] = [];

		// Draw each district
		districts.forEach((district) => {
			const geojsonLayer = L.geoJson(district.feature, {
				style: () => ({
					color: '#333',
					weight: 1,
					fillColor: colorMap[district.type],
					fillOpacity: 0.3,
				}),
				onEachFeature: (feature, layer) => {
					// Bind tooltip
					const districtName = feature.properties?.NAMELSAD;
					layer.bindTooltip(districtName, {
						sticky: true,
						direction: 'top',
					});
					layer.on({
						mouseover: (e) => {
							e.target.setStyle({
								weight: 2,
								fillOpacity: 0.5,
							});
							e.target.openTooltip();
						},
						mouseout: (e) => {
							geojsonLayer.resetStyle(layer);
							e.target.closeTooltip();
						},
						click: (e) => {
							e.originalEvent.stopPropagation();
							// Zoom to clicked district
							leafletMap.fitBounds(e.target.getBounds());
						},
					});
				},
			}).addTo(leafletMap);

			districtLayers.push(geojsonLayer);
		});

		// Draw address point
		const [lng, lat] = officialList.point.coordinates as [number, number];
		const addressMarker = L.circleMarker([lat, lng], {
			radius: 6,
			fillColor: 'black',
			color: 'white',
			weight: 2,
			fillOpacity: 1,
		})
			.bindTooltip('Current Address', {
				permanent: false,
				direction: 'top',
			})
			.addTo(leafletMap);

		addressMarker.on({
			mouseover: (e) => {
				e.target.openTooltip();
			},
			mouseout: (e) => {
				e.target.closeTooltip();
			},
		});

		// Calculate combined bounds of all districts
		const allBounds = L.latLngBounds([]);
		districtLayers.forEach((layer) => {
			allBounds.extend(layer.getBounds());
		});

		// Zoom to combined bounds
		if (allBounds.isValid()) {
			leafletMap.fitBounds(allBounds, { padding: [50, 50] });
		}

		// Cleanup function
		return () => {
			districtLayers.forEach((layer) => layer.remove());
			addressMarker.remove();
		};
	}, [officialList, leafletMap, sidebarType]);
}
