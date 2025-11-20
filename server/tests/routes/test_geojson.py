from unittest.mock import AsyncMock, create_autospec, patch

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.routes.geojson import router
from app.schemas.models import (
    FeatureCollection,
    FederalResponse,
    FederalSummary,
    StateResponse,
    StateSummary,
)

app = FastAPI()
app.include_router(router)
client = TestClient(app)


@patch("app.routes.geojson.get_states_service", new_callable=AsyncMock)
def test_get_states_route_success(mock_service):
    # Prepare a mock response for the service
    mock_service.return_value = FederalResponse(
        summary=create_autospec(FederalSummary, instance=True),
        map=create_autospec(FeatureCollection, instance=True),
    )
    # Call the route
    res = client.get("/states")

    # Assertions
    assert res.status_code == 200
    mock_service.assert_awaited_once()


@patch("app.routes.geojson.get_sldu_service", new_callable=AsyncMock)
def test_get_sldu_route_success(mock_service):
    # Prepare a mock response for the service
    mock_response = StateResponse(
        summary=create_autospec(StateSummary, instance=True),
        map=create_autospec(FeatureCollection, instance=True),
    )
    mock_service.return_value = mock_response

    # Call the route
    res = client.get("/sldu/01", params={"stateUSPS": "al"})

    # Assertions
    assert res.status_code == 200
    mock_service.assert_awaited_once_with("01", "al")


@patch("app.routes.geojson.get_sldl_service", new_callable=AsyncMock)
def test_get_sldl_route_success(mock_service):
    # Prepare a mock response for the service
    mock_response = StateResponse(
        summary=create_autospec(StateSummary, instance=True),
        map=create_autospec(FeatureCollection, instance=True),
    )
    mock_service.return_value = mock_response

    # Call the route
    res = client.get("/sldl/02", params={"stateUSPS": "ak"})

    # Assertions
    assert res.status_code == 200
    mock_service.assert_awaited_once_with("02", "ak")


@patch("app.routes.geojson.get_cd_service", new_callable=AsyncMock)
def test_get_cd_route_success(mock_service):
    # Prepare a mock response for the service
    mock_response = StateResponse(
        summary=create_autospec(StateSummary, instance=True),
        map=create_autospec(FeatureCollection, instance=True),
    )
    mock_service.return_value = mock_response

    # Call the route
    res = client.get("/cd/04", params={"stateUSPS": "az"})

    # Assertions
    assert res.status_code == 200
    mock_service.assert_awaited_once_with("04", "az")


@patch("app.routes.geojson.get_county_service", new_callable=AsyncMock)
def test_get_county_route_success(mock_service):
    # Prepare a mock response for the service
    mock_response = StateResponse(
        summary=create_autospec(StateSummary, instance=True),
        map=create_autospec(FeatureCollection, instance=True),
    )
    mock_service.return_value = mock_response

    # Call the route
    res = client.get("/county/05", params={"stateUSPS": "ar"})

    # Assertions
    assert res.status_code == 200
    mock_service.assert_awaited_once_with("05", "ar")


@patch("app.routes.geojson.get_place_service", new_callable=AsyncMock)
def test_get_place_route_success(mock_service):
    # Prepare a mock response for the service
    mock_response = StateResponse(
        summary=create_autospec(StateSummary, instance=True),
        map=create_autospec(FeatureCollection, instance=True),
    )
    mock_service.return_value = mock_response

    # Call the route
    res = client.get("/place/06", params={"stateUSPS": "ca"})

    # Assertions
    assert res.status_code == 200
    mock_service.assert_awaited_once_with("06", "ca")


@patch("app.routes.geojson.get_cousub_service", new_callable=AsyncMock)
def test_get_cousub_route_success(mock_service):
    # Prepare a mock response for the service
    mock_response = StateResponse(
        summary=create_autospec(StateSummary, instance=True),
        map=create_autospec(FeatureCollection, instance=True),
    )
    mock_service.return_value = mock_response

    # Call the route
    res = client.get("/cousub/08", params={"stateUSPS": "co"})

    # Assertions
    assert res.status_code == 200
    mock_service.assert_awaited_once_with("08", "co")
