import { useCallback, useState } from "react";
import MapHeader from "../MapHeader";
import UsMap from "../UsMap/UsMap";
import Spinner from "../Spinner";
import OfficialSidebar from "../OfficialsData/OfficialSidebar";
import { useGeoData } from "./hooks/useGeoData";
import { useOfficialsData } from "./hooks/useOfficialsData";
import FeatureProps from "../../models/FeatureProps";
import StateProps from "../../models/StateProps";
import './MapContainer.css';

export default function MapContainer() {
  const [state, setState] = useState<StateProps | null>(null);
  const [feature, setFeature] = useState<FeatureProps | null>(null);
  const [type, setType] = useState<string>("cd");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { statesData, featureData, loadingMap } = useGeoData(type, state);
  const {officialsData, setOfficialsData, loadingOfficial} = useOfficialsData(feature, state);

  const handleSetState = useCallback((s: any) => {
    setState(s);
    setSidebarOpen(true);
    setOfficialsData(null);
  }, [setOfficialsData]);

  const handleSetFeature = useCallback((f: any) => {
    setFeature(f);
    setSidebarOpen(true);
    // setOfficialsData(null);
  }, []);

  const handleSetType = useCallback((t: string) => {
    setType(t);
    setSidebarOpen(true);
    setFeature(null);
    setOfficialsData(null);
  }, [setOfficialsData]);

  return (
    <div>
      <MapHeader type={type} setType={handleSetType} />

      {statesData && (
        <main className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
          <UsMap
            statesGeoJson={statesData}
            featureGeoJson={featureData}
            type={type}
            setState={handleSetState}
            setFeature={handleSetFeature}
            shrink={sidebarOpen}
          />
          <OfficialSidebar
            loading={loadingOfficial}
            open={sidebarOpen}
            onToggle={() => setSidebarOpen(open => !open)}
            onClose={() => setSidebarOpen(false)}
            state={state}
            type={type}
            feature={feature}
            officialsData={officialsData}
          />
        </main>
      )}

      {loadingMap && <Spinner />}
    </div>
  );
}
