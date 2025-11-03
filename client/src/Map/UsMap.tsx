import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

interface UsMapProps {
  statesGeoJson: any;
  districtsGeoJson?: any; // optional districts overlay
  onStateClick: (stateId: string) => void;
}

export default function UsMap({ statesGeoJson, districtsGeoJson, onStateClick }: UsMapProps) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform | null>(null);

  useEffect(() => {
    if (!statesGeoJson) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 960;
    const height = 600;

    const projection = d3.geoAlbersUsa().scale(1300).translate([480, 300]);
    const path = d3.geoPath().projection(projection);

    // Zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        setZoomTransform(event.transform);
        g.attr("transform", event.transform.toString());
        g.selectAll("path").attr("stroke-width", 0.5 / event.transform.k); // adjust line thickness
      });

    svg.call(zoom as any);

    const g = svg.append("g");

    // Draw states
    g.selectAll("path")
      .data(statesGeoJson.features)
      .enter()
      .append("path")
      .attr("d", path as any)
      .attr("fill", "#b0c4de")
      .attr("stroke", "#333")
      .attr("cursor", "pointer")
      .on("click", (event, feature: any) => {
        event.stopPropagation();
        const [[x0, y0], [x1, y1]] = path.bounds(feature);
        svg
          .transition()
          .duration(750)
          .call(
            zoom.transform as any,
            d3.zoomIdentity
              .translate(width / 2, height / 2)
              .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
              .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
          );

        onStateClick(feature.properties.STATEFP);
      });

    // Reset zoom when clicking background
    svg.on("click", () => {
      svg.transition().duration(750).call(zoom.transform as any, d3.zoomIdentity);
    });
  }, [statesGeoJson]);

  return <svg ref={ref} width={960} height={600}></svg>;
}
