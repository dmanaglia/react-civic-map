import os

import httpx
from dotenv import load_dotenv

from app.schemas.models import CampaignSummary, FECSummary

load_dotenv()

OPEN_FEC_APIKEY = os.getenv("OPEN_FEC_APIKEY")
BASE_URL = "https://api.open.fec.gov/v1"


async def get_candidates_by_district(name: str, state: str, district: str) -> str:
    """Search for candidates by state and district"""
    office = "S" if district == "None" else "H"
    districtNum = "0" if office == "S" else district.zfill(2)
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/candidates/search/",
            params={
                "state": state,
                "district": districtNum,
                "office": office,
                # Not sure if this will cause issues for first time election winners
                "incumbent_challenge": "I",
                "api_key": OPEN_FEC_APIKEY,
            },
        )
        response.raise_for_status()
        data = response.json()
        # print(json.dumps(data, indent=4))
        lName = name.split()[1].upper()
        for result in data.get("results", []):
            if lName in result.get("name", ""):
                print("FOUND BY DISTRICT SEARCH")
                return result
        return {}


async def search_candidates_by_name(name: str, state: str, district: str) -> str:
    """Search for candidates by name"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/candidates/search/", params={"name": name, "api_key": OPEN_FEC_APIKEY}
        )
        response.raise_for_status()
        data = response.json()

        results = data.get("results", [])
        if len(results) == 0:
            print("FALLBACK ON DISTRICT SEARCH")
            result = await get_candidates_by_district(name, state, district)
            return result.get("candidate_id", "")
        elif results[0].get("state") != state:
            print("FALLBACK ON DISTRICT SEARCH")
            result = await get_candidates_by_district(name, state, district)
            return result.get("candidate_id", "")
        else:
            return results[0].get("candidate_id", "")


async def get_candidate_details(candidate_id: str) -> FECSummary:
    """Get detailed candidate information"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/candidate/{candidate_id}/", params={"api_key": OPEN_FEC_APIKEY}
        )
        response.raise_for_status()
        data = response.json()
        results = data.get("results", [])
        if len(results) == 0:
            return None

        result = results[0]

        return FECSummary(
            name=result.get("name", ""),
            prefix=result.get("prefix", ""),
            suffix=result.get("suffix", ""),
            candidate_id=candidate_id,
            party=result.get("party_full", ""),
            address_street=result.get("address_street_1", ""),
            address_city=result.get("address_city", ""),
            address_state=result.get("address_state", ""),
            address_zip=result.get("address_zip", ""),
            office=result.get("office_full", ""),
            district=result.get("district_number", ""),
            cycles=result.get("cycles", []),
            election_districts=result.get("election_districts", []),
            election_years=result.get("election_years", []),
        )


async def get_campaign_totals(candidate_id: str, cycle: int) -> CampaignSummary:
    """Get financial totals for a candidate"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/candidate/{candidate_id}/totals/",
            params={"cycle": cycle, "api_key": OPEN_FEC_APIKEY},
        )
        response.raise_for_status()
        data = response.json()
        result = data.get("results", [])[0]

        total_raised = result.get("receipts", 0)
        individual = result.get("individual_contributions", 0)
        pac = result.get("other_political_committee_contributions", 0)

        # Calculate percentages
        individual_pct = (individual / total_raised * 100) if total_raised > 0 else 0
        pac_pct = (pac / total_raised * 100) if total_raised > 0 else 0

        small_donors = result.get("individual_unitemized_contributions", 0)
        small_donor_pct = (small_donors / individual * 100) if individual > 0 else 0

        # Determine PAC dependency level
        if pac_pct < 20:
            pac_level = "Low"
        elif pac_pct < 40:
            pac_level = "Moderate"
        else:
            pac_level = "High"

        return CampaignSummary(
            total_raised=total_raised,
            total_spent=result.get("disbursements", 0),
            cash_on_hand=result.get("last_cash_on_hand_end_period", 0),
            total_debt=result.get("last_debts_owed_by_committee", 0),
            individual_contributions=individual,
            pac_contributions=pac,
            party_contributions=result.get("political_party_committee_contributions", 0),
            self_funded=result.get("candidate_contribution", 0),
            individual_percent=round(individual_pct, 1),
            pac_percent=round(pac_pct, 1),
            small_donor_amount=small_donors,
            large_donor_amount=result.get("individual_itemized_contributions", 0),
            small_donor_percent=round(small_donor_pct, 1),
            burn_rate=(
                round((result.get("disbursements", 0) / total_raised * 100), 1)
                if total_raised > 0
                else 0
            ),
            financial_health_score=result.get("last_cash_on_hand_end_period", 0)
            - result.get("last_debts_owed_by_committee", 0),
            pac_dependency_level=pac_level,
        )


async def Fetch_Official_FEC_Summary(officialName: str, state: str, district: str) -> FECSummary:
    candidate_id = await search_candidates_by_name(officialName, state, district)
    details = await get_candidate_details(candidate_id)
    return details
