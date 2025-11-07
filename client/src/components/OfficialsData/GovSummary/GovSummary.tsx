import { useState } from "react";
import { Executive } from "./Executive";
import { Judicial } from "./Judicial";
import { Legislative } from "./Legislative";
import { GovSummaryProps } from "../../../models/OfficialProps";
import "./GovSummary.css";

interface GovSummaryDataProps {
    officialsData: GovSummaryProps | null;
    state?: string;
}

export default function GovSummary({officialsData, state}: GovSummaryDataProps) {
    const [activeBranch, setActiveBranch] = useState<"Legislative" | "Executive" | "Judicial">("Executive");

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
                {activeBranch === "Legislative" && <Legislative officialsData={officialsData?.legislative} state={state}/>}
                {activeBranch === "Executive" && <Executive officialsData={officialsData?.executive} state={state}/>}
                {activeBranch === "Judicial" && <Judicial officialsData={officialsData?.judicial} state={state}/>}
            </div>
        </div>
    );
}