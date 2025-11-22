import * as d3 from 'd3';
import { type RefObject, useCallback, useEffect, useRef } from 'react';

export const useMapZoom = (
	svgRef: RefObject<SVGSVGElement | null>,
	gStatesRef: RefObject<SVGGElement | null>,
	gDistrictRef: RefObject<SVGGElement | null>,
	gOfficialRef: RefObject<SVGGElement | null>,
) => {
	const zoomTransformRef = useRef<d3.ZoomTransform | null>(null);
	const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

	useEffect(() => {
		if (!svgRef.current || !gStatesRef.current || !gDistrictRef.current || !gOfficialRef.current)
			return;

		const svg = d3.select(svgRef.current);
		const gStates = d3.select(gStatesRef.current);
		const gDistricts = d3.select(gDistrictRef.current);
		const gOfficials = d3.select(gOfficialRef.current);

		const zoom = d3
			.zoom<SVGSVGElement, unknown>()
			.scaleExtent([1, 8])
			.on('zoom', (event) => {
				zoomTransformRef.current = event.transform;
				gStates.attr('transform', event.transform.toString());
				gDistricts.attr('transform', event.transform.toString());
				gOfficials.attr('transform', event.transform.toString());
				gStates.selectAll('path').attr('stroke-width', 0.5 / event.transform.k);
				gDistricts.selectAll('path').attr('stroke-width', 0.5 / event.transform.k);
			});

		// store the same zoom instance so we can reuse its .transform later
		zoomBehaviorRef.current = zoom;

		svg.call(zoom);

		return () => {
			// cleanup: remove zoom listeners and unset stored behavior
			svg.on('.zoom', null);
			zoomBehaviorRef.current = null;
		};
	}, [svgRef, gStatesRef, gDistrictRef, gOfficialRef]);

	const resetZoom = () => {
		if (!svgRef.current || !zoomBehaviorRef.current) return;
		const svg = d3.select(svgRef.current);
		// use the same zoom behavior's transform
		svg.transition().duration(750).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
	};

	const zoomToBounds = useCallback(
		(bounds: [[number, number], [number, number]], width: number, height: number) => {
			if (!svgRef.current || !zoomBehaviorRef.current) return;
			const svg = d3.select(svgRef.current);
			const [[x0, y0], [x1, y1]] = bounds;
			const t = d3.zoomIdentity
				.translate(width / 2, height / 2)
				.scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
				.translate(-(x0 + x1) / 2, -(y0 + y1) / 2);

			svg.transition().duration(750).call(zoomBehaviorRef.current.transform, t);
		},
		[svgRef],
	);

	const applyCurrentTransform = useCallback(() => {
		if (!zoomTransformRef.current) return;
		const gStates = d3.select(gStatesRef.current);
		const gDistricts = d3.select(gDistrictRef.current);
		const gOfficials = d3.select(gOfficialRef.current);
		const t = zoomTransformRef.current;

		gStates.attr('transform', t.toString());
		gDistricts.attr('transform', t.toString());
		gOfficials.attr('transform', t.toString());
		gStates.selectAll('path').attr('stroke-width', 0.5 / t.k);
		gDistricts.selectAll('path').attr('stroke-width', 0.5 / t.k);
		gOfficials.selectAll('path').attr('stroke-width', 0.5 / t.k);
	}, [gDistrictRef, gStatesRef, gOfficialRef]);

	return { zoomTransformRef, zoomToBounds, resetZoom, applyCurrentTransform };
};
