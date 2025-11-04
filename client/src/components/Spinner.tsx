export default function Spinner() {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(97, 118, 202, 0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <h1>LOADING...</h1>
        </div>
    )
}