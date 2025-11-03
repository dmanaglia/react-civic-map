import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface UsMapProps {
    statesGeoJson: any;
    districtsGeoJson?: any; // optional districts overlay
    setStateId: (stateId: string) => void;
}

export default function UsMap({ statesGeoJson, districtsGeoJson, setStateId }: UsMapProps) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const zoomRef = useRef<d3.ZoomTransform | null>(null);
    const gStatesRef = useRef<SVGGElement | null>(null);
    const gDistrictsRef = useRef<SVGGElement | null>(null);
      const tooltipRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Create tooltip div if it doesn't exist
        if (!tooltipRef.current) {
        tooltipRef.current = document.createElement("div");
        tooltipRef.current.style.position = "absolute";
        tooltipRef.current.style.pointerEvents = "none";
        tooltipRef.current.style.background = "rgba(0,0,0,0.7)";
        tooltipRef.current.style.color = "#fff";
        tooltipRef.current.style.padding = "4px 8px";
        tooltipRef.current.style.borderRadius = "4px";
        tooltipRef.current.style.fontSize = "12px";
        tooltipRef.current.style.fontFamily = "sans-serif";
        tooltipRef.current.style.visibility = "hidden";
        document.body.appendChild(tooltipRef.current);
        }
    }, []);

    useEffect(() => {
        if (!statesGeoJson) return;

        const svg = d3.select(svgRef.current);
        const width = 960;
        const height = 600;

        const projection = d3.geoAlbersUsa().scale(1300).translate([480, 300]);
        const path = d3.geoPath().projection(projection);

        // Initialize groups if they don't exist
        if (!gStatesRef.current) gStatesRef.current = svg.append("g").node() as SVGGElement;
        if (!gDistrictsRef.current) gDistrictsRef.current = svg.append("g").node() as SVGGElement;

        const gStates = d3.select(gStatesRef.current);
        const gDistricts = d3.select(gDistrictsRef.current);

        // Zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 8])
            .on("zoom", (event) => {
                zoomRef.current = event.transform;
                gStates.attr("transform", event.transform.toString());
                gDistricts.attr("transform", event.transform.toString());
                gStates.selectAll("path").attr("stroke-width", 0.5 / event.transform.k);
                gDistricts.selectAll("path").attr("stroke-width", 0.5 / event.transform.k);
            });

        svg.call(zoom as any);

        // Draw states once
        const states = gStates.selectAll<SVGPathElement, any>("path").data(statesGeoJson.features);
        states.join(
            enter =>
                enter
                .append("path")
                .attr("class", "state")
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

                    setStateId(feature.properties.STATEFP);
                }),
            update => update.attr("d", path as any)
        );

        // Draw districts
        if (districtsGeoJson) {
            const districts = gDistricts.selectAll<SVGPathElement, any>("path").data(districtsGeoJson.features);
            districts.join(
                enter =>
                enter
                    .append("path")
                    .attr("class", "district")
                    .attr("d", path as any)
                    .attr("fill", "rgba(255,165,0,0.3)")
                    .attr("stroke", "#ff8c00")
                    .attr("stroke-width", 0.5)
                    .attr("cursor", "pointer")
                    .on("click", (event, feature: any) => {
                    event.stopPropagation();
                    console.log("District clicked:", feature.properties.GEOID, feature.properties.NAME);
                    }),
                update => update.attr("d", path as any),
                exit => exit.remove()
            );
            }

            // Reset zoom when clicking background
            svg.on("click", () => {
            svg.transition().duration(750).call(zoom.transform as any, d3.zoomIdentity);
        });

        // Restore previous transform if any
        if (zoomRef.current) {
            gStates.attr("transform", zoomRef.current.toString());
            gDistricts.attr("transform", zoomRef.current.toString());
            gStates.selectAll("path").attr("stroke-width", 0.5 / zoomRef.current.k);
            gDistricts.selectAll("path").attr("stroke-width", 0.5 / zoomRef.current.k);
        }

        const tooltip = tooltipRef.current;

        // STATES
        gStates.selectAll(".state")
        .on("mouseover", (event, feature: any) => {
            if (!tooltip) return;
            tooltip.style.visibility = "visible";
            tooltip.innerText = feature.properties.NAME;
        })
        .on("mousemove", (event) => {
            if (!tooltip) return;
            tooltip.style.top = event.pageY + 10 + "px";
            tooltip.style.left = event.pageX + 10 + "px";
        })
        .on("mouseout", () => {
            if (!tooltip) return;
            tooltip.style.visibility = "hidden";
        });

        // DISTRICTS
        if (districtsGeoJson) {
            gDistricts.selectAll(".district")
            .on("mouseover", (event, feature: any) => {
                if (!tooltip) return;
                tooltip.style.visibility = "visible";
                tooltip.innerText = feature.properties.NAME; // or include GEOID
            })
            .on("mousemove", (event) => {
                if (!tooltip) return;
                tooltip.style.top = event.pageY + 10 + "px";
                tooltip.style.left = event.pageX + 10 + "px";
            })
            .on("mouseout", () => {
                if (!tooltip) return;
                tooltip.style.visibility = "hidden";
            });
        }
    }, [statesGeoJson, districtsGeoJson]);

    return <svg ref={svgRef} width={960} height={600}></svg>;
}
