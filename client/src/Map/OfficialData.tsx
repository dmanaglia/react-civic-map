import FeatureProps from "../models/FeatureProps";
import OfficialProps from "../models/OfficialProps";
import StateProps from "../models/StateProps";

interface OfficialDataProps {
    selectedFeature: FeatureProps;
    stateId: StateProps;
    officialsData: OfficialProps;
}

export default function OfficialData({selectedFeature, stateId, officialsData}: OfficialDataProps) {
    return (
        <div style={{marginTop: 80}}>
            <h1>{stateId.name} {selectedFeature.name} Representative</h1>
            <h2>{officialsData.name}</h2>
        </div>
    )
}