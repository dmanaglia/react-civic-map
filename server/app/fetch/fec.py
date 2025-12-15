import os

import httpx
from dotenv import load_dotenv

from app.schemas.models import CampaignSummary, FECSummary

load_dotenv()

OPEN_FEC_APIKEY = os.getenv("OPEN_FEC_APIKEY")
BASE_URL = "https://api.open.fec.gov/v1"


async def search_candidates_by_name(name: str) -> str:
    """Search for candidates by name"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/candidates/search/", params={"name": name, "api_key": OPEN_FEC_APIKEY}
        )
        response.raise_for_status()
        data = response.json()
        result = data.get("results", [])[0]
        return result.get("candidate_id", "")


async def get_candidate_details(candidate_id: str) -> FECSummary:
    """Get detailed candidate information"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{BASE_URL}/candidate/{candidate_id}/", params={"api_key": OPEN_FEC_APIKEY}
        )
        response.raise_for_status()
        data = response.json()
        result = data.get("results", [])[0]
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


# async def get_candidates_by_district(
#     state: str,
#     district: str,
#     office: str = "H",
#     cycle: int = 2024
# ) -> Dict:
#     """Search for candidates by state and district"""
#     async with httpx.AsyncClient() as client:
#         response = await client.get(
#             f"{BASE_URL}/candidates/search/",
#             params={
#                 "state": state,
#                 "district": district.zfill(2),  # Pad district to 2 digits
#                 "office": office,
#                 "election_year": cycle,
#                 "api_key": OPEN_FEC_APIKEY
#             }
#         )
#         response.raise_for_status()
#         return response.json()


async def Fetch_Official_FEC_Summary(officialName: str) -> FECSummary:
    candidate_id = await search_candidates_by_name(officialName)
    details = await get_candidate_details(candidate_id)
    return details
