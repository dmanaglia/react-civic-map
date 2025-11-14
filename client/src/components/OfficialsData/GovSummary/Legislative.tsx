import { useMemo, useState } from "react";
import type { District, FederalSummary, MapType, State, StateSummary, Chamber } from "../../../models/MapProps";
import { Representative } from "../Representative";
import { ChamberSummary } from "./ChamberSummary";

interface LegislativeProps {
    summary: FederalSummary | StateSummary,
    type: MapType,
    state: State | null,
    district: District | null
}

export const Legislative = ({summary, type, state, district}: LegislativeProps) => {
    const [activeChamber, setActiveChamber] = useState<"House" | "Senate">("House");
    
    const fed_reps = useMemo(() => {
        if(state){
            const stateSummary = summary as StateSummary
            if (type === 'sldu'){
                setActiveChamber("Senate");
            } else if (type === 'sldl'){
                setActiveChamber("House");
            } else if (type === 'cd'){
                setActiveChamber("House")
            }
            return stateSummary.federal
        }
        return undefined
    }, [type, state, summary])

    const data = useMemo(() => {
        if (!summary) return null;
        return activeChamber === "House" ? summary.legislative.house as Chamber : summary.legislative.senate as Chamber;
    }, [summary, activeChamber]);
    
    if (!data) {
        return <div className="empty-state">No legislative data available.</div>;
    }
    return (
        <div className="legislative">
            <div className="subtabs">
                <button
                    className={`subtab ${activeChamber === "House" ? "active" : ""}`}
                    onClick={() => setActiveChamber("House")}
                    aria-pressed={activeChamber === "House"}
                >
                    House
                </button>
                <button
                    className={`subtab ${activeChamber === "Senate" ? "active" : ""}`}
                    onClick={() => setActiveChamber("Senate")}
                    aria-pressed={activeChamber === "Senate"}
                >
                    {(type === 'cd' && state) ? "Senators" : "Senate"}
                </button>
            </div>


            {type === 'cd' && fed_reps ?
                <>
                    {activeChamber === "House" ? 
                        <div className="leg-body">
                            <div className="leg-left">
                                <ChamberSummary chamber={fed_reps.house}/>
                            </div>
                        </div>
                    :
                        <>
                            {fed_reps.senators.map((official) => 
                                <Representative official={official} state={state} district={district}/> 
                            )}
                        </>
                    }
                </>
            :
                <div className="leg-body">
                    <div className="leg-left">
                        <ChamberSummary chamber={data}/>
                    </div>
                </div>
            }
        </div>
    );
};