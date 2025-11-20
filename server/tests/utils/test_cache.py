from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock, create_autospec, patch

import orjson

from app.schemas.models import (
    FederalCache,
    FederalData,
    FederalSummary,
    SenatorMap,
    StateCache,
    StateData,
    StateMapData,
    StateSummary,
)
from app.utils.cache import read_cache, write_federal_cache, write_state_cache


@patch("app.utils.cache.orjson.dumps")
@patch("app.utils.cache.gzip.open")
@patch("app.utils.cache.STATE_CACHE_DIR")
def test_write_state_cache(mock_dir, mock_gzip_open, mock_dumps):
    # Arrange ---------------------------------------------------------------

    # Mock directory path behavior
    fake_path = MagicMock()
    mock_dir.__truediv__.return_value = fake_path
    fake_path.parent.mkdir = MagicMock()

    # Mock file handle that gzip.open returns
    fake_file = MagicMock()
    mock_gzip_open.return_value.__enter__.return_value = fake_file

    # Mock json dump result
    mock_dumps.return_value = b"serialized-json"

    # Input state data
    state_summary_mock = create_autospec(StateSummary, instance=True)
    state_map_mock = create_autospec(StateMapData, instance=True)
    fake_data = StateData(summary=state_summary_mock, map=state_map_mock)

    # Act -------------------------------------------------------------------
    result = write_state_cache(fake_data, "AL")

    # Assert: return value is correct StateCache -----------------------------
    assert isinstance(result, StateCache)
    assert result.summary == state_summary_mock
    assert result.map == state_map_mock

    # Validate lastUpdated was added
    dt = datetime.fromisoformat(result.lastUpdated)
    assert dt.tzinfo == timezone.utc

    # Assert: directory constructed correctly
    mock_dir.__truediv__.assert_called_once_with("AL.json.gz")

    # Assert: directory mkdir was called
    fake_path.parent.mkdir.assert_called_once_with(parents=True, exist_ok=True)

    # Assert: gzip.open called correctly
    mock_gzip_open.assert_called_once()
    args, kwargs = mock_gzip_open.call_args
    assert args[0] is fake_path
    assert args[1] == "wb"

    # Assert: file write was called with serialized JSON
    fake_file.write.assert_called_once_with(b"serialized-json")

    # Assert: dumps called with model_dump() of returned result
    mock_dumps.assert_called_once_with(result.model_dump())


@patch("app.utils.cache.orjson.dumps")
@patch("app.utils.cache.gzip.open")
@patch("app.utils.cache.CACHE_DIR")
def test_write_federal_cache(mock_dir, mock_gzip_open, mock_dumps):
    # Arrange ---------------------------------------------------------------

    # Mock directory path behavior
    fake_path = MagicMock()
    mock_dir.__truediv__.return_value = fake_path
    fake_path.parent.mkdir = MagicMock()

    # Mock file handle that gzip.open returns
    fake_file = MagicMock()
    mock_gzip_open.return_value.__enter__.return_value = fake_file

    # Mock json dump result
    mock_dumps.return_value = b"serialized-json"

    # Input state data
    fed_summary_mock = create_autospec(FederalSummary, instance=True)
    fed_map_mock = SenatorMap(root={})
    fake_data = FederalData(summary=fed_summary_mock, map=fed_map_mock)

    # Act -------------------------------------------------------------------
    result = write_federal_cache(fake_data)

    # Assert: return value is correct StateCache -----------------------------
    assert isinstance(result, FederalCache)
    assert result.summary == fed_summary_mock
    assert result.map == fed_map_mock

    # Validate lastUpdated was added
    dt = datetime.fromisoformat(result.lastUpdated)
    assert dt.tzinfo == timezone.utc

    # Assert: directory constructed correctly
    mock_dir.__truediv__.assert_called_once_with("FED.json.gz")

    # Assert: directory mkdir was called
    fake_path.parent.mkdir.assert_called_once_with(parents=True, exist_ok=True)

    # Assert: gzip.open called correctly
    mock_gzip_open.assert_called_once()
    args, kwargs = mock_gzip_open.call_args
    assert args[0] is fake_path
    assert args[1] == "wb"

    # Assert: file write was called with serialized JSON
    fake_file.write.assert_called_once_with(b"serialized-json")

    # Assert: dumps called with model_dump() of returned result
    mock_dumps.assert_called_once_with(result.model_dump())


@patch("app.utils.cache.Path.exists", return_value=False)
def test_read_fed_cache_no_file(mock_no_path):
    result = read_cache(FederalCache)
    assert result is None


@patch("app.utils.cache.Path.exists", return_value=True)
@patch("app.utils.cache.gzip.open")
@patch("app.utils.cache.orjson.loads", side_effect=orjson.JSONDecodeError("err", "", 0))
def test_read_cache_invalid_json(mock_loads, mock_gzip, mock_exists):
    result = read_cache(FederalCache)
    assert result is None


@patch("app.utils.cache.Path.exists", return_value=True)
@patch("app.utils.cache.gzip.open")
@patch("app.utils.cache.orjson.loads", return_value={"summary": {}, "map": {}})
def test_read_cache_missing_last_updated(mock_loads, mock_gzip, mock_exists):
    result = read_cache(FederalCache)
    assert result is None


@patch("app.utils.cache.Path.exists", return_value=True)
@patch("app.utils.cache.gzip.open")
@patch(
    "app.utils.cache.orjson.loads", return_value={"lastUpdated": "bad", "summary": {}, "map": {}}
)
def test_read_cache_invalid_lastupdated_format(mock_loads, mock_gzip, mock_exists):
    result = read_cache(FederalCache)
    assert result is None


@patch("app.utils.cache.Path.exists", return_value=True)
@patch("app.utils.cache.gzip.open")
def test_read_cache_expired(mock_gzip, mock_exists):
    expired_date = (datetime.now(timezone.utc) - timedelta(days=31)).isoformat()

    expired_data = {
        "lastUpdated": expired_date,
        "summary": {},
        "map": {},
    }

    with patch("app.utils.cache.orjson.loads", return_value=expired_data):
        result = read_cache(FederalCache)
        assert result is None


@patch("app.utils.cache.Path.exists", return_value=True)
@patch("app.utils.cache.gzip.open")
def test_read_cache_success(mock_gzip, mock_exists):
    fresh_date = datetime.now(timezone.utc).isoformat()

    payload = {
        "lastUpdated": fresh_date,
        "summary": create_autospec(FederalSummary, instance=True),
        "map": SenatorMap(root={}),
    }

    with patch("app.utils.cache.orjson.loads", return_value=payload):
        result = read_cache(FederalCache)

    assert isinstance(result, FederalCache)
    assert result.lastUpdated == fresh_date


@patch("app.utils.cache.Path.exists", return_value=True)
@patch("app.utils.cache.gzip.open")
def test_read_cache_model_validation_failure(mock_gzip, mock_exists):
    fresh_date = datetime.now(timezone.utc).isoformat()

    bad_payload = {
        "lastUpdated": fresh_date,
        # missing required fields → FederalCache() will fail
    }

    with patch("app.utils.cache.orjson.loads", return_value=bad_payload):
        result = read_cache(FederalCache)

    assert result is None


@patch("app.utils.cache.STATE_CACHE_DIR")
@patch("app.utils.cache.Path.exists", return_value=False)
def test_read_cache_state_path(mock_exists, mock_dir):
    read_cache(StateCache, state_abbr="AL")
    mock_dir.__truediv__.assert_called_once_with("AL.json.gz")
