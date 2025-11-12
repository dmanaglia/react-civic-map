import asyncio
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
import httpx
import json
import os
import re
from app.utils.cache import read_cache, write_cache
from app.routes.summaries.fed import fetch_all_members

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
        
    fed_senate_reps, fed_house_reps, _ = await fetch_all_members(state_abbr=state_abbr)
    
    return summarize_state_legislators(members[0], members[1], members[2], fed_house_reps, fed_senate_reps, state_abbr)


def summarize_state_legislators(senate_members, house_members, executive, fed_house_reps, fed_senate_reps, state_abbr):
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
            "fed_reps": {
            "senate": fed_senate_reps,
            "house": {
                "seats": len(fed_house_reps),
                "democrats": 0, 
                "republicans": 0, 
                "independents": 0
            }
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

    for m in fed_house_reps:
        party = m.get("partyName", "").lower()
        if "democrat" in party:
            summary["legislative"]["fed_reps"]["house"]["democrats"] += 1
        elif "republican" in party:
            summary["legislative"]["fed_reps"]["house"]["republicans"] += 1
        elif "independent" in party:
            summary["legislative"]["fed_reps"]["house"]["independents"] += 1
    
    map = get_legislature_map(senate_members, house_members, state_abbr)
    
    data = {
        "summary": summary,
        "map": map,
        "lastUpdated": datetime.now(timezone.utc).isoformat()
    }
    return data


def format_string(s: str) -> str:
    match = re.match(r"^(.*?)(?:\s+(\d+))?$", s.strip())
    if not match:
        return s
    name, number = match.groups()
    if number:
        return f"{name} {int(number):02d}"
    return name

def get_legislature_map(senate_members: list, house_members: list, state_abbr: str):
    houseMap = {}
    for rep in house_members:
        key = rep["current_role"]["district"]
        if(state_abbr == "NH"):
            # Handle unique case where census district names != open state district names
            key = format_string(key)
        houseMap.update({key: rep["party"]})

    senateMap = {}
    for rep in senate_members:
        senateMap.update({rep["current_role"]["district"]: rep["party"]})

    return {"senate": senateMap, "house": houseMap}

router = APIRouter()

@router.get("/{state_abbr}")
async def get_state_summary(state_abbr: str):
    """Return cached or fresh state legislature summary."""

    state_abbr = state_abbr.upper()
    cached = read_cache(state_abbr)
    if cached:
        return {"cached": True, "summary": cached["summary"]}

    data = await fetch_state_legislators(state_abbr)
    write_cache(data, state_abbr)

    return {"cached": False, "summary": data["summary"]}