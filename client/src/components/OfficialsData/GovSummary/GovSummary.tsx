import { useState } from "react";
import { Executive } from "./Executive";
import { Judicial } from "./Judicial";
import { Legislative } from "./Legislative";
import { District, FederalSummary, MapType, StateSummary, State } from "../../../models/MapProps";
import "./GovSummary.css";

interface GovSummaryDataProps {
    summary: FederalSummary | StateSummary,
    type: MapType,
    state: State | null,
    district: District | null
}

export default function GovSummary({summary, type, state, district}: GovSummaryDataProps) {
    const [activeBranch, setActiveBranch] = useState<"Legislative" | "Executive" | "Judicial">("Legislative");

    return (
        <div className="sidebar-body federal-summary">
            
            {!(type === 'cd' && state) && <div className="branch-tabs" role="tablist" aria-label="Branches of Government">
                {(["Executive", "Legislative", "Judicial"] as const).map((branch) => (
                <button
                    key={branch}
                    className={`branch-tab ${activeBranch === branch ? "active" : ""}`}
                    onClick={() => setActiveBranch(branch)}
                    role="tab"
                    aria-selected={activeBranch === branch}
                >
                    {branch}
                </button>
                ))}
            </div>}

            <div className="branch-content">
                {activeBranch === "Legislative" && <Legislative type={type} summary={summary} state={state} district={district}/>}
                {activeBranch === "Executive" && <Executive officials={summary.executive} type={type} state={state} district={district}/>}
                {activeBranch === "Judicial" && <Judicial officials={summary.executive} type={type} state={state} district={district}/>}
            </div>
        </div>
    );
}