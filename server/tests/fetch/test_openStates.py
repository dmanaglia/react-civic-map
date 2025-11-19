from unittest.mock import ANY, AsyncMock, patch

import pytest
from fastapi import HTTPException

from app.fetch.openStates import Fetch_All_State_Officials, Fetch_State_District_Official
from app.schemas.models import Official


@pytest.mark.asyncio
@patch("app.fetch.openStates.asyncio.sleep", new_callable=AsyncMock)  # skip sleep in fetch
@patch("app.fetch.openStates.httpx.AsyncClient")
@patch("app.fetch.openStates.normalize_state_legislator")
async def test_fetch_all_state_officials_success(mock_adapter, mock_httpx, mock_sleep):
    # Mock paginated API responses
    first_page = {
        "results": [
            {"given_name": "John", "family_name": "Doe"},
        ],
        "pagination": {"page": 1, "max_page": 1},
    }

    # AsyncClient mock instance
    mock_client = AsyncMock()
    mock_response = AsyncMock()
    mock_response.status_code = 200
    mock_response.json = lambda: first_page
    mock_client.get = AsyncMock(return_value=mock_response)  # ✅ get is async
    mock_httpx.return_value.__aenter__.return_value = mock_client

    # Adapter mock return value
    mock_adapter.return_value = Official(name="John Doe")

    # Call the function
    upper, lower, executive = await Fetch_All_State_Officials("CA")

    # Assertions
    assert len(upper) == 1
    assert isinstance(upper[0], Official)
    assert upper[0].name == "John Doe"

    # No lower/exec results in this test
    assert len(lower) == 1
    assert isinstance(lower[0], Official)
    assert lower[0].name == "John Doe"

    assert len(executive) == 1
    assert isinstance(executive[0], Official)
    assert executive[0].name == "John Doe"

    # Ensure HTTP GET called with correct params for upper chamber
    mock_client.get.assert_any_await(
        "https://v3.openstates.org/people",
        headers={"X-API-KEY": ANY},
        params={
            "jurisdiction": "CA",
            "org_classification": "upper",
            "per_page": 50,
            "page": 1,
        },
    )


@pytest.mark.asyncio
@patch("app.fetch.openStates.asyncio.sleep", new_callable=AsyncMock)
@patch("app.fetch.openStates.httpx.AsyncClient")
async def test_fetch_all_state_officials_http_error(mock_httpx, mock_sleep):
    # Return 500 from API
    mock_client = AsyncMock()
    mock_client.get.return_value.status_code = 500
    mock_client.get.return_value.json.return_value = {}
    mock_httpx.return_value.__aenter__.return_value = mock_client

    # Should raise HTTPException
    with pytest.raises(HTTPException) as exc:
        await Fetch_All_State_Officials("CA")
    assert exc.value.status_code == 500


@pytest.mark.asyncio
@patch("app.fetch.openStates.normalize_state_legislator")
@patch("app.fetch.openStates.httpx.AsyncClient")
async def test_fetch_state_district_official_success(mock_httpx, mock_adapter):
    # Mock API response
    api_response = {"results": [{"given_name": "Jane", "family_name": "Smith"}]}

    # Mock client
    mock_client = AsyncMock()
    mock_response = AsyncMock()
    mock_response.status_code = 200
    mock_response.json = lambda: api_response
    mock_client.get = AsyncMock(return_value=mock_response)
    mock_httpx.return_value.__aenter__.return_value = mock_client

    # Mock adapter
    mock_adapter.return_value = Official(name="Jane Smith")

    # Call the function
    official = await Fetch_State_District_Official("CA", "upper", "District 12")

    # Assertions
    assert isinstance(official, Official)
    assert official.name == "Jane Smith"

    # Check GET was called with expected params
    mock_client.get.assert_awaited_once_with(
        "https://v3.openstates.org/people",  # or whatever BASE_OPENSTATES_URL is
        headers={"X-API-KEY": ANY},
        params={"jurisdiction": "ca", "org_classification": "upper", "district": "District 12"},
        timeout=10,
    )


@pytest.mark.asyncio
@patch("app.fetch.openStates.httpx.AsyncClient")
async def test_fetch_state_district_official_http_error(mock_httpx):
    # Mock client returns 500
    mock_client = AsyncMock()
    mock_response = AsyncMock()
    mock_response.status_code = 500
    mock_response.json.return_value = {}
    mock_client.get = AsyncMock(return_value=mock_response)
    mock_httpx.return_value.__aenter__.return_value = mock_client

    # Should raise HTTPException
    with pytest.raises(HTTPException) as exc_info:
        await Fetch_State_District_Official("CA", "upper", "District 12")

    assert exc_info.value.status_code == 500
    assert exc_info.value.detail == "Error from OpenStates API"
