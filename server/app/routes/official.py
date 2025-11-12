from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
import os
import requests
import json

load_dotenv()

CONGRESS_API_KEY = os.getenv("GPO_CONGRESS_APIKEY")
OPENSTATES_API_KEY = os.getenv("OPEN_STATES_APIKEY")

BASE_CONGRESS_URL = "https://api.congress.gov/v3"
BASE_OPENSTATES_URL = "https://v3.openstates.org"


router = APIRouter()

# Congressional District Official
@router.get("/cd/{state}/{district}")
async def get_congressional_official(state: str, district: str):
    congress = 119 #current congress number (2024-present)
    CD_OFFICIALS_URL = f"{BASE_CONGRESS_URL}/member/congress/{congress}/{state}/{district}?api_key={CONGRESS_API_KEY}"

    resp = requests.get(CD_OFFICIALS_URL)
    if resp.status_code == 404:
        raise HTTPException(status_code=404, detail=f"No member found for {state} CD {district}")
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Congress API error: {resp.status_code}")

    data = resp.json()
    members = [user for user in data['members'] if user['district'] == int(district)]
    return members


def get_district_info(state: str, chamber: str, district_name: str):
    """
    Step 1: Get the matching district object from OpenStates
    Step 2: Retrieve full district info (with members)
    """
    headers = {"X-API-KEY": OPENSTATES_API_KEY}

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
    search_response = requests.get(search_url, headers=headers, params=params, timeout=10)
    if search_response.status_code != 200:
        raise HTTPException(status_code=search_response.status_code, detail="Error from OpenStates API")

    data = search_response.json()
    return data['results']


# State Senate Official
@router.get("/sldu/{state}/{district}")
def get_state_senate(state: str, district: str):
    result = get_district_info(state, "upper", district)
    return result


# State House Official
@router.get("/sldl/{state}/{district}")
def get_state_house(state: str, district):
    result = get_district_info(state, "lower", district)
    return result
