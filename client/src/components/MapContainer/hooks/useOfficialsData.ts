import { useEffect, useState } from "react";
import FeatureProps from "../../../models/FeatureProps";
import StateProps from "../../../models/StateProps";
import OfficialProps from "../../../models/OfficialProps";

export function useOfficialsData(
  selectedFeature: FeatureProps | null,
  stateId: StateProps | null
) {
  const [officialsData, setOfficialsData] = useState<OfficialProps>();

  useEffect(() => {
    if (!selectedFeature || !stateId) return;

    fetch(
      `http://localhost:8000/officials/${selectedFeature.type}/${stateId.code}/${selectedFeature.id}`
    )
      .then(res => res.json())
      .then(data => setOfficialsData(data[0]));
  }, [selectedFeature, stateId]);

  return officialsData;
}
