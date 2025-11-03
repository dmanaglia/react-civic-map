import { useState } from "react";

const DISTRICT_TYPES = [
    { id: "county", label: "Counties" },
    { id: "sldl", label: "State House (SLDL)" },
    { id: "sldu", label: "State Senate (SLDU)" },
    { id: "cd", label: "Congressional Districts (CD)" },
];

export default function MapHeader({ selectedTypes, setSelectedTypes }: { selectedTypes: string[], setSelectedTypes: (types: string[]) => void }) {
  const toggleType = (typeId: string) => {
    //@ts-ignore
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t : string) => t !== typeId) : [...prev, typeId]
    );
  };

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      background: "rgba(255,255,255,0.9)",
      padding: "8px 16px",
      zIndex: 10,
      display: "flex",
      gap: "16px",
      flexWrap: "wrap"
    }}>
      {DISTRICT_TYPES.map((d) => (
        <label key={d.id} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <input
            type="checkbox"
            checked={selectedTypes.includes(d.id)}
            onChange={() => toggleType(d.id)}
          />
          {d.label}
        </label>
      ))}
    </div>
  );
}
