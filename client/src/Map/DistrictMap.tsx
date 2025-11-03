import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DistrictMap = () => {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    // fetch("http://localhost:8000/districts") // your FastAPI route
    //   .then((res) => res.json())
    //   .then((data) => {
    //     const geojson = typeof data === "string" ? JSON.parse(data) : data;
    //     setGeoData(geojson);
    //   })
    //   .catch(console.error);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {/* <MapContainer
        center={[37.5, -119.5]} // California center-ish
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {geoData && <GeoJSON data={geoData} />}
      </MapContainer> */}
    </div>
  );
};

export default DistrictMap;
