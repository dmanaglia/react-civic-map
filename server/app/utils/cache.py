import gzip
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional, Type, TypeVar

import orjson

from app.schemas.models import (
    FederalCache,
    FederalData,
    StateCache,
    StateData,
)

# ---------- CONFIG ----------
CACHE_DIR = Path("app/cache")
STATE_CACHE_DIR = CACHE_DIR / "state_cache"
CACHE_EXPIRATION_DAYS = 30
STATE_CACHE_DIR.mkdir(parents=True, exist_ok=True)
T = TypeVar("T", FederalCache, StateCache)


def read_cache(model: Type[T], state_abbr: Optional[str] = None) -> Optional[T]:
    """
    Reads and validates cached data.
    Returns a parsed Pydantic model instance if valid and fresh.
    """
    if state_abbr:
        file_path = STATE_CACHE_DIR / f"{state_abbr.upper()}.json.gz"
    else:
        file_path = CACHE_DIR / "FED.json.gz"

    if not file_path.exists():
        return None

    try:
        with gzip.open(file_path, "rb") as f:
            data = orjson.loads(f.read())
    except (orjson.JSONDecodeError, OSError):
        return None

    # ensure required metadata
    last_updated_str = data.get("lastUpdated")
    if not last_updated_str:
        return None

    try:
        last_updated = datetime.fromisoformat(last_updated_str)
    except ValueError:
        return None

    # check expiration
    if datetime.now(timezone.utc) - last_updated > timedelta(days=CACHE_EXPIRATION_DAYS):
        return None

    try:
        return model(**data)
    except Exception as e:
        print(f"Cache validation failed: {e}")
        return None


def write_federal_cache(data: FederalData) -> FederalCache:
    """
    Serializes FederalData instance and writes to cache.
    Automatically adds 'lastUpdated' metadata.
    Returns cached payload.
    """

    federalCache = FederalCache(
        summary=data.summary,
        map=data.map,
        lastUpdated=datetime.now(timezone.utc).isoformat(),
    )

    file_path = CACHE_DIR / "FED.json.gz"
    file_path.parent.mkdir(parents=True, exist_ok=True)

    with gzip.open(file_path, "wb") as f:
        f.write(orjson.dumps(federalCache.model_dump()))

    return federalCache


def write_state_cache(data: StateData, state_abbr: str) -> StateCache:
    """
    Serializes StateData instance and writes to cache.
    Automatically adds 'lastUpdated' metadata.
    Returns cached payload.
    """
    stateCache = StateCache(
        summary=data.summary,
        map=data.map,
        lastUpdated=datetime.now(timezone.utc).isoformat(),
    )

    file_path = STATE_CACHE_DIR / f"{state_abbr.upper()}.json.gz"
    file_path.parent.mkdir(parents=True, exist_ok=True)

    with gzip.open(file_path, "wb") as f:
        f.write(orjson.dumps(stateCache.model_dump()))

    return stateCache
