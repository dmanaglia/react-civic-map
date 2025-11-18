from unittest.mock import AsyncMock, patch

import pytest

from app.schemas.models import FederalData, Official, SenatorMap, StateData, StateMapData
from app.utils.summarize import (
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
