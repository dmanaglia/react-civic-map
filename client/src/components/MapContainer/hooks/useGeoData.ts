import { useEffect, useState } from "react";
import StateProps from "../../../models/StateProps";

export function useGeoData(
  type: string,
  state: StateProps | null
) {
  const [statesData, setStatesData] = useState<any>(null);
  const [featureData, setFeatureData] = useState<any>(null);
  const [loadingMap, setLoading] = useState(false);

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
    if (!state || !type) return;
    setLoading(true);
    fetch(`http://localhost:8000/geojson/${type}/${state.id}?state_code=${state.code}&state_name=${state.name}`)
      .then(res => res.json())
      .then(data => {
        setFeatureData(data);
        setLoading(false);
      });
  }, [state, type]);

  return { statesData, featureData, loadingMap };
}
