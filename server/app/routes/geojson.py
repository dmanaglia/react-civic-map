from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
import requests, zipfile, io, tempfile, os
import geopandas as gpd

BASE_URL = "https://www2.census.gov/geo/tiger/GENZ2024/shp/"

def fetch_and_filter_geojson(zip_url: str, state_filter: str | None = None) -> dict:
    r = requests.get(zip_url)
    if r.status_code != 200:
        raise HTTPException(status_code=404, detail=f"Failed to download shapefile: {zip_url}")

    with tempfile.TemporaryDirectory() as tmpdir:
        with zipfile.ZipFile(io.BytesIO(r.content)) as z:
            z.extractall(tmpdir)

        shp_file = next((os.path.join(tmpdir, f) for f in os.listdir(tmpdir) if f.endswith(".shp")), None)
        if not shp_file:
            raise HTTPException(status_code=500, detail="No .shp file found in archive")

        gdf = gpd.read_file(shp_file)

        # Filter by state if requested
        if state_filter:
            if "STATEFP" not in gdf.columns:
                raise HTTPException(status_code=400, detail="Shapefile does not contain STATEFP column")
            gdf = gdf[gdf["STATEFP"] == state_filter]

        return gdf.__geo_interface__

router = APIRouter()

# States
@router.get("/states")
async def get_states():
    url = f"{BASE_URL}cb_2024_us_state_500k.zip"
    geojson = fetch_and_filter_geojson(url)
    return JSONResponse(content=geojson)

# State Senate (sldu)
@router.get("/sldu/{state}")
async def get_sldu(state: str):
    url = f"{BASE_URL}cb_2024_{state}_sldu_500k.zip"
    geojson = fetch_and_filter_geojson(url)
    return JSONResponse(content=geojson)

# State House (sldl)
@router.get("/sldl/{state}")
async def get_sldl(state: str):
    url = f"{BASE_URL}cb_2024_{state}_sldl_500k.zip"
    geojson = fetch_and_filter_geojson(url)
    return JSONResponse(content=geojson)

# Congressional Districts (cd)
@router.get("/cd/{state}")
async def get_cd(state: str):
    url = f"{BASE_URL}cb_2024_us_cd119_500k.zip"  # Only national shapefile exists
    geojson = fetch_and_filter_geojson(url, state_filter=state)
    return JSONResponse(content=geojson)

# Counties (county)
@router.get("/county/{state}")
async def get_county(state: str):
    url = f"{BASE_URL}cb_2024_us_county_500k.zip"  # Only national shapefile exists
    geojson = fetch_and_filter_geojson(url, state_filter=state)
    return JSONResponse(content=geojson)

# City Boundaries (place)
@router.get("/place/{state}")
async def get_place(state: str):
    url = f"{BASE_URL}cb_2024_us_place_500k.zip"  # Only national shapefile exists
    geojson = fetch_and_filter_geojson(url, state_filter=state)
    return JSONResponse(content=geojson)

# County Subdivisions (cousub)
@router.get("/cousub/{state}")
async def get_cousub(state: str):
    url = f"{BASE_URL}cb_2024_us_cousub_500k.zip"  # Only national shapefile exists
    geojson = fetch_and_filter_geojson(url, state_filter=state)
    return JSONResponse(content=geojson)