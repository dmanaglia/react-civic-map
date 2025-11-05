import { useEffect, useState } from "react";
import FeatureProps from "../../../models/FeatureProps";
import StateProps from "../../../models/StateProps";

export function useOfficialsData(
  feature: FeatureProps | null,
  state: StateProps | null
) {
  const [officialsData, setOfficialsData] = useState<any | null>(null);
  const [loadingOfficial, setLoading] = useState<boolean>(false);

  useEffect(() => {
    //only congression district route is currently working...
    if (!feature || !state) return;
    
    setLoading(true)
    fetch(
        `http://localhost:8000/officials/${feature.type}/${state.code}/${feature.id}`
      )
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        setOfficialsData(data[0]);
        setLoading(false);
      });
  }, [feature, state]);

  return {officialsData, setOfficialsData, loadingOfficial};
}
