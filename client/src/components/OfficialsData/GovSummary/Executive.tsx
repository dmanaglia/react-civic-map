import { StateLegislatorsProps } from "../../../models/OfficialProps";

interface LegislativeProps {
    officialsData?: StateLegislatorsProps[],
    state?: string
}

export const Executive = ({officialsData, state}: LegislativeProps) => {
    return (
        !officialsData || !officialsData.length ? 
            <>
                <h4>Executive Branch</h4>
                <p className="muted">Work in progress...</p>
            </>
        :
            <>
                {officialsData.map((official) => 
                    <div className="branch-placeholder">
                        {state ? <h4>{official.current_role.title}</h4> : <h4>Executive Branch</h4>}
                        <div className="sidebar-body">
                            {!official ? <p>Work in progress...</p>
                            :
                                <>
                                    <div className="official-header">
                                        <img src={official.image} alt={official.name}></img>
                                        <h2>{official.name}</h2>
                                    </div>
                                    {official.party && <p>Party: {official.party}</p>}
                                </>
                            }
                        </div>
                    </div>
                )}
            </>
    );
};