import "./MapHeader.css";

const FEATURE_TYPES = [
    { id: "county", label: "Counties" },
    { id: "sldl", label: "State House" },
    { id: "sldu", label: "State Senate" },
    { id: "cd", label: "Congressional Districts" },
    { id: "place", label: "City Boundaries"},
    { id: "cousub", label: "County Subdivisions"}
];

interface MapHeaderProps {
    type: string;
    setType: (types: string) => void;
}

export default function MapHeader({ type, setType }: MapHeaderProps) {
    return (
        <div className="map-header">
            {FEATURE_TYPES.map((feature) => (
                <button
                    key={feature.id}
                    className={`map-header-pill ${type === feature.id ? "active" : ""}`}
                    onClick={() => setType(feature.id)}
                >
                    {feature.label}
                </button>
            ))}
        </div>
    );
}
