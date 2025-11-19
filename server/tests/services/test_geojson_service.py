from unittest.mock import AsyncMock, create_autospec, patch

import pytest

from app.schemas.models import (
    Feature,
    FeatureCollection,
    FederalCache,
    FederalResponse,
    FederalSummary,
    Geometry,
    SenatorMap,
)
from app.services.geojson_service import get_states_service


@pytest.mark.asyncio
@patch("app.services.geojson_service.Get_Federal_Cache", new_callable=AsyncMock)
async def test_get_states_service_cached(mock_get_cache):
    """Return immediately if map is already a FeatureCollection."""
    # Arrange
    fake_map = create_autospec(FeatureCollection, instance=True)
    fake_summary = create_autospec(FederalSummary, instance=True)
    cached_data = FederalCache(summary=fake_summary, map=fake_map, lastUpdated="")
    mock_get_cache.return_value = cached_data

    # Act
    result = await get_states_service()

    # Assert
    mock_get_cache.assert_awaited_once()
    assert isinstance(result, FederalResponse)
    assert result.map == fake_map
    assert result.summary == fake_summary


@pytest.mark.asyncio
@patch("app.services.geojson_service.write_federal_cache")
@patch("app.services.geojson_service.fetch_and_filter_geojson", new_callable=AsyncMock)
@patch("app.services.geojson_service.Get_Federal_Cache", new_callable=AsyncMock)
async def test_get_states_service_fetch_and_enrich(mock_get_cache, mock_fetch, mock_write_cache):
    """
    Fetch GeoJSON if cached map is not a FeatureCollection, enrich with senators, write to cache.
    """
    # Arrange
    fake_summary = create_autospec(FederalSummary, instance=True)
    mock_map = SenatorMap(
        root={"California": ["Democrat", "Democrat"], "Texas": ["Republican", "Republican"]}
    )
    # Cached map is not a FeatureCollection → triggers fetch
    cached_data = FederalCache(summary=fake_summary, map=mock_map, lastUpdated="")
    mock_get_cache.return_value = cached_data

    # Fake GeoJSON features
    features = [
        Feature(
            type="Feature",
            geometry=Geometry(type="", coordinates=[]),
            properties={"NAME": "California"},
        ),
        Feature(
            type="Feature", geometry=Geometry(type="", coordinates=[]), properties={"NAME": "Texas"}
        ),
    ]
    fake_geojson = FeatureCollection(type="FeatureCollection", features=features)
    mock_fetch.return_value = fake_geojson

    # Act
    result = await get_states_service()

    # Assert
    mock_get_cache.assert_awaited_once()
    mock_fetch.assert_awaited_once()
    mock_write_cache.assert_called_once()

    # Check senators enrichment
    assert result.map.features[0].properties["senators"] == ["Democrat", "Democrat"]
    assert result.map.features[1].properties["senators"] == ["Republican", "Republican"]
    assert isinstance(result, FederalResponse)
    assert result.summary == fake_summary
