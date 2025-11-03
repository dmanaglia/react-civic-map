import { useEffect, useState } from "react";
import MapHeader from "./MapHeader";
import UsMap from "./UsMap";

export default function MapContainer() {
  const [statesData, setStatesData] = useState<any>(null);
  const [districtsData, setDistrictsData] = useState<any>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["county"]);

  useEffect(() => {
    fetch("http://localhost:8000/geojson/states")
      .then((res) => res.json())
      .then(setStatesData);
  }, []);

  const handleStateClick = async (stateId: string) => {
    const res = await fetch(`http://localhost:8000/geojson/districts/${stateId}`);
    const data = await res.json();
    console.log(data);
    setDistrictsData(data);
  };

  return (
    <div>
        <MapHeader selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} />
        {statesData && (
            <UsMap
                statesGeoJson={statesData}
                districtsGeoJson={districtsData}
                onStateClick={handleStateClick}
            />
        )}
    </div>
  );
}
