import io
import zipfile
from unittest.mock import AsyncMock, MagicMock, patch

import geopandas as gpd
import pytest
from fastapi import HTTPException
from shapely import Point

from app.fetch.census import fetch_and_filter_geojson
from app.schemas.models import FeatureCollection


@pytest.mark.asyncio
@patch("app.fetch.census.httpx.AsyncClient")
@patch("app.fetch.census.geopandas.read_file")
async def test_fetch_and_filter_geojson_success(mock_read_file, mock_httpx):
    # Prepare a minimal GeoDataFrame
    df = gpd.GeoDataFrame(
        {
            "STATEFP": ["12", "34", "12"],
            "name": ["District 1", "District 2", "District 34"],
        },
        geometry=[Point(1, 2), Point(3, 4), Point(5, 6)],
    )
    mock_read_file.return_value = df

    # Prepare a fake ZIP with a .shp file
    fake_shp_content = b"fake shapefile content"
    fake_zip = io.BytesIO()
    with zipfile.ZipFile(fake_zip, mode="w") as zf:
        zf.writestr("fake.shp", fake_shp_content)
    fake_zip_bytes = fake_zip.getvalue()

    # Mock httpx response
    mock_client_instance = AsyncMock()
    mock_client_instance.get.return_value.status_code = 200
    mock_client_instance.get.return_value.content = fake_zip_bytes
    mock_httpx.return_value.__aenter__.return_value = mock_client_instance

    # Call the function
    result = await fetch_and_filter_geojson("http://example.com/fake.zip", state_filter="12")

    # Assertions
    assert isinstance(result, FeatureCollection)
    assert len(result.features) == 2  # Filtered GeoDataFrame should have 2 rows
    mock_client_instance.get.assert_awaited_once_with("http://example.com/fake.zip")
    mock_read_file.assert_called_once()


@pytest.mark.asyncio
@patch("app.fetch.census.httpx.AsyncClient")
async def test_fetch_and_filter_geojson_404(mock_httpx):
    mock_client_instance = AsyncMock()
    mock_client_instance.get.return_value.status_code = 404
    mock_httpx.return_value.__aenter__.return_value = mock_client_instance

    with pytest.raises(HTTPException) as exc:
        await fetch_and_filter_geojson("http://example.com/fake.zip")
    assert exc.value.status_code == 404


@pytest.mark.asyncio
@patch("app.fetch.census.httpx.AsyncClient")
@patch("app.fetch.census.zipfile.ZipFile")
async def test_fetch_and_filter_geojson_missing_shp(mock_zipfile, mock_httpx):
    # Mock ZIP extraction returns no .shp
    mock_zip_instance = MagicMock()
    mock_zip_instance.__enter__.return_value.namelist.return_value = ["file.txt"]
    mock_zipfile.return_value = mock_zip_instance

    mock_client_instance = AsyncMock()
    mock_client_instance.get.return_value.status_code = 200
    mock_client_instance.get.return_value.content = b"fake zip content"
    mock_httpx.return_value.__aenter__.return_value = mock_client_instance

    with pytest.raises(HTTPException) as exc:
        await fetch_and_filter_geojson("http://example.com/fake.zip")
    assert exc.value.status_code == 500


@pytest.mark.asyncio
@patch("app.fetch.census.httpx.AsyncClient")
@patch("app.fetch.census.geopandas.read_file")
async def test_fetch_and_filter_geojson_missing_STATEFP(mock_read_file, mock_httpx):
    # Prepare a minimal GeoDataFrame
    df = gpd.GeoDataFrame(
        {
            "name": ["District 1", "District 2", "District 34"],
        },
        geometry=[Point(1, 2), Point(3, 4), Point(5, 6)],
    )
    mock_read_file.return_value = df

    # Prepare a fake ZIP with a .shp file
    fake_shp_content = b"fake shapefile content"
    fake_zip = io.BytesIO()
    with zipfile.ZipFile(fake_zip, mode="w") as zf:
        zf.writestr("fake.shp", fake_shp_content)
    fake_zip_bytes = fake_zip.getvalue()

    # Mock httpx response
    mock_client_instance = AsyncMock()
    mock_client_instance.get.return_value.status_code = 200
    mock_client_instance.get.return_value.content = fake_zip_bytes
    mock_httpx.return_value.__aenter__.return_value = mock_client_instance

    # Call function
    with pytest.raises(HTTPException) as exc_info:
        await fetch_and_filter_geojson("http://fake.zip", state_filter="12")

    # Assert exception
    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "Shapefile missing STATEFP column"
