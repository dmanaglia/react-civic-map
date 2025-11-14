import { useMemo, useState } from "react";
import type { FederalSummary, StateSummary, State } from "../../../models/MapProps";

export function useGeoData(
  type: string,
  state: State | null
) {
  const [nationalMap, setNationalMap] = useState<any>(null);
  const [districtMap, setDistrictMap] = useState<any>(null);
  const [loadingMap, setLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<FederalSummary | StateSummary | null>(null);

  useMemo(() => {
    setLoading(true);
    fetch("http://localhost:8000/geojson/states")
      .then(res => res.json())
      .then(data => {
        setSummary(data.summary)
        setNationalMap(data.map);
        setLoading(false);
      });
  }, []);

  useMemo(() => {
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
