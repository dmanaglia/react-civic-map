import CircularProgress from '@mui/material/CircularProgress';

interface SpinnerProps {
	fullscreen?: boolean;
}

export const Spinner = ({ fullscreen = false }: SpinnerProps) => {
	return (
		<div
			className={
				fullscreen
					? 'fixed inset-0 bg-indigo-500/30 flex items-center justify-center z-9999'
					: 'absolute inset-0 bg-white/60 flex items-center justify-center z-50'
			}
		>
			<CircularProgress enableTrackSlot size="4rem" />
		</div>
	);
};
