import { useEffect, useState } from "react";
import MapHeader from "./MapHeader";
import UsMap from "./UsMap";

export default function MapContainer() {
    const [stateId, setStateId] = useState<string | null>(null);
    const [statesData, setStatesData] = useState<any>(null);
    const [districtsData, setDistrictsData] = useState<any>(null);
    const [selectedType, setSelectedType] = useState<string>("county");

    useEffect(() => {
        fetch("http://localhost:8000/geojson/states")
        .then((res) => res.json())
        .then(setStatesData);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`http://localhost:8000/geojson/${selectedType}/${stateId}`);
            const data = await res.json();
            setDistrictsData(data);
        }
        if(stateId) fetchData()
    }, [stateId, selectedType]);

    return (
        <div>
            <MapHeader selectedType={selectedType} setSelectedType={setSelectedType} />
            {statesData && (
                <UsMap
                    statesGeoJson={statesData}
                    districtsGeoJson={districtsData}
                    setStateId={setStateId}
                />
            )}
        </div>
    );
}
