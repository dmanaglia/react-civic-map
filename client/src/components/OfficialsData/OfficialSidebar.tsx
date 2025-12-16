import { Close, Menu } from '@mui/icons-material';
import { Drawer, Tab, Tabs } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import type { District, FederalSummary, MapType, StateSummary, State } from '../../models/MapProps';
import type { AddressOfficials, Official } from '../../models/OfficialProps';
import { Spinner } from '../Spinner';
import { AddressLookupSidebar } from './AddressLookup/AddressLookupSidebar';
import { GovSummary } from './GovSummary/GovSummary';

interface OfficialSidebarProps {
	district: District | null;
	loading: boolean;
	official: Official | null;
	officialList: AddressOfficials | null;
	open: boolean;
	state: State | null;
	summary: FederalSummary | StateSummary | null;
	type: MapType;
	sidebarType: 'summary' | 'address';
	onToggle: () => void;
	findOfficials: (address: string) => Promise<void>;
	setSidebarType: (type: 'summary' | 'address') => void;
	handleSetType: (type: MapType) => void;
	setOfficial: (official: Official | null) => void;
}

export const OfficialSidebar = ({
	loading,
	open,
	state,
	summary,
	district,
	official,
	officialList,
	type,
	sidebarType,
	onToggle,
	findOfficials,
	setSidebarType,
	handleSetType,
	setOfficial,
}: OfficialSidebarProps) => {
	const handleChange = (_: React.SyntheticEvent, activeTab: 'summary' | 'address') => {
		setSidebarType(activeTab);
	};

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
						fixed top-80
						w-10 h-10 p-0
						rounded-md shadow 
						flex items-center justify-center
						transition
					"
					sx={{
						margin: 1,
					}}
				>
					<Menu className="w-6 h-6" />
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
						zIndex: 1,
						marginLeft: open ? 2 : 0,
					},
				}}
			>
				{/* Sidebar switch */}
				<Tabs
					value={sidebarType}
					onChange={handleChange}
					aria-label="Branches of Government"
					variant="fullWidth"
					textColor="primary"
					indicatorColor="primary"
					className="border-b mb-3"
				>
					<Tab label="Address Lookup" value="address" className="font-semibold normal-case" />
					<Tab label="Gov Summary" value="summary" className="font-semibold normal-case" />
				</Tabs>

				{/* Header */}
				<div className="flex items-center justify-between gap-3 p-6 pb-0">
					{sidebarType === 'address' ? (
						<h2 className="text-l font-semibold">Lookup Your Representatives:</h2>
					) : (
						<div>
							<h1 className="text-3xl font-semibold">{state ? state.NAME : 'Federal'}</h1>
							{district && <h3 className="text-base font-semibold m-0">{district.NAME}</h3>}
							<small className="text-sm">
								{district
									? 'Representative details'
									: type === 'cd'
										? 'Federal Representation'
										: 'Government Details'}
							</small>
						</div>
					)}

					<IconButton onClick={onToggle} aria-label="Close sidebar" className="rounded-md">
						<Close />
					</IconButton>
				</div>

				{/* Content */}
				{loading && (
					<div className="flex justify-center mt-6">
						<Spinner />
					</div>
				)}

				{sidebarType === 'address' ? (
					<AddressLookupSidebar
						findOfficials={findOfficials}
						officialList={officialList}
						setOfficial={setOfficial}
					/>
				) : (
					<GovSummary
						key={type}
						summary={summary}
						type={type}
						state={state}
						district={district}
						official={official}
						handleSetType={handleSetType}
						setOfficial={setOfficial}
					/>
				)}
			</Drawer>
		</>
	);
};
