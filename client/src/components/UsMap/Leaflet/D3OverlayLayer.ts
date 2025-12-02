// src/components/UsMap/D3OverlayLayer.ts
import * as L from 'leaflet';

export class D3OverlayLayer extends L.Layer {
	private svg: SVGSVGElement | null = null;
	private g: SVGGElement | null = null;

	onAdd(map: L.Map): this {
		// Create SVG element that will overlay the map
		const container = map.getPane('overlayPane');
		if (!container) return this;

		this.svg = L.DomUtil.create('svg', 'leaflet-zoom-hide') as unknown as SVGSVGElement;
		this.g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		this.svg.appendChild(this.g);
		container.appendChild(this.svg);

		// Prevent click events from bubbling to the map
		L.DomEvent.disableClickPropagation(this.svg as unknown as HTMLElement);

		// Update position when map moves
		map.on('moveend', this.reset, this);
		map.on('zoomend', this.reset, this);

		this.reset();
		return this;
	}

	onRemove(map: L.Map): this {
		map.off('moveend', this.reset, this);
		map.off('zoomend', this.reset, this);

		if (this.svg && this.svg.parentNode) {
			this.svg.parentNode.removeChild(this.svg);
		}
		return this;
	}

	reset(): void {
		if (!this.svg || !this._map) return;

		const bounds = this._map.getBounds();
		const topLeft = this._map.latLngToLayerPoint(bounds.getNorthWest());
		const bottomRight = this._map.latLngToLayerPoint(bounds.getSouthEast());

		const width = bottomRight.x - topLeft.x;
		const height = bottomRight.y - topLeft.y;

		// Position and size the SVG to cover the visible map area
		L.DomUtil.setPosition(this.svg as unknown as HTMLElement, topLeft);
		this.svg.setAttribute('width', String(width));
		this.svg.setAttribute('height', String(height));
		this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
	}

	getGroup(): SVGGElement | null {
		return this.g;
	}

	getSvg(): SVGSVGElement | null {
		return this.svg;
	}
}
