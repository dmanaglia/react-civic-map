import { MapHeader } from '../MapHeader';
import { OfficialSidebar } from '../OfficialsData/OfficialSidebar';
import { Spinner } from '../Spinner';
import { UsMap } from '../UsMap/UsMap';
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

	return (
		<div>
			<MapHeader type={type} setType={handleSetType} />
			{nationalMap && (
				<main
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
				</main>
			)}

			{loadingMap && <Spinner fullscreen />}
		</div>
	);
};
