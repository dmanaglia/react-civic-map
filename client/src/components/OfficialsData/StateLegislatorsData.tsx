import FeatureProps from "../../models/FeatureProps";
import { StateLegislatorsProps } from "../../models/OfficialProps";
import StateProps from "../../models/StateProps";

interface StateLegislatorsDataProps {
    state: StateProps | null;
    feature: FeatureProps | null;
    officialsData: StateLegislatorsProps | null;
}

export default function StateLegislatorsDataData({state, feature, officialsData}: StateLegislatorsDataProps) {
    return (
        <div className="sidebar-body">
            {!officialsData && <p>Work in progress...</p>}
            {officialsData && (
                <>
                    <div className="official-header">
                        <img src={officialsData.image} alt={officialsData.name}></img>
                        <h2>{officialsData.name}</h2>
                    </div>
                    {officialsData.party && <p>Party: {officialsData.party}</p>}
                    {officialsData.openstates_url && (
                        <div className="contact-block">
                        {officialsData.openstates_url && <p>URL: <a href={officialsData.openstates_url}>{officialsData.openstates_url}</a></p>}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}