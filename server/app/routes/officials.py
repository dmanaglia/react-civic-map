import os
import time
import requests
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv

load_dotenv()

GPO_CONGRESS_APIKEY = os.getenv("GPO_CONGRESS_APIKEY")

router = APIRouter()

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

    