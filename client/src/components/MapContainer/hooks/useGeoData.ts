import { useEffect, useState } from "react";
import StateProps from "../../../models/StateProps";

export function useGeoData(selectedType: string, stateId: StateProps | null) {
  const [statesData, setStatesData] = useState<any>(null);
  const [districtsData, setDistrictsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/geojson/states")
      .then(res => res.json())
      .then(data => {
        setStatesData(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!stateId || !selectedType) return;
    setLoading(true);
    fetch(`http://localhost:8000/geojson/${selectedType}/${stateId.id}`)
      .then(res => res.json())
      .then(data => {
        setDistrictsData(data);
        setLoading(false);
      });
  }, [stateId, selectedType]);

  return { statesData, districtsData, loading };
}
