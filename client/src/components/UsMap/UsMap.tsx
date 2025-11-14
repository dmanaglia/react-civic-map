// src/components/UsMap/UsMap.tsx
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import type { District, State } from "../../models/MapProps";
import { useTooltip } from "./useTooltip";
import { useMapZoom } from "./useMapZoom";
import "./UsMap.css";

interface UsMapProps {
  districtMap?: unknown;
  nationalMap: unknown;
  type: string;
  setState: (stateId: State | null) => void;
  setDistrict: (feature: District | null) => void;
}

export default function UsMap({
  nationalMap,
  districtMap,
  type,
  setState,
  setDistrict,
}: UsMapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gStatesRef = useRef<SVGGElement | null>(null);
  const gFeatureRef = useRef<SVGGElement | null>(null);

  const { showTooltip, hideTooltip } = useTooltip();
  const { zoomToBounds, applyCurrentTransform } = useMapZoom(svgRef, gStatesRef, gFeatureRef);

  useEffect(() => {
    if (!nationalMap) return;
    const svg = d3.select(svgRef.current);
    const gStates = gStatesRef.current ? d3.select(gStatesRef.current) : svg.append("g");
    const width = 960;
    const height = 600;
    const projection = d3.geoAlbersUsa().scale(1300).translate([480, 300]);
    const path = d3.geoPath().projection(projection);

    gStates
      .selectAll<SVGPathElement, unknown>("path")
      .data(nationalMap.features)
      .join("path")
      .attr("class", "state")
      .attr("d", path)
      .on("click", (event, feature: unknown) => {
        event.stopPropagation();
        const bounds = path.bounds(feature);
        zoomToBounds(bounds, width, height);
        setState({
          NAME: feature.properties.NAME,
          STATEFP: feature.properties.STATEFP,
          USPS: feature.properties.STUSPS,
        });
        setDistrict(null);
      })
      .on("mouseover", (event, feature) => showTooltip(feature.properties.NAME, event.pageX, event.pageY))
      .on("mousemove", (event, feature) => showTooltip(feature.properties.NAME, event.pageX, event.pageY))
      .on("mouseout", hideTooltip);

    applyCurrentTransform();
  }, [nationalMap, applyCurrentTransform, hideTooltip, setDistrict, setState, showTooltip, zoomToBounds]);

  useEffect(() => {
    if (!districtMap) return;
    const svg = d3.select(svgRef.current);
    const gFeature = gFeatureRef.current ? d3.select(gFeatureRef.current) : svg.append("g");
    const width = 960;
    const height = 600;
    const projection = d3.geoAlbersUsa().scale(1300).translate([480, 300]);
    const path = d3.geoPath().projection(projection);

    gFeature
      .selectAll<SVGPathElement, any>("path")
      .data(districtMap.features)
      .join("path")
      .attr("d", path as any)
      .attr("fill", (d: any) => {
        const party = d.properties.party?.toLowerCase();
        console.log(party)
        if (!party) return "#cf8c51ff"
        if (party.includes("democratic")) return "#2b83ba"; // blue
        if (party.includes("republican")) return "#d7191c"; // red
        return "#cccccc"; // gray fallback
      })
      .attr("class", (d: any) => {
        const party = d.properties.party?.toLowerCase();
        if (!party) return "unknown"
        if (party === "democratic") return "democrat"; // blue
        if (party === "republican") return "republican"; // red
        return "independent"; // gray fallback
      })
      .on("click", (event, feature: any) => {
        event.stopPropagation();
        const bounds = path.bounds(feature);
        zoomToBounds(bounds, width, height);
        setDistrict({
          TYPE: type,
          NAME: feature.properties.NAMELSAD,
          ID: type === 'cd'
            ? feature.properties.CD119FP
            : feature.properties.NAME
        });
      })
      .on("mouseover", (event, feature: any) =>
        showTooltip(type === "cd" ? feature.properties.NAMELSAD : feature.properties.NAME, event.pageX, event.pageY)
      )
      .on("mousemove", (event, feature: any) =>
        showTooltip(type === "cd" ? feature.properties.NAMELSAD : feature.properties.NAME, event.pageX, event.pageY)
      )
      .on("mouseout", hideTooltip);

    applyCurrentTransform();
  }, [districtMap, type, applyCurrentTransform, hideTooltip, setDistrict, showTooltip, zoomToBounds]);

  return (
    <div className="usmap-container">
      <div className="usmap-svg-wrapper">
        <svg ref={svgRef} className="usmap-svg" viewBox="0 0 960 600" preserveAspectRatio="xMidYMid meet">
          <g ref={gStatesRef}></g>
          <g ref={gFeatureRef}></g>
        </svg>
      </div>
    </div>
  );
}
