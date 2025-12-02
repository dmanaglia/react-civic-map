// import type { State, District } from '../../models/MapProps';
import { OfficialSidebar } from '../OfficialsData/OfficialSidebar';
import { Spinner } from '../Spinner';
// import LeafletUsMap from '../UsMap/Leaflet/LeafletUsMap';
import { UsMap } from '../UsMap/UsMap';
import { useAddressData } from './hooks/useAddressData';
import { useBackdropData } from './hooks/useBackdropData';
import { useGeoData } from './hooks/useGeoData';
import { useMapContainerState } from './hooks/useMapContainerState';
import { useOfficialsData } from './hooks/useOfficialsData';
import { MapHeader } from './MapHeader';

export const MapContainer = () => {
	const {
		state,
		district,
		official,
		type,
		sidebarOpen,
		sidebarType,
		handleSetState,
		handleSetDistrict,
		handleSetType,
		toggleSidebar,
		setOfficial,
		setSidebarType,
	} = useMapContainerState();
	const { loadingOfficial } = useOfficialsData({ district, state, setOfficial });
	const { nationalMap, districtMap, summary, loadingMap } = useGeoData(type, state);
	const { officialList, loadingAddressOfficials, findOfficials } = useAddressData();
	const { backdropData, loadingBackdrop } = useBackdropData();

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
					<UsMap
						officialList={officialList}
						districtMap={districtMap}
						nationalMap={nationalMap}
						backdropData={backdropData}
						type={type}
						sidebarType={sidebarType}
						state={state}
						district={district}
						setState={handleSetState}
						setDistrict={handleSetDistrict}
					/>
					<OfficialSidebar
						district={district}
						loading={loadingOfficial || loadingAddressOfficials}
						official={official}
						officialList={officialList}
						open={sidebarOpen}
						state={state}
						summary={summary}
						type={type}
						sidebarType={sidebarType}
						onToggle={toggleSidebar}
						findOfficials={findOfficials}
						setSidebarType={setSidebarType}
					/>
				</div>
			)}

			{(loadingMap || loadingBackdrop) && <Spinner fullscreen />}
		</div>
	);
};
