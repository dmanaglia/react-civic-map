import { useEffect, useState } from "react";
import type { District, State } from "../../../models/MapProps";
import type { Official } from "../../../models/OfficialProps";

export function useOfficialsData(
  district: District | null,
  state: State | null,
) {
  const [official, setOfficial] = useState<Official | null>(null);
  const [loadingOfficial, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Only used to get a single Official from a given district
    if (district && state) {
      setLoading(true);
      fetch(
        `http://localhost:8000/official/${district.TYPE}/${state.USPS}/${district.ID}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setOfficial(data);
          setLoading(false);
        });
    }
  }, [district, state]);

  return { official, loadingOfficial, setOfficial };
}
