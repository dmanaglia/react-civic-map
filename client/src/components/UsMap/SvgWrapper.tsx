import React from 'react';

interface SvgWrapperProps {
	svgRef: React.RefObject<SVGSVGElement | null>;
	gStatesRef: React.RefObject<SVGGElement | null>;
	gDistrictRef: React.RefObject<SVGGElement | null>;
	gOfficialsRef: React.RefObject<SVGGElement | null>;
	sidebarType: 'summary' | 'address';
}

export const SvgWrapper: React.FC<SvgWrapperProps> = ({
	svgRef,
	gStatesRef,
	gDistrictRef,
	gOfficialsRef,
}) => {
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
					<g ref={gOfficialsRef}></g>
					<g ref={gDistrictRef}></g>
				</svg>
			</div>
		</div>
	);
};

export default SvgWrapper;
