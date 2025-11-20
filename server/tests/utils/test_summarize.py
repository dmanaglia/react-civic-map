from unittest.mock import AsyncMock, create_autospec, patch

import pytest

from app.schemas.models import (
    FederalCache,
    FederalData,
    Official,
    SenatorMap,
    StateCache,
    StateData,
    StateMapData,
)
from app.utils.summarize import (
    Get_Federal_Cache,
    Get_State_Cache,
    Summarize_Federal_Gov_Data,
    Summarize_State_Gov_Data,
)

mock_senate_members = [
    Official(name="John Doe", party="Democrat", state="Alabama", district="1", metadata={}),
    Official(name="Jane Doe", party="Republican", state="Alaska", district="2", metadata={}),
    Official(name="Joseph Doe", party="Independent", state="Arizona", district="3", metadata={}),
    Official(name="Doe Jones", party="Green Party", state="Arkansas", district="4", metadata={}),
]

mock_senators = [
    Official(name="John Doe", party="Democrat", state="Alabama", metadata={}),
    Official(name="Jane Doe", party="Republican", state="Alabama", metadata={}),
]

mock_house_members = [
    Official(name="John Doe", party="Democrat", state="Alabama", district="1", metadata={}),
    Official(name="Jane Doe", party="Republican", state="Alabama", district="2", metadata={}),
    Official(name="Joseph Doe", party="Independent", state="Alabama", district="3", metadata={}),
    Official(name="Doe Jones", party="Green Party", state="Alabama", district="4", metadata={}),
]

mock_non_voting = [Official(name="John Doe", party="Democrat", metadata={})]

mock_state_exec = [
    Official(name="John Doe", party="Democrat", state="Alabama", metadata={}),
]


@pytest.mark.asyncio
async def test_summarize_federal_gov_data_counts():
    with patch(
        "app.utils.summarize.Fetch_All_Congress_Officials", new_callable=AsyncMock
    ) as mock_fetch:
        mock_fetch.return_value = (mock_senate_members, mock_house_members, mock_non_voting)
        result = await Summarize_Federal_Gov_Data()

    assert isinstance(result, FederalData)
    assert result.summary.legislative.senate.seats == 100
    assert result.summary.legislative.senate.democrat == 1
    assert result.summary.legislative.senate.republican == 1
    assert result.summary.legislative.senate.independent == 1
    assert result.summary.legislative.senate.other == 1
    assert result.summary.legislative.senate.vacant == 96

    assert result.summary.legislative.house.seats == 435
    assert result.summary.legislative.house.democrat == 1
    assert result.summary.legislative.house.republican == 1
    assert result.summary.legislative.house.independent == 1
    assert result.summary.legislative.house.other == 1
    assert result.summary.legislative.house.vacant == 431
    assert result.summary.legislative.house.non_voting == 1

    assert len(result.summary.executive) == 0  # TO BE IMPLEMENTED
    assert len(result.summary.judicial) == 0  # TO BE IMPLEMENTED

    assert isinstance(result.map, SenatorMap)
    assert "Alabama" in result.map.root and "democrat" in result.map.root["Alabama"]


@pytest.mark.asyncio
async def test_summarize_state_gov_data_counts():
    with patch(
        "app.utils.summarize.Fetch_All_Congress_Officials_For_State",
        new_callable=AsyncMock,
    ) as mock_fed, patch(
        "app.utils.summarize.Fetch_All_State_Officials", new_callable=AsyncMock
    ) as mock_state:
        mock_fed.return_value = (mock_senators, mock_house_members)
        mock_state.return_value = (mock_senate_members, mock_house_members, mock_state_exec)
        result = await Summarize_State_Gov_Data("AL")

    mock_fed.assert_called_once_with("AL")
    mock_state.assert_called_once_with("AL")

    assert isinstance(result, StateData)
    assert result.summary.legislative.senate.seats == 4
    assert result.summary.legislative.senate.democrat == 1
    assert result.summary.legislative.senate.republican == 1
    assert result.summary.legislative.senate.independent == 1
    assert result.summary.legislative.senate.other == 1
    assert result.summary.legislative.senate.vacant == 0

    assert result.summary.legislative.house.seats == 4
    assert result.summary.legislative.house.democrat == 1
    assert result.summary.legislative.house.republican == 1
    assert result.summary.legislative.house.independent == 1
    assert result.summary.legislative.house.other == 1
    assert result.summary.legislative.house.vacant == 0

    assert len(result.summary.executive) == 1
    assert len(result.summary.judicial) == 0  # TO BE IMPLEMENTED

    assert result.summary.federal.house.seats == 4
    assert result.summary.federal.house.democrat == 1
    assert result.summary.federal.house.republican == 1
    assert result.summary.federal.house.independent == 1
    assert result.summary.federal.house.other == 1
    assert result.summary.federal.house.vacant == 0
    assert len(result.summary.federal.senators) == 2

    assert isinstance(result.map, StateMapData)
    assert "1" in result.map.senate.root and "democrat" in result.map.senate.root["1"]
    assert "2" in result.map.house.root and "republican" in result.map.senate.root["2"]
    assert (
        "3" in result.map.congressional.root and "independent" in result.map.congressional.root["3"]
    )


