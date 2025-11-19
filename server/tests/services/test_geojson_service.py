from unittest.mock import AsyncMock, create_autospec, patch

import pytest

from app.schemas.models import (
    DistrictMap,
    Feature,
    FeatureCollection,
    FederalCache,
    FederalResponse,
    FederalSummary,
    Geometry,
    SenatorMap,
    StateCache,
    StateMapData,
    StateResponse,
    StateSummary,
)
from app.services.geojson_service import (
    get_cd_service,
    get_county_service,
    get_cousub_service,
    get_place_service,
    get_sldl_service,
    get_sldu_service,
    get_states_service,
)


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


@pytest.mark.asyncio
@patch("app.services.geojson_service.Get_State_Cache", new_callable=AsyncMock)
async def test_get_sldu_service_cached(mock_get_cache):
    """Return immediately if map is already a FeatureCollection."""
    # Arrange
    fake_map = create_autospec(FeatureCollection, instance=True)
    mock_state_maps = StateMapData(senate=fake_map, house=fake_map, congressional=fake_map)
    fake_summary = create_autospec(StateSummary, instance=True)
    cached_data = StateCache(summary=fake_summary, map=mock_state_maps, lastUpdated="")
    mock_get_cache.return_value = cached_data

    # Act
    result = await get_sldu_service("01", "AL")

    # Assert
    mock_get_cache.assert_awaited_once()
    assert isinstance(result, StateResponse)
    assert result.map == fake_map
    assert result.summary == fake_summary


@pytest.mark.asyncio
@patch("app.services.geojson_service.write_state_cache")
@patch("app.services.geojson_service.fetch_and_filter_geojson", new_callable=AsyncMock)
@patch("app.services.geojson_service.Get_State_Cache", new_callable=AsyncMock)
@patch("app.services.geojson_service.is_integer")
async def test_get_sldu_service_fetch_and_enrich(
    is_integer, mock_get_cache, mock_fetch, mock_write_cache
):
    """
    Fetch GeoJSON if cached map is not a FeatureCollection,
    enrich with state senators, write to cache.
    """
    # Arrange
    fake_summary = create_autospec(StateSummary, instance=True)
    fake_map = create_autospec(FeatureCollection, instance=True)
    mock_senate_map = DistrictMap(root={"1": "Democrat", "2": "Republican"})
    mock_state_maps = StateMapData(senate=mock_senate_map, house=fake_map, congressional=fake_map)

    # Cached map is not a FeatureCollection → triggers fetch
    cached_data = StateCache(summary=fake_summary, map=mock_state_maps, lastUpdated="")
    mock_get_cache.return_value = cached_data
    is_integer.return_value = True

    # Fake GeoJSON features
    features = [
        Feature(
            type="Feature",
            geometry=Geometry(type="", coordinates=[]),
            properties={"NAME": "01"},
        ),
        Feature(
            type="Feature", geometry=Geometry(type="", coordinates=[]), properties={"NAME": "02"}
        ),
    ]
    fake_geojson = FeatureCollection(type="FeatureCollection", features=features)
    mock_fetch.return_value = fake_geojson

    # Act
    result = await get_sldu_service("01", "AL")

    # Assert
    mock_get_cache.assert_awaited_once()
    mock_fetch.assert_awaited_once()
    mock_write_cache.assert_called_once()

    # Check state senate enrichment
    assert result.map.features[0].properties["party"] == "Democrat"
    assert result.map.features[1].properties["party"] == "Republican"
    assert isinstance(result, StateResponse)
    assert result.summary == fake_summary


@pytest.mark.asyncio
@patch("app.services.geojson_service.write_state_cache")
@patch("app.services.geojson_service.fetch_and_filter_geojson", new_callable=AsyncMock)
@patch("app.services.geojson_service.Get_State_Cache", new_callable=AsyncMock)
@patch("app.services.geojson_service.is_integer")
async def test_get_sldu_vermont_edge_case(is_integer, mock_get_cache, mock_fetch, mock_write_cache):
    """
    Fetch GeoJSON if cached map is not a FeatureCollection,
    enrich with state senators, write to cache.
    """
    # Arrange
    fake_summary = create_autospec(StateSummary, instance=True)
    fake_map = create_autospec(FeatureCollection, instance=True)
    mock_senate_map = DistrictMap(root={"Chittenden Southeast": "Democrat"})
    mock_state_maps = StateMapData(senate=mock_senate_map, house=fake_map, congressional=fake_map)

    # Cached map is not a FeatureCollection → triggers fetch
    cached_data = StateCache(summary=fake_summary, map=mock_state_maps, lastUpdated="")
    mock_get_cache.return_value = cached_data
    is_integer.return_value = False

    # Fake GeoJSON features
    features = [
        Feature(
            type="Feature",
            geometry=Geometry(type="", coordinates=[]),
            properties={"NAME": "Chittenden South East"},
        )
    ]
    fake_geojson = FeatureCollection(type="FeatureCollection", features=features)
    mock_fetch.return_value = fake_geojson

    # Act
    # (params don't actually need to be real VT values since mocks will return VT data regardless)
    # But it for consistency/clarity I did use VT usps and stateFP code
    result = await get_sldu_service("50", "VT")

    # Assert
    mock_get_cache.assert_awaited_once()
    mock_fetch.assert_awaited_once()
    mock_write_cache.assert_called_once()

    # Check state senate enrichment
    assert result.map.features[0].properties["party"] == "Democrat"
    assert isinstance(result, StateResponse)
    assert result.summary == fake_summary


