from unittest.mock import AsyncMock, patch

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.routes.official import router
from app.schemas.models import Official

app = FastAPI()
app.include_router(router)
client = TestClient(app)


@patch("app.routes.official.get_cd_official_service", new_callable=AsyncMock)
def test_get_cd_route_success(mock_service):
    # Prepare a mock response for the service
    mock_response = Official(name="John Doe")
    mock_service.return_value = mock_response

    # Call the route
    res = client.get("/cd/al/1")

    # Assertions
    assert res.status_code == 200
    mock_service.assert_awaited_once_with("al", "1")


@patch("app.routes.official.get_sldu_official_service", new_callable=AsyncMock)
def test_get_sldu_route_success(mock_service):
    # Prepare a mock response for the service
    mock_response = Official(name="John Doe")
    mock_service.return_value = mock_response

    # Call the route
    res = client.get("/sldu/al/2")

    # Assertions
    assert res.status_code == 200
    mock_service.assert_awaited_once_with("al", "2")


@patch("app.routes.official.get_sldl_official_service", new_callable=AsyncMock)
def test_get_sldl_route_success(mock_service):
    # Prepare a mock response for the service
    mock_response = Official(name="John Doe")
    mock_service.return_value = mock_response

    # Call the route
    res = client.get("/sldl/al/3")

    # Assertions
    assert res.status_code == 200
    mock_service.assert_awaited_once_with("al", "3")
