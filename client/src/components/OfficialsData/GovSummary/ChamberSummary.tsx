import type { Chamber } from "../../../models/MapProps"
import { Dial } from "./Dial"

interface ChamberSummaryProps {
    chamber: Chamber,
}

const SORT_KEYS = [
    "democrat",
    "republican",
    "independent",
    "other",
    "vacant",
] as const;

export const ChamberSummary = ({chamber}: ChamberSummaryProps) => {
    console.log({chamber});

    function chamberToSortedArray(chamber: Chamber) {
        return SORT_KEYS
            .map((key) => ({
                key,
                value: chamber[key],
            }))
            .sort((a, b) => b.value - a.value)
            .filter(({ value }) => value > 0);
    }

    return (
        <>
            <Dial dem={chamber.democrat} rep={chamber.republican} ind={chamber.independent} vac={chamber.vacant}/>
            <div className="legend">
                {chamberToSortedArray(chamber).map(({ key, value }) => (
                    <div className="legend-row" key={key}>
                        <span className={`legend-swatch ${key}`} />
                        {/* Capitalize the first letter for UI */}
                        <span className="legend-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        <strong className="legend-value">{value}</strong>
                    </div>
                ))}
                {/* {chamber?.non_voting && 
                    <div className="legend-row">
                        <span className="legend-swatch non_voting" /> <span className="legend-label">Non Voting Members</span>
                        <strong className="legend-value">{chamber.non_voting}</strong>
                    </div>
                } */}
            </div>
        </>
    )
}