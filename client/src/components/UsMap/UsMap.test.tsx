import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UsMap from './UsMap';

// ---- minimal mocks ----
vi.mock('./SvgWrapper', () => ({
	SvgWrapper: ({
		svgRef,
		gStatesRef,
		gFeatureRef,
	}: {
		svgRef: unknown;
		gStatesRef: unknown;
		gFeatureRef: unknown;
	}) => {
		return (
			<div
				data-testid="svg-wrapper"
				data-svg-ref={!!svgRef}
				data-gstates-ref={!!gStatesRef}
				data-gfeature-ref={!!gFeatureRef}
			/>
		);
	},
}));

// The hooks are mocked only so that the render does not execute D3
vi.mock('./useDrawStates', () => ({ useDrawStates: vi.fn() }));
vi.mock('./useDrawDistricts', () => ({ useDrawDistricts: vi.fn() }));
vi.mock('./useMapZoom', () => ({
	useMapZoom: () => ({ zoomToBounds: vi.fn(), applyCurrentTransform: vi.fn() }),
}));
vi.mock('./useTooltip', () => ({
	useTooltip: () => ({ showTooltip: vi.fn(), hideTooltip: vi.fn() }),
}));

describe('<UsMap />', () => {
	it('renders the SvgWrapper', () => {
		render(
			<UsMap
				nationalMap={null}
				districtMap={null}
				type="cd"
				setState={() => {}}
				setDistrict={() => {}}
			/>,
		);

		const wrapper = screen.getByTestId('svg-wrapper');
		expect(wrapper).toBeInTheDocument();
	});
});
