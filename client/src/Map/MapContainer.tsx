import { useEffect, useState } from "react";
import UsMap from "./UsMap";

export default function MapContainer() {
  const [statesData, setStatesData] = useState<any>(null);
  const [districtsData, setDistrictsData] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:8000/geojson/states") // from FastAPI
      .then((res) => res.json())
      .then(setStatesData);
  }, []);

  const handleStateClick = async (stateId: string) => {
    const res = await fetch(`http://localhost:8000/geojson/districts/${stateId}`);
    const data = await res.json();
    setDistrictsData(data);
  };

  return (
    <div>
      {statesData && <UsMap statesGeoJson={statesData} onStateClick={handleStateClick} />}
      {/* Later, overlay districts here */}
    </div>
  );
}
