import { Close, Menu } from '@mui/icons-material';
import { Drawer, IconButton } from '@mui/material';
import type { Official } from '../../../models/OfficialProps';
import { Spinner } from '../../Spinner';
import { Representative } from '../Representative';
import { AddressInput } from './AddressInput';

interface AddressLookupSidebarProps {
	findOfficials: (address: string) => Promise<void>;
	officialList: Official[];
	loading: boolean;
	onToggle: () => void;
	open: boolean;
}

export const AddressLookupSidebar = ({
	findOfficials,
	officialList,
	loading,
	onToggle,
	open,
}: AddressLookupSidebarProps) => {
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
				anchor="left"
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
						borderRadius: '0 16px 16px 0',
						transition: 'width 0.3s ease',
						marginRight: open ? 2 : 0,
					},
				}}
			>
				{/* Header */}
				<div className="flex items-center justify-between gap-3 p-6 pb-0">
					<div>
						<h2 className="text-l font-semibold">Lookup Your Representatives:</h2>
					</div>

					<IconButton
						onClick={onToggle}
						aria-label="Close sidebar"
						className="rounded-md hover:bg-gray-100"
					>
						<Close />
					</IconButton>
				</div>

				<AddressInput findOfficials={findOfficials} />

				{/* Content */}
				{loading ? (
					<div className="flex justify-center mt-6">
						<Spinner />
					</div>
				) : (
					<div className="p-3">
						{officialList.map((official) => (
							<Representative state={null} district={null} official={official} />
						))}
					</div>
				)}
			</Drawer>
		</>
	);
};
