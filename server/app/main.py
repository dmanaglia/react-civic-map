from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import geopandas as gpd
import requests, zipfile, io, tempfile, os

app = FastAPI(title="My FastAPI Backend")

# CORS for your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/geojson/districts/{state}")
async def get_districts(state: str):
    """
    Download a shapefile from the US Census TIGER/Line site,
    extract it, convert to GeoJSON, and return to frontend.
    """

    url = f"https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_{state:02}_sldl_500k.zip"

    # Download the ZIP file
    r = requests.get(url)
    if r.status_code != 200:
        raise HTTPException(status_code=404, detail=f"Failed to download shapefile for state={state}")

    # Work inside a temporary directory
    with tempfile.TemporaryDirectory() as tmpdir:
        with zipfile.ZipFile(io.BytesIO(r.content)) as z:
            z.extractall(tmpdir)

        # Find the shapefile (.shp)
        shp_file = next((os.path.join(tmpdir, f) for f in os.listdir(tmpdir) if f.endswith(".shp")), None)
        if not shp_file:
            raise HTTPException(status_code=500, detail="No .shp file found in archive")

        # Read with GeoPandas
        gdf = gpd.read_file(shp_file)

        # Convert to GeoJSON
        geojson = gdf.__geo_interface__

    # Return as JSON response
    return JSONResponse(content=geojson)


@app.get("/geojson/states")
async def get_states():
    """
    Download the 2024 U.S. state and territory shapefile,
    convert to GeoJSON, and return.
    """
    url = "https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_state_500k.zip"

    r = requests.get(url)
    if r.status_code != 200:
        raise HTTPException(status_code=404, detail="Failed to download state shapefile")

    with tempfile.TemporaryDirectory() as tmpdir:
        with zipfile.ZipFile(io.BytesIO(r.content)) as z:
            z.extractall(tmpdir)

        shp_file = next((os.path.join(tmpdir, f) for f in os.listdir(tmpdir) if f.endswith(".shp")), None)
        if not shp_file:
            raise HTTPException(status_code=500, detail="No shapefile found")

        gdf = gpd.read_file(shp_file)
        geojson = gdf.__geo_interface__

    return JSONResponse(content=geojson)



@app.get("/api/health")
def health_check():
    return {"status": "ok"}