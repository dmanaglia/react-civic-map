import { renderHook, act, waitFor } from '@testing-library/react';
import { useTooltip } from './useTooltip';

describe('useTooltip', () => {
	test('shows the tooltip with correct text and position', async () => {
		const { result } = renderHook(() => useTooltip());

		act(() => {
			result.current.showTooltip('Test Tooltip Text', 100, 200);
		});

		waitFor(() => {
			const tooltip = document.querySelector('div');
			expect(tooltip).toBeTruthy();
			expect(tooltip?.textContent).toBe('Test Tooltip Text');
			expect(tooltip?.style.visibility).toBe('visible');
			expect(tooltip?.style.top).toBe('210px');
			expect(tooltip?.style.left).toBe('110px');
		});
	});

	test('shows then hides the tooltip', async () => {
		const { result } = renderHook(() => useTooltip());

		act(() => {
			result.current.showTooltip('Test Tooltip Text', 100, 200);
		});

		waitFor(() => expect(document.querySelector('div')).toHaveStyle('visibility: visible'));

		act(() => {
			result.current.hideTooltip();
		});

		waitFor(() => {
			expect(document.querySelector('div')).toHaveStyle('visibility: hidden');
		});
	});
});
