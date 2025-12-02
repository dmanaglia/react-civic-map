// src/components/UsMap/useLeafletD3Overlay.ts
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { D3OverlayLayer } from './D3OverlayLayer';

export function useLeafletD3Overlay() {
	const map = useMap();
	const overlayRef = useRef<D3OverlayLayer | null>(null);
	const gStatesRef = useRef<SVGGElement | null>(null);
	const gDistrictRef = useRef<SVGGElement | null>(null);
	const gOfficialsRef = useRef<SVGGElement | null>(null);

	useEffect(() => {
		if (!map) return;

		// Create and add the overlay layer
		const overlay = new D3OverlayLayer();
		overlay.addTo(map);
		overlayRef.current = overlay;

		// Create the three group elements for your layers
		const g = overlay.getGroup();
		if (g) {
			gStatesRef.current = document.createElementNS('http://www.w3.org/2000/svg', 'g');
			gDistrictRef.current = document.createElementNS('http://www.w3.org/2000/svg', 'g');
			gOfficialsRef.current = document.createElementNS('http://www.w3.org/2000/svg', 'g');

			g.appendChild(gStatesRef.current);
			g.appendChild(gOfficialsRef.current);
			g.appendChild(gDistrictRef.current);
		}

		return () => {
			if (overlayRef.current && map) {
				map.removeLayer(overlayRef.current);
			}
		};
	}, [map]);

	return {
		map,
		// eslint-disable-next-line react-hooks/refs
		svgRef: { current: overlayRef.current?.getSvg() || null },
		gStatesRef,
		gDistrictRef,
		gOfficialsRef,
	};
}
