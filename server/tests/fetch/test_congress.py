from unittest.mock import AsyncMock, patch

import pytest
from fastapi import HTTPException

from app.fetch.congress import (
    Fetch_All_Congress_Officials,
    Fetch_All_Congress_Officials_For_State,
    Fetch_Congress_District_Official,
)
from app.schemas.models import Official, Term


@pytest.mark.asyncio
@patch("app.fetch.congress.normalize_cd_official")
@patch("app.fetch.congress.httpx.AsyncClient")
async def test_fetch_all_congress_officials(mock_httpx, mock_normalize):
    # Mock two pages of API responses
    first_page = {
        "members": [{"name": "Alice"}, {"name": "Bob"}],
        "pagination": {"next": "http://fake.url/page2"},
    }
    second_page = {
        "members": [{"name": "Carol"}, {"name": "Joe"}, {"name": "Dan"}],
        "pagination": {"next": None},
    }

    # Setup async client mock
    mock_client = AsyncMock()
    mock_response1 = AsyncMock()
    mock_response1.json = lambda: first_page
    mock_response2 = AsyncMock()
    mock_response2.json = lambda: second_page

    # get() will return responses in order
    mock_client.get = AsyncMock(side_effect=[mock_response1, mock_response2])
    mock_httpx.return_value.__aenter__.return_value = mock_client

    # Setup normalize_cd_official to return controlled Official objects
    def side_effect(member):
        if member["name"] == "Alice":
            return Official(
                name="Alice",
                state="CA",
                terms=[Term(chamber="House", start_year=2023, end_year=None)],
            )
        if member["name"] == "Bob":
            return Official(
                name="Bob",
                state="Puerto Rico",
                terms=[Term(chamber="House", start_year=2023, end_year=None)],
            )
        if member["name"] == "Carol":
            return Official(
                name="Carol",
                state="NY",
                terms=[Term(chamber="Senate", start_year=2023, end_year=None)],
            )
        if member["name"] == "Joe":
            return Official(
                name="Carol",
                state="NY",
                terms=[],  # should not be added
            )
        if member["name"] == "Dan":
            return Official(
                name="Carol",
                state="NY",
                terms=[
                    Term(chamber="Senate", start_year=2023, end_year=2025)
                ],  # should not be added
            )

    mock_normalize.side_effect = side_effect

    # Call the function
    senate_members, house_members, non_voting_house_members = await Fetch_All_Congress_Officials()

    # Assertions
    assert len(senate_members) == 1
    assert senate_members[0].name == "Carol"

    assert len(house_members) == 1
    assert house_members[0].name == "Alice"

    assert len(non_voting_house_members) == 1
    assert non_voting_house_members[0].name == "Bob"

    # Ensure get() was awaited twice (pagination)
    assert mock_client.get.await_count == 2


@pytest.mark.asyncio
@patch("app.fetch.congress.normalize_cd_official")
@patch("app.fetch.congress.httpx.AsyncClient")
async def test_fetch_all_congress_officials_for_state(mock_httpx, mock_normalize):
    # Mock two pages of API responses for state 'CA'
    first_page = {
        "members": [{"name": "Alice"}, {"name": "Bob"}],
        "pagination": {"next": "http://fake.url/page2"},
    }
    second_page = {
        "members": [{"name": "Carol"}, {"name": "Joe"}, {"name": "Dan"}],
        "pagination": {"next": None},
    }

    # Setup async client mock
    mock_client = AsyncMock()
    mock_response1 = AsyncMock()
    mock_response1.json = lambda: first_page
    mock_response2 = AsyncMock()
    mock_response2.json = lambda: second_page
    mock_client.get = AsyncMock(side_effect=[mock_response1, mock_response2])
    mock_httpx.return_value.__aenter__.return_value = mock_client

    # Setup normalize_cd_official to return controlled Official objects
    def side_effect(member):
        if member["name"] == "Alice":
            return Official(
                name="Alice",
                state="CA",
                terms=[Term(chamber="House", start_year=2023, end_year=None)],
            )
        if member["name"] == "Bob":
            return Official(
                name="Bob",
                state="CA",
                terms=[Term(chamber="House", start_year=2023, end_year=None)],
            )
        if member["name"] == "Carol":
            return Official(
                name="Carol",
                state="CA",
                terms=[Term(chamber="Senate", start_year=2023, end_year=None)],
            )
        if member["name"] == "Joe":
            return Official(
                name="Carol",
                state="NY",
                terms=[],  # should not be added
            )
        if member["name"] == "Dan":
            return Official(
                name="Carol",
                state="NY",
                terms=[
                    Term(chamber="Senate", start_year=2023, end_year=2025)
                ],  # should not be added
            )

    mock_normalize.side_effect = side_effect

    # Call the function
    senators, house_members = await Fetch_All_Congress_Officials_For_State("CA")

    # Assertions
    assert len(senators) == 1
    assert senators[0].name == "Carol"

    assert len(house_members) == 2
    assert {m.name for m in house_members} == {"Alice", "Bob"}

    # Ensure get() was awaited twice (pagination)
    assert mock_client.get.await_count == 2


@pytest.mark.asyncio
@patch("app.fetch.congress.normalize_cd_official")
@patch("app.fetch.congress.httpx.AsyncClient")
async def test_fetch_congress_district_official_success(mock_httpx, mock_normalize):
    # Mock API response
    api_response = {"members": [{"name": "Alice", "district": 12}]}

    # Mock client
    mock_client = AsyncMock()
    mock_response = AsyncMock()
    mock_response.status_code = 200
    mock_response.json = lambda: api_response
    mock_client.get = AsyncMock(return_value=mock_response)
    mock_httpx.return_value.__aenter__.return_value = mock_client

    # Mock adapter
    mock_normalize.return_value = Official(name="Alice")

    # Call the function
    official = await Fetch_Congress_District_Official("CA", "12")

    # Assertions
    assert isinstance(official, Official)
    assert official.name == "Alice"

    # Ensure GET called with correct URL
    mock_client.get.assert_awaited_once()
    called_url = mock_client.get.await_args[0][0]  # positional first arg
    assert called_url.startswith("https://api.congress.gov/v3/member/congress/119/CA/12?api_key=")


@pytest.mark.asyncio
@patch("app.fetch.congress.httpx.AsyncClient")
async def test_fetch_congress_district_official_404(mock_httpx):
    mock_client = AsyncMock()
    mock_response = AsyncMock()
    mock_response.status_code = 404
    mock_client.get = AsyncMock(return_value=mock_response)
    mock_httpx.return_value.__aenter__.return_value = mock_client

    with pytest.raises(HTTPException) as exc_info:
        await Fetch_Congress_District_Official("CA", "12")

    assert exc_info.value.status_code == 404
    assert "No member found" in exc_info.value.detail


@pytest.mark.asyncio
@patch("app.fetch.congress.httpx.AsyncClient")
async def test_fetch_congress_district_official_error(mock_httpx):
    mock_client = AsyncMock()
    mock_response = AsyncMock()
    mock_response.status_code = 502
    mock_client.get = AsyncMock(return_value=mock_response)
    mock_httpx.return_value.__aenter__.return_value = mock_client

    with pytest.raises(HTTPException) as exc_info:
        await Fetch_Congress_District_Official("CA", "12")

    assert exc_info.value.status_code == 502
    assert "Congress API error" in exc_info.value.detail