@pytest.mark.asyncio
@patch("app.services.geojson_service.Get_State_Cache", new_callable=AsyncMock)
async def test_get_sldl_service_cached(mock_get_cache):
    """Return immediately if map is already a FeatureCollection."""
    # Arrange
    fake_map = create_autospec(FeatureCollection, instance=True)
    mock_state_maps = StateMapData(senate=fake_map, house=fake_map, congressional=fake_map)
    fake_summary = create_autospec(StateSummary, instance=True)
    cached_data = StateCache(summary=fake_summary, map=mock_state_maps, lastUpdated="")
    mock_get_cache.return_value = cached_data

    # Act
    result = await get_sldl_service("01", "AL")

    # Assert
    mock_get_cache.assert_awaited_once()
    assert isinstance(result, StateResponse)
    assert result.map == fake_map
    assert result.summary == fake_summary


@pytest.mark.asyncio
@patch("app.services.geojson_service.write_state_cache")
@patch("app.services.geojson_service.fetch_and_filter_geojson", new_callable=AsyncMock)
@patch("app.services.geojson_service.Get_State_Cache", new_callable=AsyncMock)
@patch("app.services.geojson_service.is_integer")
async def test_get_sldl_service_fetch_and_enrich(
    is_integer, mock_get_cache, mock_fetch, mock_write_cache
):
    """
    Fetch GeoJSON if cached map is not a FeatureCollection,
    enrich with state senators, write to cache.
    """
    # Arrange
    fake_summary = create_autospec(StateSummary, instance=True)
    fake_map = create_autospec(FeatureCollection, instance=True)
    mock_house_map = DistrictMap(root={"1": "Democrat", "2": "Republican"})
    mock_state_maps = StateMapData(senate=fake_map, house=mock_house_map, congressional=fake_map)

    # Cached map is not a FeatureCollection → triggers fetch
    cached_data = StateCache(summary=fake_summary, map=mock_state_maps, lastUpdated="")
    mock_get_cache.return_value = cached_data
    is_integer.return_value = True

    # Fake GeoJSON features
    features = [
        Feature(
            type="Feature",
            geometry=Geometry(type="", coordinates=[]),
            properties={"NAME": "01"},
        ),
        Feature(
            type="Feature", geometry=Geometry(type="", coordinates=[]), properties={"NAME": "02"}
        ),
    ]
    fake_geojson = FeatureCollection(type="FeatureCollection", features=features)
    mock_fetch.return_value = fake_geojson

    # Act
    result = await get_sldl_service("01", "AL")

    # Assert
    mock_get_cache.assert_awaited_once()
    mock_fetch.assert_awaited_once()
    mock_write_cache.assert_called_once()

    # Check state senate enrichment
    assert result.map.features[0].properties["party"] == "Democrat"
    assert result.map.features[1].properties["party"] == "Republican"
    assert isinstance(result, StateResponse)
    assert result.summary == fake_summary


@pytest.mark.asyncio
@patch("app.services.geojson_service.Get_State_Cache", new_callable=AsyncMock)
async def test_get_cd_service_cached(mock_get_cache):
    """Return immediately if map is already a FeatureCollection."""
    # Arrange
    fake_map = create_autospec(FeatureCollection, instance=True)
    mock_state_maps = StateMapData(senate=fake_map, house=fake_map, congressional=fake_map)
    fake_summary = create_autospec(StateSummary, instance=True)
    cached_data = StateCache(summary=fake_summary, map=mock_state_maps, lastUpdated="")
    mock_get_cache.return_value = cached_data

    # Act
    result = await get_cd_service("01", "AL")

    # Assert
    mock_get_cache.assert_awaited_once()
    assert isinstance(result, StateResponse)
    assert result.map == fake_map
    assert result.summary == fake_summary


