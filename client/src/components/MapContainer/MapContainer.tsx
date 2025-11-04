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
  const [stateId, setStateId] = useState<StateProps | null>(null);
  const [selectedType, setSelectedType] = useState<string>("cd");
  const [selectedFeature, setSelectedFeature] = useState<FeatureProps | null>(null);

  const { statesData, districtsData, loading } = useGeoData(selectedType, stateId);
  const officialsData = useOfficialsData(selectedFeature, stateId);

  return (
    <div>
      <MapHeader selectedType={selectedType} setSelectedType={setSelectedType} />

      {statesData && (
        <>
          <UsMap
            statesGeoJson={statesData}
            districtsGeoJson={districtsData}
            selectedType={selectedType}
            setStateId={setStateId}
            setSelectedFeature={setSelectedFeature}
          />
          {officialsData && stateId && selectedFeature && (
            <OfficialData
              stateId={stateId}
              selectedFeature={selectedFeature}
              officialsData={officialsData}
            />
          )}
        </>
      )}

      {loading && <Spinner />}
    </div>
  );
}
