from unittest.mock import AsyncMock, patch

import pytest

from app.schemas.models import Official
from app.services.official_service import (
    get_cd_official_service,
    get_sldl_official_service,
    get_sldu_official_service,
)


@pytest.mark.asyncio
@patch("app.services.official_service.Fetch_Congress_District_Official", new_callable=AsyncMock)
async def test_get_cd_official_service(mock_fetch):
    # Arrange
    fake_official = Official(name="Test CD")
    mock_fetch.return_value = fake_official

    # Act
    result = await get_cd_official_service("CA", "12")

    # Assert
    mock_fetch.assert_awaited_once_with("CA", "12")
    assert result == fake_official


@pytest.mark.asyncio
@patch("app.services.official_service.Fetch_State_District_Official", new_callable=AsyncMock)
async def test_get_sldu_official_service(mock_fetch):
    fake_official = Official(name="Test SLDU")
    mock_fetch.return_value = fake_official

    result = await get_sldu_official_service("TX", "5")

    mock_fetch.assert_awaited_once_with("TX", "upper", "5")
    assert result == fake_official


@pytest.mark.asyncio
@patch("app.services.official_service.Fetch_State_District_Official", new_callable=AsyncMock)
async def test_get_sldl_official_service(mock_fetch):
    fake_official = Official(name="Test SLDL")
    mock_fetch.return_value = fake_official

    result = await get_sldl_official_service("NY", "3")

    mock_fetch.assert_awaited_once_with("NY", "lower", "3")
    assert result == fake_official
