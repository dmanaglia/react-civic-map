// src/components/UsMap/LeafletWrapper.tsx
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface LeafletWrapperProps {
	children: React.ReactNode;
	onMapReady: (map: L.Map) => void;
}

export const LeafletWrapper: React.FC<LeafletWrapperProps> = ({ children, onMapReady }) => {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const leafletMapRef = useRef<L.Map | null>(null);

	useEffect(() => {
		if (!mapContainerRef.current || leafletMapRef.current) return;

		// Create Leaflet map
		const map = L.map(mapContainerRef.current, {
			center: [39.8283, -98.5795],
			zoom: 4,
			zoomControl: true,
			attributionControl: true,
			dragging: false,
			touchZoom: false,
			scrollWheelZoom: false,
			doubleClickZoom: false,
			boxZoom: false,
			keyboard: false,
		});

		leafletMapRef.current = map;

		// Add tile layer
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
			opacity: 0.5,
		}).addTo(map);

		// Notify parent that map is ready
		onMapReady(map);

		return () => {
			if (leafletMapRef.current) {
				leafletMapRef.current.remove();
				leafletMapRef.current = null;
			}
		};
	}, [onMapReady]);

	return (
		<div className="relative w-full h-full">
			{/* Leaflet container */}
			<div ref={mapContainerRef} className="absolute inset-0 z-0" style={{ height: '600px' }} />

			{/* SVG overlay */}
			<div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}>
				{children}
			</div>
		</div>
	);
};
