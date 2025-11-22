import { MapHeader } from '../MapHeader';
import { AddressLookupSidebar } from '../OfficialsData/AddressLookup/AddressLookupSidebar';
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
		sidebarOpenL,
		sidebarOpenR,
		handleSetState,
		handleSetDistrict,
		handleSetType,
		toggleSidebarR,
		toggleSidebarL,
		setOfficial,
	} = useMapContainerState();
	const { loadingOfficial } = useOfficialsData({ district, state, setOfficial });
	const { nationalMap, districtMap, summary, loadingMap } = useGeoData(type, state);
	const { officialList, loadingAddressOfficials, findOfficials } = useAddressData();

	return (
		<div>
			<MapHeader type={type} setType={handleSetType} />
			{nationalMap && (
				<div
					className={`flex relative`}
					style={{
						maxHeight: '80vh',
					}}
				>
					<AddressLookupSidebar
						findOfficials={findOfficials}
						officialList={officialList}
						loading={loadingAddressOfficials}
						onToggle={toggleSidebarL}
						open={sidebarOpenL}
					/>
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
						onToggle={toggleSidebarR}
						open={sidebarOpenR}
						state={state}
						summary={summary}
						type={type}
					/>
				</div>
			)}

			{loadingMap && <Spinner fullscreen />}
		</div>
	);
};
