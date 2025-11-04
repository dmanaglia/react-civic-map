// src/components/UsMap/UsMap.tsx
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import StateProps from "../../models/StateProps";
import FeatureProps from "../../models/FeatureProps";
import { useTooltip } from "./useTooltip";
import { useMapZoom } from "./useMapZoom";
import "./UsMap.css";

interface UsMapProps {
  statesGeoJson: any;
  districtsGeoJson?: any;
  selectedType: string;
  setStateId: (stateId: StateProps | null) => void;
  setSelectedFeature: (feature: FeatureProps | null) => void;
}

export default function UsMap({
  statesGeoJson,
  districtsGeoJson,
  selectedType,
  setStateId,
  setSelectedFeature,
}: UsMapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gStatesRef = useRef<SVGGElement | null>(null);
  const gDistrictsRef = useRef<SVGGElement | null>(null);

  const { showTooltip, hideTooltip } = useTooltip();
  const { zoomToBounds, resetZoom } = useMapZoom(svgRef, gStatesRef, gDistrictsRef);

  useEffect(() => {
    if (!statesGeoJson) return;

    const svg = d3.select(svgRef.current);
    const gStates = gStatesRef.current
      ? d3.select(gStatesRef.current)
      : svg.append("g");
    const gDistricts = gDistrictsRef.current
      ? d3.select(gDistrictsRef.current)
      : svg.append("g");

    const width = 960;
    const height = 600;
    const projection = d3.geoAlbersUsa().scale(1300).translate([480, 300]);
    const path = d3.geoPath().projection(projection);

    // Draw states
    gStates
      .selectAll<SVGPathElement, any>("path")
      .data(statesGeoJson.features)
      .join("path")
      .attr("class", "state")
      .attr("d", path as any)
      .on("click", (event, feature: any) => {
        event.stopPropagation();
        const bounds = path.bounds(feature);
        zoomToBounds(bounds, width, height);
        setStateId({
          name: feature.properties.NAME,
          id: feature.properties.STATEFP,
          code: feature.properties.STUSPS,
        });
      })
      .on("mouseover", (event, feature: any) =>
        showTooltip(feature.properties.NAME, event.pageX, event.pageY)
      )
      .on("mousemove", (event) =>
        showTooltip(event.target.textContent, event.pageX, event.pageY)
      )
      .on("mouseout", hideTooltip);

    // Draw districts
    if (districtsGeoJson) {
      gDistricts
        .selectAll<SVGPathElement, any>("path")
        .data(districtsGeoJson.features)
        .join("path")
        .attr("class", "district")
        .attr("d", path as any)
        .on("click", (event, feature: any) => {
          event.stopPropagation();
          const bounds = path.bounds(feature);
          zoomToBounds(bounds, width, height);
          setSelectedFeature({
            type: selectedType,
            name: feature.properties.NAMELSAD,
            id: feature.properties?.[`CD${feature.properties.CDSESSN}FP`],
          });
        })
        .on("mouseover", (event, feature: any) =>
          showTooltip(
            selectedType === "cd"
              ? feature.properties.NAMELSAD
              : feature.properties.NAME,
            event.pageX,
            event.pageY
          )
        )
        .on("mouseout", hideTooltip);
    }

    // Click outside to reset zoom
    svg.on("click", () => {
      setSelectedFeature(null);
      setStateId(null);
      resetZoom();
    });
  }, [statesGeoJson, districtsGeoJson, selectedType]);

  return (
    <div style={{ marginTop: 50 }}>
      <svg ref={svgRef}>
        <g ref={gStatesRef}></g>
        <g ref={gDistrictsRef}></g>
      </svg>
    </div>
  );
}
