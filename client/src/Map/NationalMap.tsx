import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const NationalMap: React.FC = () => {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    const fetchMap = async () => {
        const url = "http://127.0.0.1:8000/api/districts";
    
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }
    
          const result = await response.json();
          const districts = result.features
          console.log(result, districts);
          setGeoData(result);
        } catch (error: any) {
          console.error(error.message);
        }
    }
    fetchMap();
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[39.8283, -98.5795]} // Rough geographic center of the U.S.
        zoom={4}
        style={{ height: "100%", width: "100%" }}
      >
        {/* OpenStreetMap base tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        //   attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {/* Draw the national shapefile */}
        {geoData && <GeoJSON data={geoData} />}
      </MapContainer>
    </div>
  );
};

export default NationalMap;
