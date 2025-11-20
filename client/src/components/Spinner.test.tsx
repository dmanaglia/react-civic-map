import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner', () => {
	it('renders CircularProgress', () => {
		render(<Spinner />);
		expect(screen.getByRole('progressbar')).toBeInTheDocument();
	});

	it('applies fullscreen classes when fullscreen=true', () => {
		render(<Spinner fullscreen />);

		const wrapper = screen.getByRole('progressbar').parentElement;
		expect(wrapper).toHaveClass(
			'fixed inset-0 bg-indigo-500/30 flex items-center justify-center z-9999',
		);
	});

	it('applies default classes when fullscreen=false', () => {
		render(<Spinner />);

		const wrapper = screen.getByRole('progressbar').parentElement;
		expect(wrapper).toHaveClass(
			'absolute inset-0 bg-white/60 flex items-center justify-center z-50',
		);
	});
});
