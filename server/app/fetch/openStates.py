import asyncio
import json
import os
from typing import List, Tuple

import httpx
from dotenv import load_dotenv
from fastapi import HTTPException

from app.schemas.adapters import normalize_state_legislator
from app.schemas.models import Official

load_dotenv()
OPENSTATES_API_KEY = os.getenv("OPEN_STATES_APIKEY")
BASE_OPENSTATES_URL = "https://v3.openstates.org"
HEADERS = {"X-API-KEY": OPENSTATES_API_KEY}


# TODO Clean this function up
async def Fetch_All_State_Officials(
    state_abbr: str,
) -> Tuple[List[Official], List[Official], List[Official]]:
    """Fetch all legislators for a given state from OpenStates API."""
    members = [list[Official]([]), list[Official]([]), list[Official]([])]
    async with httpx.AsyncClient() as client:
        url = "https://v3.openstates.org/people"
        chambers = ["upper", "lower", "executive"]  # "upper" = senate, "lower" = house, executive
        for i in range(len(chambers)):
            page = 1
            max_page = 1

            while page <= max_page:
                response = await client.get(
                    url,
                    headers=HEADERS,
                    params={
                        "jurisdiction": state_abbr,
                        "org_classification": chambers[i],
                        "per_page": 50,
                        "page": page,
                    },
                )
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=500, detail=f"Error fetching data for {state_abbr}"
                    )
                data = response.json()
                pagination = data.get("pagination", {})
                page = int(pagination.get("page", "")) + 1
                max_page = pagination.get("max_page", "")
                for member in data.get("results", []):
                    official = normalize_state_legislator(member)
                    members[i].append(official)
                # members[i].extend(data.get("results", []))
                await asyncio.sleep(1)

    return members[0], members[1], members[2]  # senate, house, executive


async def Fetch_State_District_Official(state: str, chamber: str, district_name: str) -> Official:
    async with httpx.AsyncClient() as client:
        # Normalize state input
        state = state.lower().strip()
        chamber = chamber.lower().strip()
        district_name = district_name.strip()

        # Step 1: Find the district by name
        search_url = f"{BASE_OPENSTATES_URL}/people"
        params = {
            "jurisdiction": state,
            "org_classification": chamber,  # "upper" = senate, "lower" = house
            "district": district_name,
        }
        response = await client.get(search_url, headers=HEADERS, params=params, timeout=10)
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, detail="Error from OpenStates API"
            )

        data = response.json()
        print(json.dumps(data["results"][0], indent=2))
        # TODO: sometimes results are empty if district has a current vacancy.
        # Should raise exception for consistency
        official = normalize_state_legislator(data["results"][0])
        return official
