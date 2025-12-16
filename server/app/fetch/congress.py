import json
import os
from typing import List, Tuple

import httpx
from dotenv import load_dotenv
from fastapi import HTTPException

from app.schemas.adapters import normalize_cd_official
from app.schemas.models import Official

load_dotenv()

CONGRESS_NUMBER = 119  # current congress number (2024-present)
BASE_URL = f"https://api.congress.gov/v3/member/congress/{CONGRESS_NUMBER}"
CONGRESS_API_KEY = os.getenv("GPO_CONGRESS_APIKEY")


async def Fetch_All_Congress_Officials() -> Tuple[List[Official], List[Official], List[Official]]:
    """Fetches all members of the given chamber (House or Senate) with pagination."""
    members = []
    async with httpx.AsyncClient() as client:
        url = f"{BASE_URL}/?limit=250&api_key={CONGRESS_API_KEY}"
        while url:
            response = await client.get(url)
            data = response.json()
            members.extend(data.get("members", []))
            url = data.get("pagination", {}).get("next")
            if url:
                url = f"{url}&api_key={CONGRESS_API_KEY}"

        house_members = list[Official]([])
        non_voting_house_members = list[Official]([])
        senate_members = list[Official]([])

        nonVotingDistrict = [
            "American Samoa",
            "District of Columbia",
            "Guam",
            "Northern Mariana Islands",
            "Puerto Rico",
            "Virgin Islands",
        ]

        for member in members:
            m = normalize_cd_official(member)
            if m.state in nonVotingDistrict:
                non_voting_house_members.append(m)
                continue
            terms = m.terms
            if not len(terms):
                continue

            latest_term = terms[-1]
            if latest_term.end_year:
                continue
            chamber = latest_term.chamber
            if "House" in chamber:
                house_members.append(m)
            elif "Senate" in chamber:
                senate_members.append(m)

        return senate_members, house_members, non_voting_house_members


async def Fetch_All_Congress_Officials_For_State(
    state_abbr: str,
) -> Tuple[List[Official], List[Official]]:
    members = []
    async with httpx.AsyncClient() as client:
        url = f"{BASE_URL}/{state_abbr}?limit=250&api_key={CONGRESS_API_KEY}"
        while url:
            response = await client.get(url)
            data = response.json()
            members.extend(data.get("members", []))
            url = data.get("pagination", {}).get("next")
            if url:
                url = f"{url}&api_key={CONGRESS_API_KEY}"

        house_members = list[Official]([])
        senators = list[Official]([])

        for member in members:
            m = normalize_cd_official(member)
            terms = m.terms
            if not terms:
                continue

            latest_term = terms[-1]
            if latest_term.end_year:
                continue
            chamber = latest_term.chamber
            if "House" in chamber:
                house_members.append(m)
            elif "Senate" in chamber:
                senators.append(m)

        return senators, house_members


async def Fetch_Congress_District_Official(state: str, district: str) -> Official:
    # TODO clean this function up
    async with httpx.AsyncClient() as client:
        url = f"{BASE_URL}/{state}/{district}?api_key={CONGRESS_API_KEY}"
        response = await client.get(url)
        if response.status_code == 404:
            raise HTTPException(
                status_code=404, detail=f"No member found for {state} CD {district}"
            )
        if response.status_code != 200:
            raise HTTPException(
                status_code=502, detail=f"Congress API error: {response.status_code}"
            )

        data = response.json()
        members = [member for member in data["members"] if member["district"] == int(district)]
        # Should only contain 1 member after filter
        # (sometimes api returns officials from different districts for some reason)
        print(json.dumps(members[0], indent=2))
        official = normalize_cd_official(members[0])
        return official
