import { useEffect, useState } from "react";
import FeatureProps from "../../../models/FeatureProps";
import StateProps from "../../../models/StateProps";
import OfficialProps from "../../../models/OfficialProps";

export function useOfficialsData(
  feature: FeatureProps | null,
  state: StateProps | null
) {
  const [officialsData, setOfficialsData] = useState<OfficialProps | null>(null);
  const [loadingOfficial, setLoading] = useState<boolean>(false);

  useEffect(() => {
    //only congression district route is currently working...
    if (feature?.type !== 'cd' || !state) return;
    
    setLoading(true)
    fetch(
      `http://localhost:8000/officials/${feature.type}/${state.code}/${feature.id}`
    )
      .then(res => res.json())
      .then((data) => {
        setOfficialsData(data[0]);
        console.log(data);
        setLoading(false);
      });
  }, [feature, state]);

  return {officialsData, setOfficialsData, loadingOfficial};
}
