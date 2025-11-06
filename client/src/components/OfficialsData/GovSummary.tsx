import { useMemo, useState } from "react";
import { LegislativeSummaryProps } from "../../models/OfficialProps";
import "./FederalSummary.css";

interface GovSummaryDataProps {
    officialsData: LegislativeSummaryProps | null;
}

export default function GovSummary({officialsData}: GovSummaryDataProps) {
    const [activeBranch, setActiveBranch] = useState<"Legislative" | "Executive" | "Judicial">("Legislative");
    const [activeChamber, setActiveChamber] = useState<"House" | "Senate">("House");

    // Helper to compute dial percents (returns [demPercent, repPercent, indPercent])
    const computePercents = (dem: number, rep: number, ind: number, vac: number=0) => {
        const total = Math.max(1, dem + rep + ind + vac || 0); // avoid divide-by-zero
        const d = (dem / total) * 100;
        const r = (rep / total) * 100;
        const i = (ind / total) * 100;
        const v = (vac / total) * 100;
        return [d, r, i, v];
    };

    // Choose active chamber dataset
    const chamberData = useMemo(() => {
        if (!officialsData) return null;
        return activeChamber === "House" ? officialsData.house : officialsData.senate;
    }, [officialsData, activeChamber]);

    // Dial SVG parameters
    const Dial = ({ dem, rep, ind, vac=0 }: { dem: number; rep: number; ind: number, vac: number }) => {
        const [dPerc, rPerc, iPerc, iVac] = computePercents(dem, rep, ind, vac);
        // Convert percent-of-360 to stroke-dasharray values where circumference is 100
        // We'll draw arcs with strokeDasharray = "<portion> 100"
        // To stack arcs we use strokeDashoffset to shift start points.
        const offsetDem = 0;
        const offsetRep = dPerc;
        const offsetInd = dPerc + rPerc;
        const offsetiVac = dPerc + rPerc + iVac;

        return (
        <div className="dial-wrapper" aria-hidden>
            <svg viewBox="0 0 36 36" className="dial-svg" role="img" aria-label="Seat distribution dial">
            <circle className="dial-bg" cx="18" cy="18" r="15.9" strokeWidth="3" fill="none" />
            <circle
                className="dial-dem"
                cx="18"
                cy="18"
                r="15.9"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${dPerc} ${100 - dPerc}`}
                strokeDashoffset={100 - offsetDem}
                transform="rotate(-90 18 18)"
            />
            <circle
                className="dial-rep"
                cx="18"
                cy="18"
                r="15.9"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${rPerc} ${100 - rPerc}`}
                strokeDashoffset={100 - offsetRep}
                transform="rotate(-90 18 18)"
            />
            {iPerc &&
                <circle
                    className="dial-ind"
                    cx="18"
                    cy="18"
                    r="15.9"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${iPerc} ${100 - iPerc}`}
                    strokeDashoffset={100 - offsetInd}
                    transform="rotate(-90 18 18)"
                />
            }
            {iVac &&
                <circle
                    className="dial-vac"
                    cx="18"
                    cy="18"
                    r="15.9"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${iVac} ${100 - iVac}`}
                    strokeDashoffset={100 - offsetiVac}
                    transform="rotate(-90 18 18)"
                />
            }
            </svg>

            <div className="dial-center">
            <div className="dial-count">{dem + rep + ind + vac}</div>
            <div className="dial-label">Seats</div>
            </div>
        </div>
        );
    };

    const renderLegislative = () => {
        if (!officialsData || !chamberData) return <div className="empty-state">No legislative data available.</div>;

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
                    <Dial dem={chamberData.democrats} rep={chamberData.republicans} ind={chamberData.independents || 0} vac={chamberData?.vacancies || 0}/>
                    <div className="legend">
                        {chamberData.democrats > chamberData.republicans ? 
                            <>
                                <div className="legend-row">
                                    <span className="legend-swatch dem" /> <span className="legend-label">Democrats</span>
                                    <strong className="legend-value">{chamberData.democrats}</strong>
                                </div>
                                <div className="legend-row">
                                    <span className="legend-swatch rep" /> <span className="legend-label">Republicans</span>
                                    <strong className="legend-value">{chamberData.republicans}</strong>
                                </div>
                            </>
                        :
                            <>
                                <div className="legend-row">
                                    <span className="legend-swatch rep" /> <span className="legend-label">Republicans</span>
                                    <strong className="legend-value">{chamberData.republicans}</strong>
                                </div>
                                <div className="legend-row">
                                    <span className="legend-swatch dem" /> <span className="legend-label">Democrats</span>
                                    <strong className="legend-value">{chamberData.democrats}</strong>
                                </div>
                            </>
                        }
                        <div className="legend-row">
                            <span className="legend-swatch ind" /> <span className="legend-label">Independents</span>
                            <strong className="legend-value">{chamberData.independents ?? 0}</strong>
                        </div>
                        {activeChamber === "House" && chamberData?.vacancies && chamberData?.non_voting && (
                            <>
                            <div className="legend-row">
                                <span className="legend-swatch vac" /> <span className="legend-label">Vacancies</span>
                                <strong className="legend-value">{chamberData?.vacancies ?? 0}</strong>
                            </div>
                            <div className="legend-row">
                                <span className="legend-swatch nonv" /> <span className="legend-label">Non voting members</span>
                                <strong className="legend-value">{chamberData?.non_voting?.length ?? 0}</strong>
                            </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
        );
    };

    const renderExecutive = () => {
        return (
        <div className="branch-placeholder">
            <h4>Executive Branch</h4>
            <p className="muted">Executive branch details (President, Vice President, major cabinet positions) will show here.</p>
        </div>
        );
    };

    const renderJudicial = () => {
        return (
        <div className="branch-placeholder">
            <h4>Judicial Branch</h4>
            <p className="muted">High-level judicial info (e.g., Supreme Court composition) will show here.</p>
        </div>
        );
    };

    return (
        <div className="sidebar-body federal-summary">
            <div className="branch-tabs" role="tablist" aria-label="Branches of Government">
                {(["Executive", "Legislative", "Judicial"] as const).map((b) => (
                <button
                    key={b}
                    className={`branch-tab ${activeBranch === b ? "active" : ""}`}
                    onClick={() => setActiveBranch(b)}
                    role="tab"
                    aria-selected={activeBranch === b}
                >
                    {b}
                </button>
                ))}
            </div>

            <div className="branch-content">
                {activeBranch === "Legislative" && renderLegislative()}
                {activeBranch === "Executive" && renderExecutive()}
                {activeBranch === "Judicial" && renderJudicial()}
            </div>
        </div>
    );
}