import { useCallback, useEffect, useRef } from 'react';

export function useTooltip() {
	const tooltipRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		// Create tooltip once on mount
		const tooltip = document.createElement('div');
		tooltip.className =
			'absolute pointer-events-none bg-black/80 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-md';
		tooltip.style.visibility = 'hidden'; // keep visibility inline
		document.body.appendChild(tooltip);

		tooltipRef.current = tooltip;

		return () => {
			tooltip.remove();
		};
	}, []);

	const showTooltip = useCallback((text: string, x: number, y: number) => {
		if (!tooltipRef.current) return;
		tooltipRef.current.innerText = text;
		tooltipRef.current.style.visibility = 'visible';
		tooltipRef.current.style.top = `${y + 10}px`;
		tooltipRef.current.style.left = `${x + 10}px`;
	}, []);

	const hideTooltip = useCallback(() => {
		if (tooltipRef.current) tooltipRef.current.style.visibility = 'hidden';
	}, []);

	return { showTooltip, hideTooltip };
}
