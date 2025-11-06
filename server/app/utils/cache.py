from datetime import datetime, timezone
import json
import os

CACHE_DIR = "app/cache/"
CACHE_EXPIRATION_DAYS = 30

# ensure cache directory exists
os.makedirs(CACHE_DIR, exist_ok=True)

def read_cache(state_abbr: str = None):
    """Return cached data if available and valid."""
    file_path = ""
    if(state_abbr):
        file_path = os.path.join(f"{CACHE_DIR}/state_cache/", f"{state_abbr.upper()}.json")
    else:
        file_path = os.path.join(CACHE_DIR, "FED.json")
    
    if not os.path.exists(file_path):
        return None

    with open(file_path, "r") as f:
        data = json.load(f)

    last_updated = datetime.fromisoformat(data["lastUpdated"])
    if (datetime.now(timezone.utc) - last_updated).days < CACHE_EXPIRATION_DAYS:
        return data
    return None


def write_cache(data, state_abbr: str = None):
    """Write new data to cache."""
    file_path = ""
    if(state_abbr):
        file_path = os.path.join(f"{CACHE_DIR}/state_cache/", f"{state_abbr.upper()}.json")
    else:
        file_path = os.path.join(CACHE_DIR, "FED.json")

    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)