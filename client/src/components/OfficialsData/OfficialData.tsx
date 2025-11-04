import FeatureProps from "../../models/FeatureProps";
import OfficialProps from "../../models/OfficialProps";
import StateProps from "../../models/StateProps";

interface OfficialDataProps {
    state: StateProps;
    feature: FeatureProps;
    officialsData: OfficialProps;
}

export default function OfficialData({state, feature, officialsData}: OfficialDataProps) {
    return (
        <div style={{marginTop: 80}}>
            <h1>{state.name} {feature.name} Representative</h1>
            <h2>{officialsData.name}</h2>
        </div>
    )
}