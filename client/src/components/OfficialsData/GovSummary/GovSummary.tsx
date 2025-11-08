import { useState } from "react";
import { Executive } from "./Executive";
import { Judicial } from "./Judicial";
import { Legislative } from "./Legislative";
import { GovSummaryProps } from "../../../models/OfficialProps";
import "./GovSummary.css";

interface GovSummaryDataProps {
    officialsData: GovSummaryProps | null;
    type: string;
    state?: string;
}

export default function GovSummary({officialsData, type, state}: GovSummaryDataProps) {
    const [activeBranch, setActiveBranch] = useState<"Legislative" | "Executive" | "Judicial">("Legislative");

    return (
        <div className="sidebar-body federal-summary">
            
            {!(type === 'cd' && state) && <div className="branch-tabs" role="tablist" aria-label="Branches of Government">
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
            </div>}

            <div className="branch-content">
                {(type === 'cd' || activeBranch === "Legislative") && <Legislative type={type} officialsData={officialsData?.legislative} state={state}/>}
                {(type !== 'cd' && activeBranch === "Executive") && <Executive officialsData={officialsData?.executive} state={state}/>}
                {(type !== 'cd' && activeBranch === "Judicial") && <Judicial officialsData={officialsData?.judicial} state={state}/>}
            </div>
        </div>
    );
}