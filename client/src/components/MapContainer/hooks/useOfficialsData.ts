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
    if (!feature && !state) {
      setLoading(true)
      fetch(
          `http://localhost:8000/summary/legislative`
        )
        .then(res => res.json())
        .then((data) => {
          console.log(data);
          setOfficialsData(data);
          setLoading(false);
        });
    } else if (!feature){
      setLoading(true)
      fetch(
          `http://localhost:8000/summary/${state?.code}`
        )
        .then(res => res.json())
        .then((data) => {
          console.log(data);
          setOfficialsData(data[0]);
          setLoading(false);
        });
    } else if (feature && state){
      setLoading(true)
      fetch(
          `http://localhost:8000/official/${feature.type}/${state.code}/${feature.id}`
        )
        .then(res => res.json())
        .then((data) => {
          console.log(data);
          setOfficialsData(data[0]);
          setLoading(false);
        });
    }
  }, [feature, state]);

  return {officialsData, setOfficialsData, loadingOfficial};
}
