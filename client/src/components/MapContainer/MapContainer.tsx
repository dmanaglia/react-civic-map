import { MapHeader } from '../MapHeader';
import { AddressInput } from '../OfficialsData/AddressLookup/AddressInput';
import { OfficialSidebar } from '../OfficialsData/OfficialSidebar';
import { Spinner } from '../Spinner';
import { UsMap } from '../UsMap/UsMap';
import { useAddressData } from './hooks/useAddressData';
import { useGeoData } from './hooks/useGeoData';
import { useMapContainerState } from './hooks/useMapContainerState';
import { useOfficialsData } from './hooks/useOfficialsData';

export const MapContainer = () => {
	const {
		state,
		district,
		official,
		type,
		sidebarOpen,
		handleSetState,
		handleSetDistrict,
		handleSetType,
		toggleSidebar,
		setOfficial,
	} = useMapContainerState();
	const { loadingOfficial } = useOfficialsData({ district, state, setOfficial });
	const { nationalMap, districtMap, summary, loadingMap } = useGeoData(type, state);
	const { findOfficials } = useAddressData();

	return (
		<div>
			<MapHeader type={type} setType={handleSetType} />
			{nationalMap && (
				<>
					<div
						className={`flex relative`}
						style={{
							maxHeight: '80vh',
						}}
					>
						<UsMap
							districtMap={districtMap}
							nationalMap={nationalMap}
							type={type}
							setState={handleSetState}
							setDistrict={handleSetDistrict}
						/>
						<OfficialSidebar
							district={district}
							loading={loadingOfficial}
							official={official}
							onToggle={toggleSidebar}
							open={sidebarOpen}
							state={state}
							summary={summary}
							type={type}
						/>
					</div>
					<div>
						<AddressInput findOfficials={findOfficials} />
					</div>
				</>
			)}

			{loadingMap && <Spinner fullscreen />}
		</div>
	);
};
