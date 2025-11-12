import FeatureProps from "../../models/FeatureProps";
import { CdOfficialProps } from "../../models/OfficialProps";
import StateProps from "../../models/StateProps";

interface OfficialDataProps {
    state: StateProps | null;
    feature: FeatureProps | null;
    officialsData: CdOfficialProps | null;
}

export default function CdOfficialData({state, feature, officialsData}: OfficialDataProps) {
    console.log(officialsData)
    // TODO: fix state misalignent bug for cd official data
    // @ts-ignore
    if(officialsData?.legislative) return <></>
    
    return (
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
    );
}