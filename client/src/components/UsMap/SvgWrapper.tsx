import React from 'react';

interface SvgWrapperProps {
	svgRef: React.RefObject<SVGSVGElement | null>;
	gStatesRef: React.RefObject<SVGGElement | null>;
	gFeatureRef: React.RefObject<SVGGElement | null>;
}

export const SvgWrapper: React.FC<SvgWrapperProps> = ({ svgRef, gStatesRef, gFeatureRef }) => {
	return (
		<div className="relative w-full max-h-11/12 border-4 border-double border-blue-800 bg-red-50">
			<div className="w-full h-full">
				<svg
					ref={svgRef}
					className="w-full h-full"
					viewBox="0 0 960 600"
					preserveAspectRatio="xMidYMid meet"
				>
					<g ref={gStatesRef}></g>
					<g ref={gFeatureRef}></g>
				</svg>
			</div>
		</div>
	);
};

export default SvgWrapper;
