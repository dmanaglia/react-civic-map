import { Close, Menu } from '@mui/icons-material';
import { Drawer } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import type { District, FederalSummary, MapType, StateSummary, State } from '../../models/MapProps';
import type { Official } from '../../models/OfficialProps';
import { Spinner } from '../Spinner';
import { GovSummary } from './GovSummary/GovSummary';
import { Representative } from './Representative';

interface OfficialSidebarProps {
	district: District | null;
	loading: boolean;
	official: Official | null;
	onToggle: () => void;
	onClose: () => void;
	open: boolean;
	state: State | null;
	summary: FederalSummary | StateSummary | null;
	type: MapType;
}

export const OfficialSidebar = ({
	loading,
	open,
	onToggle,
	onClose,
	state,
	type,
	district,
	official,
	summary,
}: OfficialSidebarProps) => {
	return (
		<>
			{/* Toggle handle when closed */}
			{!open && (
				<IconButton
					onClick={onToggle}
					aria-label="Open sidebar"
					size="small"
					//top-80 needs to be adjusted...
					className="
						fixed top-80 z-50
						w-10 h-10 p-0
						bg-white border border-gray-300
						rounded-md shadow 
						flex items-center justify-center
						hover:bg-gray-100
						transition
					"
					sx={{
						margin: 1,
					}}
				>
					<Menu className="w-6 h-6 text-gray-800" />
				</IconButton>
			)}

			<Drawer
				anchor="right"
				open={open}
				variant="persistent"
				sx={{
					position: 'relative',
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						position: 'relative',
						width: open ? 360 : 0,
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						borderRadius: '16px 0 0 16px',
						transition: 'width 0.3s ease',
						marginLeft: open ? 2 : 0,
					},
				}}
			>
				{/* Header */}
				<div className="flex items-center justify-between gap-3 p-6 pb-0">
					<div>
						<h1 className="text-3xl font-semibold">{state ? state.NAME : 'Federal'}</h1>
						{district && (
							<h3 className="text-base font-semibold text-gray-800 m-0">{district.NAME}</h3>
						)}
						<small className="text-sm text-gray-500">
							{district
								? 'Representative details'
								: type === 'cd'
									? 'Federal Representation'
									: 'Government Details'}
						</small>
					</div>

					<IconButton
						onClick={onClose}
						aria-label="Close sidebar"
						className="rounded-md hover:bg-gray-100"
					>
						<Close />
					</IconButton>
				</div>

				{/* Content */}
				{loading ? (
					<div className="flex justify-center mt-6">
						<Spinner />
					</div>
				) : official ? (
					<Representative state={state} district={district} official={official} />
				) : (
					summary && <GovSummary summary={summary} type={type} state={state} district={district} />
				)}
			</Drawer>
		</>
	);
};
