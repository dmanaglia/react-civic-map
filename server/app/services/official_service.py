from app.fetch.address import fetch_all_officials_by_address
from app.fetch.congress import Fetch_Congress_District_Official
from app.fetch.openStates import Fetch_State_District_Official
from app.schemas.models import AddressOfficials, Official


async def get_all_your_officials_service(address: str) -> AddressOfficials:
    officials = await fetch_all_officials_by_address(address)
    return officials


async def get_cd_official_service(stateUSPS: str, districtID: str) -> Official:
    official = await Fetch_Congress_District_Official(stateUSPS, districtID)
    return official


async def get_sldu_official_service(stateUSPS: str, districtID: str) -> Official:
    official = await Fetch_State_District_Official(stateUSPS, "upper", districtID)
    return official


async def get_sldl_official_service(stateUSPS: str, districtID: str) -> Official:
    official = await Fetch_State_District_Official(stateUSPS, "lower", districtID)
    return official
