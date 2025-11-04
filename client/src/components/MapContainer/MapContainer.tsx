import { useState } from "react";
import MapHeader from "../MapHeader";
import UsMap from "../UsMap/UsMap";
import Spinner from "../Spinner";
import OfficialData from "../OfficialsData/OfficialData";
import { useGeoData } from "./hooks/useGeoData";
import { useOfficialsData } from "./hooks/useOfficialsData";
import FeatureProps from "../../models/FeatureProps";
import StateProps from "../../models/StateProps";

export default function MapContainer() {
  const [state, setState] = useState<StateProps | null>(null);
  const [feature, setFeature] = useState<FeatureProps | null>(null);
  const [type, setType] = useState<string>("cd");

  const { statesData, featureData, loading } = useGeoData(type, state);
  const officialsData = useOfficialsData(feature, state);

  return (
    <div>
      <MapHeader type={type} setType={setType} />

      {statesData && (
        <>
          <UsMap
            statesGeoJson={statesData}
            featureGeoJson={featureData}
            type={type}
            setState={setState}
            setFeature={setFeature}
          />
          {officialsData && state && feature && (
            <OfficialData
              state={state}
              feature={feature}
              officialsData={officialsData}
            />
          )}
        </>
      )}

      {loading && <Spinner />}
    </div>
  );
}
