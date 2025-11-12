import "./OfficialSidebar.css";
import StateProps from "../../models/StateProps";
import FeatureProps from "../../models/FeatureProps";
import CdOfficialData from "./CdOfficialData";
import StateLegislatorsData from "./StateLegislatorsData";
import GovSummary from "./GovSummary/GovSummary";

interface OfficialSidebarProps {
    loading: boolean;
    open: boolean;
    onToggle: () => void;
    onClose: () => void;
    state: StateProps | null;
    type: string;
    feature: FeatureProps | null;
    officialsData: any;
}

export default function OfficialSidebar({ loading, open, onToggle, onClose, state, type, feature, officialsData }: OfficialSidebarProps) {
  
    return (
        <div>
            <button
                className={`sidebar-handle ${open ? "handle-hidden" : "handle-visible"}`}
                onClick={onToggle}
                aria-label={open ? "Close sidebar" : "Open sidebar"}
            >
                ≡
            </button>
            <aside className={`official-sidebar ${open ? "open" : "closed"}`} aria-hidden={!open}>
                {loading && (
                    <div className="sidebar-spinner-overlay">
                        <div className="sidebar-spinner"></div>
                    </div>
                )}
                <div className="sidebar-header">
                    <div>
                        <h2>{state ? `${state.name} ` : "Federal"}</h2>
                        <h3>{feature ? feature.name : null}</h3>
                        <small>{feature ? "Representative details" : type === 'cd' ? "Federal Represenation" : "Government Details"}</small>
                    </div>

                    <div className="sidebar-actions">
                        <button className="close-btn" onClick={onClose} aria-label="Close">
                            ✕
                        </button>
                    </div>
                </div>
                {!feature ? 
                    <GovSummary officialsData={officialsData} type={type} state={state?.name}/> 
                : 
                    <>
                        {type === 'cd' && <CdOfficialData state={state} feature={feature} officialsData={officialsData}/>}
                        {(type === 'sldl' || type === 'sldu') && <StateLegislatorsData state={state} feature={feature} officialsData={officialsData}/>}
                    </>
                }
            </aside>
        </div>
  );
}