@pytest.mark.asyncio
@patch("app.services.geojson_service.write_state_cache")
@patch("app.services.geojson_service.fetch_and_filter_geojson", new_callable=AsyncMock)
@patch("app.services.geojson_service.Get_State_Cache", new_callable=AsyncMock)
@patch("app.services.geojson_service.is_integer")
async def test_get_cd_service_fetch_and_enrich(
    is_integer, mock_get_cache, mock_fetch, mock_write_cache
):
    """
    Fetch GeoJSON if cached map is not a FeatureCollection,
    enrich with state senators, write to cache.
    """
    # Arrange
    fake_summary = create_autospec(StateSummary, instance=True)
    fake_map = create_autospec(FeatureCollection, instance=True)
    mock_congressional_map = DistrictMap(root={"1": "Democrat", "2": "Republican"})
    mock_state_maps = StateMapData(
        senate=fake_map, house=fake_map, congressional=mock_congressional_map
    )

    # Cached map is not a FeatureCollection → triggers fetch
    cached_data = StateCache(summary=fake_summary, map=mock_state_maps, lastUpdated="")
    mock_get_cache.return_value = cached_data
    is_integer.return_value = True

    # Fake GeoJSON features
    features = [
        Feature(
            type="Feature",
            geometry=Geometry(type="", coordinates=[]),
            properties={"CD119FP": "01"},
        ),
        Feature(
            type="Feature", geometry=Geometry(type="", coordinates=[]), properties={"CD119FP": "02"}
        ),
    ]
    fake_geojson = FeatureCollection(type="FeatureCollection", features=features)
    mock_fetch.return_value = fake_geojson

    # Act
    result = await get_cd_service("01", "AL")

    # Assert
    mock_get_cache.assert_awaited_once()
    mock_fetch.assert_awaited_once()
    mock_write_cache.assert_called_once()

    # Check state senate enrichment
    assert result.map.features[0].properties["party"] == "Democrat"
    assert result.map.features[1].properties["party"] == "Republican"
    assert isinstance(result, StateResponse)
    assert result.summary == fake_summary


@pytest.mark.asyncio
@patch("app.services.geojson_service.fetch_and_filter_geojson", new_callable=AsyncMock)
@patch("app.services.geojson_service.Get_State_Cache", new_callable=AsyncMock)
async def test_get_county_service(mock_get_cache, mock_fetch):
    mock_summary = create_autospec(StateSummary, instance=True)
    fake_maps = create_autospec(FeatureCollection, instance=True)
    mock_state_maps = StateMapData(senate=fake_maps, house=fake_maps, congressional=fake_maps)
    cached_data = StateCache(summary=mock_summary, map=mock_state_maps, lastUpdated="")

    mock_map = create_autospec(FeatureCollection, instance=True)
    mock_fetch.return_value = mock_map
    mock_get_cache.return_value = cached_data

    result = await get_county_service("12", "fl")

    assert result.summary == mock_summary
    assert result.map == mock_map
    mock_get_cache.assert_awaited_with("FL")
    mock_fetch.assert_awaited_with(
        "https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_county_500k.zip",
        state_filter="12",
    )


@pytest.mark.asyncio
@patch("app.services.geojson_service.fetch_and_filter_geojson", new_callable=AsyncMock)
@patch("app.services.geojson_service.Get_State_Cache", new_callable=AsyncMock)
async def test_get_place_service(mock_get_cache, mock_fetch):
    mock_summary = create_autospec(StateSummary, instance=True)
    fake_maps = create_autospec(FeatureCollection, instance=True)
    mock_state_maps = StateMapData(senate=fake_maps, house=fake_maps, congressional=fake_maps)
    cached_data = StateCache(summary=mock_summary, map=mock_state_maps, lastUpdated="")

    mock_map = create_autospec(FeatureCollection, instance=True)
    mock_fetch.return_value = mock_map
    mock_get_cache.return_value = cached_data

    result = await get_place_service("06", "ca")

    assert result.summary == mock_summary
    assert result.map == mock_map
    mock_get_cache.assert_awaited_with("CA")
    mock_fetch.assert_awaited_with(
        "https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_place_500k.zip",
        state_filter="06",
    )


@pytest.mark.asyncio
@patch("app.services.geojson_service.fetch_and_filter_geojson", new_callable=AsyncMock)
@patch("app.services.geojson_service.Get_State_Cache", new_callable=AsyncMock)
async def test_get_cousub_service(mock_get_cache, mock_fetch):
    mock_summary = create_autospec(StateSummary, instance=True)
    fake_maps = create_autospec(FeatureCollection, instance=True)
    mock_state_maps = StateMapData(senate=fake_maps, house=fake_maps, congressional=fake_maps)
    cached_data = StateCache(summary=mock_summary, map=mock_state_maps, lastUpdated="")

    mock_map = create_autospec(FeatureCollection, instance=True)
    mock_fetch.return_value = mock_map
    mock_get_cache.return_value = cached_data

    result = await get_cousub_service("36", "ny")

    assert result.summary == mock_summary
    assert result.map == mock_map
    mock_get_cache.assert_awaited_with("NY")
    mock_fetch.assert_awaited_with(
        "https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_cousub_500k.zip",
        state_filter="36",
    )
