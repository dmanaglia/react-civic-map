interface JudicialProps {
    officialsData?: any[],
    state?: string
}

export const Judicial = ({officialsData, state}: JudicialProps) => {
    return (
        <div className="branch-placeholder">
            <h4>Judicial Branch</h4>
            <p className="muted">Work in progress...</p>
        </div>
    );
};