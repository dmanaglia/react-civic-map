import { useEffect, useState } from "react";
import MapHeader from "./MapHeader";
import UsMap from "./UsMap";
import Spinner from "./Spinner";
import OfficialData from "./OfficialData";
import OfficialProps from "../models/OfficialProps";
import FeatureProps from "../models/FeatureProps";
import StateProps from "../models/StateProps";

export default function MapContainer() {
    const [stateId, setStateId] = useState<StateProps>();
    const [statesData, setStatesData] = useState<any>(null);
    const [districtsData, setDistrictsData] = useState<any>(null);
    const [selectedType, setSelectedType] = useState<string>("cd");
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedFeature, setSelectedFeature] = useState<FeatureProps | null>();
    const [officialsData, setOfficialsData] = useState<OfficialProps>();

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
            const res = await fetch(`http://localhost:8000/geojson/${selectedType}/${stateId?.id}`);
            const data = await res.json();
            setDistrictsData(data);
            setLoading(false);
        }
        if(stateId && selectedType) {
            setSelectedFeature(null);
            setLoading(true);
            fetchData()
        }
    }, [stateId, selectedType]);

    useEffect(() => {
        if(!selectedFeature || !stateId) return
        fetch(`http://localhost:8000/officials/${selectedFeature.type}/${stateId?.code}/${selectedFeature.id}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setOfficialsData(data[0]);
        });
    }, [selectedFeature, stateId, setOfficialsData]);

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
                    {officialsData && stateId && selectedFeature && <OfficialData stateId={stateId} selectedFeature={selectedFeature} officialsData={officialsData}/>}
                </>
            )}
            {loading && <Spinner/>}
        </div>
    );
}
