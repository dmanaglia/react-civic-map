from datetime import datetime, timezone
from fastapi import APIRouter
import httpx
import os
import json
from app.utils.cache import read_cache, write_cache

CONGRESS_API_KEY = os.getenv("GPO_CONGRESS_APIKEY")
CONGRESS_NUMBER = 119 # may want to generalize this at some point
BASE_URL = f"https://api.congress.gov/v3/member/congress/{CONGRESS_NUMBER}"

async def fetch_all_members(state_abbr: str=None):
    """Fetches all members of the given chamber (House or Senate) with pagination."""
    members = []
    async with httpx.AsyncClient() as client:
        url = ""
        if(state_abbr):
            url = f"{BASE_URL}/{state_abbr}?limit=250&api_key={CONGRESS_API_KEY}"
        else:
            url = f"{BASE_URL}/?limit=250&api_key={CONGRESS_API_KEY}"
        while url:
            response = await client.get(url)
            data = response.json()
            members.extend(data.get("members", []))
            url = data.get("pagination", {}).get("next")
            if url: url = f"{url}&api_key={CONGRESS_API_KEY}"

        house_members = []
        non_voting_house_members = []
        senate_members = []

        nonVotingDistrict = [
            "American Samoa",
            "District of Columbia",
            "Guam",
            "Northern Mariana Islands",
            "Puerto Rico",
            "Virgin Islands"
        ]

        for m in members:
            if m.get("state", "") in nonVotingDistrict: 
                non_voting_house_members.append(m)
                continue
            terms_obj = m.get("terms", {})
            items = terms_obj.get("item", [])
            if not items:
                continue

            latest_term = items[-1]
            if(latest_term.get("endYear", "")):
                continue
            chamber = latest_term.get("chamber", "")
            if "House" in chamber:
                house_members.append(m)
            elif "Senate" in chamber:
                senate_members.append(m)

        return senate_members, house_members, non_voting_house_members


async def summarize_congress_data():
    """Builds summary statistics from all members."""
    senate_members, house_members, non_voting_house_members = await fetch_all_members()

    summary = {
        "executive": [], #TODO
        "legislative": {
            "house": {
                    "democrats": 0,
                    "republicans": 0,
                    "independents": 0, 
                    "vacancies": 435 - len(house_members), 
                    "non_voting": non_voting_house_members
            },
            "senate": {
                "democrats": 0, 
                "republicans": 0, 
                "independents": 0
            },
        },
        "judicial": [], #TODO
    }

    # Count House
    for m in house_members:
        party = m.get("partyName", "").lower()
        if "democrat" in party:
            summary["legislative"]["house"]["democrats"] += 1
        elif "republican" in party:
            summary["legislative"]["house"]["republicans"] += 1
        elif "independent" in party:
            summary["legislative"]["house"]["independents"] += 1

    # Count Senate
    for m in senate_members:
        party = m.get("partyName", "").lower()
        if "democrat" in party:
            summary["legislative"]["senate"]["democrats"] += 1
        elif "republican" in party:
            summary["legislative"]["senate"]["republicans"] += 1
        elif "independent" in party:
            summary["legislative"]["senate"]["independents"] += 1

    map = get_legislature_map(senate_members, house_members)
    
    data = {
        "summary": summary,
        "map": map,
        "lastUpdated": datetime.now(timezone.utc).isoformat()
    }

    return data

def get_legislature_map(senate_members: list, house_members: list):
    houseMap = {}
    for rep in house_members:
        if(rep["state"] in houseMap):
            houseMap[rep["state"]].update({rep["district"]: rep["partyName"]})
        else:
            houseMap.update({rep["state"]: {rep["district"]: rep["partyName"]}})

    senateMap = {}
    for rep in senate_members:
        if(rep["state"] in senateMap):
            senateMap[rep["state"]].update({"2": rep["partyName"]})
        else:
            senateMap.update({rep["state"]: {"1": rep["partyName"]}})

    return {"senate": senateMap, "house": houseMap}


router = APIRouter()

@router.get("/")
async def get_congress_summary():
    """
    Returns a cached summary of Congress data.
    """

    cached = read_cache()
    if cached:
        return {"cached": True, "summary": cached["summary"]}

    data = await summarize_congress_data()
    write_cache(data)

    return {"cached": False, "summary": data["summary"]}