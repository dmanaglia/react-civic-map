import io
import os
import tempfile
import zipfile

import geopandas
import httpx
from fastapi import HTTPException

from app.schemas.models import FeatureCollection


async def fetch_and_filter_geojson(
    zip_url: str, state_filter: str | None = None
) -> FeatureCollection:
    """Fetch a shapefile from the Census API, filter by state if
    requested, and returned a validated FeatureCollection."""

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.get(zip_url)
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail=f"Failed to download shapefile: {zip_url}")

    with tempfile.TemporaryDirectory() as tmpdir:
        with zipfile.ZipFile(io.BytesIO(response.content)) as zf:
            zf.extractall(tmpdir)

        shp_file = next(
            (os.path.join(tmpdir, f) for f in os.listdir(tmpdir) if f.endswith(".shp")),
            None,
        )

        if not shp_file:
            raise HTTPException(status_code=500, detail="No .shp file found in archive")

        gdf = geopandas.read_file(shp_file)

        # Optional filtering needed for congressional districts since census
        # only returns all national congressional districts at once
        if state_filter:
            if "STATEFP" not in gdf.columns:
                raise HTTPException(status_code=400, detail="Shapefile missing STATEFP column")
            gdf = gdf[gdf["STATEFP"] == state_filter]

        geojson_dict = gdf.__geo_interface__
        feature_collection = FeatureCollection(**geojson_dict)
        return feature_collection
