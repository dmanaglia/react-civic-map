import "./Spinner.css";

export default function Spinner() {
  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        <div className="spinner"></div>
        <span>Loading...</span>
      </div>
    </div>
  );
}
