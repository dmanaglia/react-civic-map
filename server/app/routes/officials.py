import os
import time
import requests
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv

load_dotenv()

GPO_CONGRESS_APIKEY = os.getenv("GPO_CONGRESS_APIKEY")
OPENSTATES_API_KEY = os.getenv("OPEN_STATES_APIKEY")


router = APIRouter()

# Congressional District Officials
@router.get("/cd/{state}/{district}")
async def get_congressional_official(state: str, district: str):
    congress = 119
    CD_OFFICIALS_URL = f"https://api.congress.gov/v3/member/congress/{congress}/{state}/{district}?api_key={GPO_CONGRESS_APIKEY}"

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
    search_url = "https://v3.openstates.org/people"
    params = {
        "jurisdiction": "IL",
        "org_classification": chamber,  # "upper" = senate, "lower" = house
        "district": district_name,
    }
    search_response = requests.get(search_url, headers=headers, params=params, timeout=10)
    if search_response.status_code != 200:
        raise HTTPException(status_code=search_response.status_code, detail="Error from OpenStates API")

    data = search_response.json()
    return data['results']

# State Senate Officials
@router.get("/sldu/{state}/{district}")
def get_state_senate(state: str, district: str):
    """
    Get Illinois (or other state) State Senate members
    Example: /state_senate?state=illinois&district_name=25
    """
    result = get_district_info(state, "upper", district)
    return result

# State House Officials
@router.get("/sldl/{state}/{district}")
def get_state_house(state: str, district):
    """
    Get Illinois (or other state) State House members
    Example: /state_house?state=illinois&district_name=25
    """
    result = get_district_info(state, "lower", district)
    return result
