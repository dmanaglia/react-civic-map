import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';
import { SvgWrapper } from './SvgWrapper';

describe('<SvgWrapper />', () => {
	it('renders the svg element', () => {
		const svgRef = React.createRef<SVGSVGElement>();
		const gStatesRef = React.createRef<SVGGElement>();
		const gDistrictRef = React.createRef<SVGGElement>();
		const gOfficialsRef = React.createRef<SVGGElement>();

		const { container } = render(
			<SvgWrapper
				svgRef={svgRef}
				gStatesRef={gStatesRef}
				gDistrictRef={gDistrictRef}
				gOfficialsRef={gOfficialsRef}
			/>,
		);

		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
		expect(svgRef.current).toBe(container.querySelector('svg'));
		const groups = container.querySelectorAll('g');
		expect(groups.length).toBe(3);
	});
});
