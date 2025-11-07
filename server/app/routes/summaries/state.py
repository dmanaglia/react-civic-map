import asyncio
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
import httpx
import json
import os
from app.utils.cache import read_cache, write_cache

OPENSTATES_API_KEY = os.getenv("OPEN_STATES_APIKEY")

async def fetch_state_legislators(state_abbr: str):
    """Fetch all legislators for a given state from OpenStates API."""
    members = [[], [], []]
    async with httpx.AsyncClient() as client:


        url = "https://v3.openstates.org/people"
        headers = {"X-API-KEY": OPENSTATES_API_KEY}
        chambers = ["upper", "lower", "executive"] # "upper" = senate, "lower" = house, executive => just governor
        for i in range(len(chambers)):
            page = 1
            max_page = 1

            while page <= max_page:
                response = await client.get(url, headers=headers, params={
                    "jurisdiction": state_abbr,
                    "org_classification": chambers[i],
                    "per_page": 50,
                    "page": page
                })
                if response.status_code != 200:
                    raise HTTPException(status_code=500, detail=f"Error fetching data for {state_abbr}")
                data = response.json()
                pagination = data.get("pagination", {})
                page = int(pagination.get("page", "")) + 1
                max_page = pagination.get("max_page", "")
                members[i].extend(data.get("results", []))
                await asyncio.sleep(1)

    print(f"{state_abbr} Senate count:", len(members[0]))
    print(f"{state_abbr} House count:", len(members[1]))
    print(f"{state_abbr} Executive count:", len(members[2]))

    for mem in members[2]:
        print(json.dumps(mem, indent=4))
    
    return summarize_state_legislators(members[0], members[1], members[2])


def summarize_state_legislators(senate_members, house_members, executive):
    """Create a summarized overview of the state legislature."""
    summary = {
        "executive": executive,
        "legislative": {
            "house": {
                "democrats": 0, 
                "republicans": 0,
                "independents": 0 
            },
            "senate": {
                "democrats": 0, 
                "republicans": 0, 
                "independents": 0
            },
        },
        "judicial": [], #TODO
        "lastUpdated": datetime.now(timezone.utc).isoformat()
    }

    # Count House
    for m in house_members:
        party = m.get("party", "").lower()
        if "democrat" in party:
            summary["legislative"]["house"]["democrats"] += 1
        elif "republican" in party:
            summary["legislative"]["house"]["republicans"] += 1
        elif "independent" in party:
            summary["legislative"]["house"]["independents"] += 1

    # Count Senate
    for m in senate_members:
        party = m.get("party", "").lower()
        if "democrat" in party:
            summary["legislative"]["senate"]["democrats"] += 1
        elif "republican" in party:
            summary["legislative"]["senate"]["republicans"] += 1
        elif "independent" in party:
            summary["legislative"]["senate"]["independents"] += 1
    
    # print(json.dumps(summary, indent=4))
    return summary


router = APIRouter()

@router.get("/{state_abbr}")
async def get_state_summary(state_abbr: str):
    """Return cached or fresh state legislature summary."""

    state_abbr = state_abbr.upper()
    cached = read_cache(state_abbr)
    if cached:
        return {"cached": True, "summary": cached}

    summary = await fetch_state_legislators(state_abbr)
    write_cache(summary, state_abbr)

    return {"cached": False, "summary": summary}