import { useEffect, useState } from "react";
import { FederalSummary, StateSummary, State } from "../../../models/MapProps";

export function useGeoData(
  type: string,
  state: State | null
) {
  const [nationalMap, setNationalMap] = useState<any>(null);
  const [districtMap, setDistrictMap] = useState<any>(null);
  const [loadingMap, setLoading] = useState(false);
  const [summary, setSummary] = useState<FederalSummary | StateSummary | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/geojson/states")
      .then(res => res.json())
      .then(data => {
        setSummary(data.summary)
        setNationalMap(data.map);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!state || !type) return;
    setLoading(true);
    fetch(`http://localhost:8000/geojson/${type}/${state.STATEFP}?stateUSPS=${state.USPS}`)
      .then(res => res.json())
      .then(data => {
        setSummary(data.summary)
        setDistrictMap(data.map);
        setLoading(false);
      });
  }, [state, type]);

  return { nationalMap, districtMap, summary, loadingMap };
}