@pytest.mark.asyncio
async def test_NH_edge_case():
    mock_NH_house = [
        Official(
            name="John Doe", party="Democrat", state="New Hampshire", district="1", metadata={}
        )
    ]
    with patch(
        "app.utils.summarize.Fetch_All_Congress_Officials_For_State",
        new_callable=AsyncMock,
    ) as mock_fed, patch(
        "app.utils.summarize.Fetch_All_State_Officials", new_callable=AsyncMock
    ) as mock_state, patch(
        "app.utils.summarize.format_string"
    ) as mock_format_str:
        mock_fed.return_value = ([], [])
        mock_state.return_value = ([], mock_NH_house, [])
        mock_format_str.return_value = "1"
        await Summarize_State_Gov_Data("NH")

    mock_format_str.assert_called_once_with("1")


@pytest.mark.asyncio
async def test_get_federal_cache_cached():
    mock_cache = create_autospec(FederalCache, instance=True)

    with patch("app.utils.summarize.read_cache", return_value=mock_cache) as mock_read, patch(
        "app.utils.summarize.Summarize_Federal_Gov_Data"
    ) as mock_sum, patch("app.utils.summarize.write_federal_cache") as mock_write:

        result = await Get_Federal_Cache()

        assert result is mock_cache
        mock_read.assert_called_once()
        mock_sum.assert_not_called()
        mock_write.assert_not_called()


@pytest.mark.asyncio
async def test_get_federal_cache_not_cached():
    fake_data = {"fed": "data"}
    mock_cache = create_autospec(FederalCache, instance=True)

    with patch("app.utils.summarize.read_cache", return_value=None), patch(
        "app.utils.summarize.Summarize_Federal_Gov_Data", new=AsyncMock(return_value=fake_data)
    ) as mock_sum, patch(
        "app.utils.summarize.write_federal_cache", return_value=mock_cache
    ) as mock_write:

        result = await Get_Federal_Cache()

    assert result is mock_cache
    mock_sum.assert_awaited_once()
    mock_write.assert_called_once_with(fake_data)


@pytest.mark.asyncio
async def test_get_state_cache_cached():
    mock_cache = create_autospec(FederalCache, instance=True)
    state = "al"

    with patch("app.utils.summarize.read_cache", return_value=mock_cache) as mock_read, patch(
        "app.utils.summarize.Summarize_State_Gov_Data"
    ) as mock_sum, patch("app.utils.summarize.write_state_cache") as mock_write:

        result = await Get_State_Cache(state)

    assert result is mock_cache
    mock_read.assert_called_once_with(model=StateCache, state_abbr="AL")
    mock_sum.assert_not_called()
    mock_write.assert_not_called()


@pytest.mark.asyncio
async def test_get_state_cache_not_cached():
    fake_data = {"state": "data"}
    mock_cache = create_autospec(FederalCache, instance=True)
    state = "AL"

    with patch("app.utils.summarize.read_cache", return_value=None), patch(
        "app.utils.summarize.Summarize_State_Gov_Data", new=AsyncMock(return_value=fake_data)
    ) as mock_sum, patch(
        "app.utils.summarize.write_state_cache", return_value=mock_cache
    ) as mock_write:

        result = await Get_State_Cache(state)

    assert result is mock_cache
    mock_sum.assert_awaited_once_with("AL")
    mock_write.assert_called_once_with(fake_data, "AL")
