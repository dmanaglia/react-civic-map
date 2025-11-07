import { useMemo, useState } from "react";
import { Dial } from "./Dial";
import { ChamberProps } from "../../../models/OfficialProps";

interface LegislativeProps {
    officialsData?: { house: ChamberProps; senate: ChamberProps; },
    state?: string
}

export const Legislative = ({officialsData, state}: LegislativeProps) => {
    const [activeChamber, setActiveChamber] = useState<"House" | "Senate">("House");
    
    const data = useMemo(() => {
        if (!officialsData) return null;
            return activeChamber === "House" ? officialsData.house as ChamberProps : officialsData.senate as ChamberProps;
    }, [officialsData, activeChamber]);
    
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
            Senate
        </button>
        </div>

        <div className="leg-body">
            <div className="leg-left">
                <Dial dem={data.democrats} rep={data.republicans} ind={data.independents || 0} vac={data?.vacancies || 0}/>
                <div className="legend">
                    {data.democrats > data.republicans ? 
                        <>
                            <div className="legend-row">
                                <span className="legend-swatch dem" /> <span className="legend-label">Democrats</span>
                                <strong className="legend-value">{data.democrats}</strong>
                            </div>
                            <div className="legend-row">
                                <span className="legend-swatch rep" /> <span className="legend-label">Republicans</span>
                                <strong className="legend-value">{data.republicans}</strong>
                            </div>
                        </>
                    :
                        <>
                            <div className="legend-row">
                                <span className="legend-swatch rep" /> <span className="legend-label">Republicans</span>
                                <strong className="legend-value">{data.republicans}</strong>
                            </div>
                            <div className="legend-row">
                                <span className="legend-swatch dem" /> <span className="legend-label">Democrats</span>
                                <strong className="legend-value">{data.democrats}</strong>
                            </div>
                        </>
                    }
                    <div className="legend-row">
                        <span className="legend-swatch ind" /> <span className="legend-label">Independents</span>
                        <strong className="legend-value">{data.independents ?? 0}</strong>
                    </div>
                    {activeChamber === "House" && data?.vacancies && data?.non_voting && (
                        <>
                        <div className="legend-row">
                            <span className="legend-swatch vac" /> <span className="legend-label">Vacancies</span>
                            <strong className="legend-value">{data?.vacancies ?? 0}</strong>
                        </div>
                        <div className="legend-row">
                            <span className="legend-swatch nonv" /> <span className="legend-label">Non voting members</span>
                            <strong className="legend-value">{data?.non_voting?.length ?? 0}</strong>
                        </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
    );
};