import * as d3 from 'd3';
import L from 'leaflet';

export function createLeafletProjection(leafletMap: L.Map) {
	const projectPoint = function (x: number, y: number) {
		const point = leafletMap.latLngToLayerPoint(new L.LatLng(y, x));
		// @ts-expect-error - D3 geoTransform provides 'this.stream' at runtime
		this.stream.point(point.x, point.y);
	};

	return d3.geoTransform({ point: projectPoint });
}
