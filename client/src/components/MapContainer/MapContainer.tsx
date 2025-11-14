import { useCallback, useState } from "react";
import MapHeader from "../MapHeader";
import UsMap from "../UsMap/UsMap";
import Spinner from "../Spinner";
import OfficialSidebar from "../OfficialsData/OfficialSidebar";
import { useGeoData } from "./hooks/useGeoData";
import { useOfficialsData } from "./hooks/useOfficialsData";
import type { District, MapType, State } from "../../models/MapProps";
import './MapContainer.css';

export default function MapContainer() {
  const [state, setState] = useState<State | null>(null);
  const [district, setDistrict] = useState<District | null>(null);
  const [type, setType] = useState<MapType>("cd");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { nationalMap, districtMap, summary, loadingMap } = useGeoData(type, state);
  const {official, setOfficial, loadingOfficial} = useOfficialsData(district, state);

  const handleSetState = useCallback((state: State | null) => {
    setState(state);
    setOfficial(null);
    setSidebarOpen(true);
  }, [setOfficial]);

  const handleSetDistrict = useCallback((district: District | null) => {
    setDistrict(district);
    setSidebarOpen(true);
  }, []);

  const handleSetType = useCallback((type: MapType) => {
    setDistrict(null);
    setOfficial(null);
    setType(type);
  }, [setOfficial]);

  return (
    <div>
      <MapHeader type={type} setType={handleSetType} />

      {nationalMap && (
        <main className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
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
            onToggle={() => setSidebarOpen(open => !open)}
            onClose={() => setSidebarOpen(false)}
            open={sidebarOpen}
            state={state}
            summary={summary}
            type={type}
          />
        </main>
      )}

      {loadingMap && <Spinner />}
    </div>
  );
}
