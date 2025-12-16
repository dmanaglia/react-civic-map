// ----------------------------------
// Types
// ----------------------------------
export interface DonutSegment {
	label: string;
	value: number; // absolute value
	className?: string; // stroke color via Tailwind (e.g. stroke-democrat)
}

interface DonutChartProps {
	segments: DonutSegment[];
	size?: number; // px
	strokeWidth?: number;
	showTrack?: boolean;
	trackClassName?: string;
	ariaLabel?: string;
}

// ----------------------------------
// Component
// ----------------------------------
export const DonutChart = ({
	segments,
	size = 120,
	strokeWidth = 3,
	showTrack = true,
	trackClassName = 'stroke-gray-200 dark:stroke-gray-700',
	ariaLabel = 'Donut chart',
}: DonutChartProps) => {
	const total = segments.reduce((sum, s) => sum + s.value, 0);

	// Avoid division by zero
	if (total === 0) {
		return (
			<svg
				viewBox="0 0 36 36"
				className="w-full h-full"
				role="img"
				aria-label={ariaLabel}
				style={{ width: size, height: size }}
			>
				{showTrack && (
					<circle
						cx="18"
						cy="18"
						r="15.9"
						strokeWidth={strokeWidth}
						fill="none"
						className={trackClassName}
					/>
				)}
			</svg>
		);
	}

	let cumulativeOffset = 0;

	return (
		<svg
			viewBox="0 0 36 36"
			className="w-full h-full"
			role="img"
			aria-label={ariaLabel}
			style={{ width: size, height: size }}
		>
			{/* Background track */}
			{showTrack && (
				<circle
					cx="18"
					cy="18"
					r="15.9"
					strokeWidth={strokeWidth}
					fill="none"
					className={trackClassName}
				/>
			)}

			{/* Segments */}
			{segments.map((segment, index) => {
				const percent = (segment.value / total) * 100;
				const dashArray = `${percent} ${100 - percent}`;
				const dashOffset = 100 - cumulativeOffset;

				// eslint-disable-next-line react-hooks/immutability
				cumulativeOffset += percent;

				return (
					<circle
						key={index}
						cx="18"
						cy="18"
						r="15.9"
						strokeWidth={strokeWidth}
						fill="none"
						strokeDasharray={dashArray}
						strokeDashoffset={dashOffset}
						transform="rotate(-90 18 18)"
						className={`transition-all duration-700 ease-out stroke-linecap-round ${
							segment.className ?? 'stroke-gray-500'
						}`}
					/>
				);
			})}
		</svg>
	);
};
