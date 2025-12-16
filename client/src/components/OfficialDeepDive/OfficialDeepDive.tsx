import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import InfoIcon from '@mui/icons-material/Info';
import PaymentsIcon from '@mui/icons-material/Payments';
import { Button, ButtonGroup, Card } from '@mui/material';
import { useState } from 'react';
import type { MapType } from '../../models/MapProps';
import type { Official } from '../../models/OfficialProps';
import { CareerOverview } from './CareerOverview';
import { ContactInfo } from './ContactInfo';
import { FECData } from './FECData';
import { useFECData } from './hooks/useFECData';
import { VotingHistory } from './VotingHistory';

interface OfficialDeepDiveProps {
	official: Official | null;
	type: MapType;
}

type Selection = 'overview' | 'contact' | 'fec' | 'voting';

export const OfficialDeepDive = ({ official, type }: OfficialDeepDiveProps) => {
	const [selection, setSelection] = useState<Selection>('overview');
	const { officialFECSummary, cycle, setCycle } = useFECData({ official, type });

	const renderContent = () => {
		switch (selection) {
			case 'contact':
				return <ContactInfo />;
			case 'fec':
				return (
					<FECData officialFECSummary={officialFECSummary} cycle={cycle} setCycle={setCycle} />
				);
			case 'voting':
				return <VotingHistory />;
			default:
				return <CareerOverview official={official} />;
		}
	};

	return (
		<div className="space-y-6 m-10 flex" id="FEC-info">
			<ButtonGroup orientation="vertical" sx={{ width: 250 }}>
				<Button
					sx={{ height: 100 }}
					variant={selection === 'overview' ? 'contained' : 'outlined'}
					endIcon={<InfoIcon />}
					onClick={() => setSelection('overview')}
				>
					Overview
				</Button>
				<Button
					sx={{ height: 100 }}
					variant={selection === 'contact' ? 'contained' : 'outlined'}
					endIcon={<ContactPhoneIcon />}
					onClick={() => setSelection('contact')}
				>
					Contact
				</Button>
				{type === 'cd' && (
					<Button
						sx={{ height: 100 }}
						variant={selection === 'fec' ? 'contained' : 'outlined'}
						endIcon={<PaymentsIcon />}
						onClick={() => setSelection('fec')}
					>
						FEC Data
					</Button>
				)}
				<Button
					sx={{ height: 100 }}
					variant={selection === 'voting' ? 'contained' : 'outlined'}
					endIcon={<AssuredWorkloadIcon />}
					onClick={() => setSelection('voting')}
				>
					Voting Record
				</Button>
			</ButtonGroup>
			<Card className="p-5" sx={{ position: 'relative', width: '100%', minHeight: 500 }}>
				{renderContent()}
			</Card>
		</div>
	);
};
