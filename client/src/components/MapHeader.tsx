const DISTRICT_TYPES = [
    { id: "county", label: "Counties (county)" },
    { id: "sldl", label: "State House (sldl)" },
    { id: "sldu", label: "State Senate (sldu)" },
    { id: "cd", label: "Congressional Districts (cd)" },
    { id: "place", label: "City Boundaries (place)"},
    { id: "cousub", label: "County Subdivisions (cousub)"}
];

export default function MapHeader({ selectedType, setSelectedType }: { selectedType: string, setSelectedType: (types: string) => void }) {

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      background: "rgba(255,255,255,0.9)",
      padding: "8px 16px",
      display: "flex",
      gap: "16px",
      flexWrap: "wrap"
    }}>
      {DISTRICT_TYPES.map((d) => (
        <label key={d.id} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <input
            type="radio"
            checked={selectedType === d.id}
            onChange={() => setSelectedType(d.id)}
          />
          {d.label}
        </label>
      ))}
    </div>
  );
}
