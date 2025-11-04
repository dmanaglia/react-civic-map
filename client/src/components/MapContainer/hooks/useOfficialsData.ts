import { useEffect, useState } from "react";
import FeatureProps from "../../../models/FeatureProps";
import StateProps from "../../../models/StateProps";
import OfficialProps from "../../../models/OfficialProps";

export function useOfficialsData(
  feature: FeatureProps | null,
  state: StateProps | null
) {
  const [officialsData, setOfficialsData] = useState<OfficialProps>();

  useEffect(() => {
    if (!feature || !state) return;

    fetch(
      `http://localhost:8000/officials/${feature.type}/${state.code}/${feature.id}`
    )
      .then(res => res.json())
      .then(data => setOfficialsData(data[0]));
  }, [feature, state]);

  return officialsData;
}
