import { useEffect, useState } from "react";
import MapHeader from "./MapHeader";
import UsMap from "./UsMap";
import Spinner from "./Spinner";

export default function MapContainer() {
    const [stateId, setStateId] = useState<string | null>(null);
    const [statesData, setStatesData] = useState<any>(null);
    const [districtsData, setDistrictsData] = useState<any>(null);
    const [selectedType, setSelectedType] = useState<string>("county");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:8000/geojson/states")
        .then((res) => res.json())
        .then((data) => {
            setStatesData(data);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`http://localhost:8000/geojson/${selectedType}/${stateId}`);
            const data = await res.json();
            setDistrictsData(data);
            setLoading(false);
        }
        if(stateId) {
            setLoading(true);
            fetchData()
        }
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
            {loading && <Spinner/>}
        </div>
    );
}
