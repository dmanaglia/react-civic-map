import "./OfficialSidebar.css";
import type {
  District,
  FederalSummary,
  MapType,
  StateSummary,
  State,
} from "../../models/MapProps";
import type { Official } from "../../models/OfficialProps";
import GovSummary from "./GovSummary/GovSummary";
import { Representative } from "./Representative";

interface OfficialSidebarProps {
  district: District | null;
  loading: boolean;
  official: Official | null;
  onToggle: () => void;
  onClose: () => void;
  open: boolean;
  state: State | null;
  summary: FederalSummary | StateSummary | null;
  type: MapType;
}

export default function OfficialSidebar({
  loading,
  open,
  onToggle,
  onClose,
  state,
  type,
  district,
  official,
  summary,
}: OfficialSidebarProps) {
  return (
    <div>
      <button
        className={`sidebar-handle ${open ? "handle-hidden" : "handle-visible"}`}
        onClick={onToggle}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
      >
        ≡
      </button>
      <aside
        className={`official-sidebar ${open ? "open" : "closed"}`}
        aria-hidden={!open}
      >
        {loading && (
          <div className="sidebar-spinner-overlay">
            <div className="sidebar-spinner"></div>
          </div>
        )}
        <div className="sidebar-header">
          <div>
            <h2>{state ? `${state.NAME} ` : "Federal"}</h2>
            <h3>{district ? district.NAME : null}</h3>
            <small>
              {district
                ? "Representative details"
                : type === "cd"
                  ? "Federal Represenation"
                  : "Government Details"}
            </small>
          </div>

          <div className="sidebar-actions">
            <button className="close-btn" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </div>
        {official ? (
          <Representative
            state={state}
            district={district}
            official={official}
          />
        ) : (
          summary && (
            <GovSummary
              summary={summary}
              type={type}
              state={state}
              district={district}
            />
          )
        )}
      </aside>
    </div>
  );
}
