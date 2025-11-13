import { District, MapType, State } from "../../../models/MapProps";
import { Official } from "../../../models/OfficialProps";
import { Representative } from "../Representative";

interface ExecutiveProps {
    officials: Official[],
    type: MapType,
    state: State | null
    district: District | null
}

export const Executive = ({officials, type, state, district}: ExecutiveProps) => {
    return (
        !officials.length ? 
            <>
                <h4>Executive Branch</h4>
                <p className="muted">Work in progress...</p>
            </>
        :
            <>
                {officials.map((official, index) => (
                    <Representative 
                        key={index} 
                        official={official} 
                        state={state} 
                        district={district} />
                ))}
            </>
    );
};