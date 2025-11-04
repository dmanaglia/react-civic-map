import "./OfficialSidebar.css";
import StateProps from "../../models/StateProps";
import FeatureProps from "../../models/FeatureProps";
import OfficialProps from "../../models/OfficialProps";

interface OfficialSidebarProps {
    loading: boolean;
    open: boolean;
    onToggle: () => void;
    onClose: () => void;
    state: StateProps | null;
    type: string;
    feature: FeatureProps | null;
    officialsData: OfficialProps | null;
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
                        <small>{feature ? "Representative details" : "Government Details"}</small>
                    </div>

                    <div className="sidebar-actions">
                        <button className="close-btn" onClick={onClose} aria-label="Close">
                            ✕
                        </button>
                    </div>
                </div>

                <div className="sidebar-body">
                {!officialsData && <p>Work in progress...</p>}
                {officialsData && (
                    <>
                        <div className="official-header">
                            <img src={officialsData.depiction.imageUrl} alt={officialsData.name}></img>
                            <h2>{officialsData.name}</h2>
                        </div>
                        {officialsData.partyName && <p>Party: {officialsData.partyName}</p>}
                        {officialsData.url && (
                            <div className="contact-block">
                            {officialsData.url && <p>URL: <a href={officialsData.url}>{officialsData.url}</a></p>}
                            </div>
                        )}
                    </>
                )}
                </div>
            </aside>
        </div>
  );
}
