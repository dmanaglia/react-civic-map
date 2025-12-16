from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse

from app.services.official_service import (
    get_all_your_officials_service,
    get_cd_official_service,
    get_official_campaign_data_service,
    get_official_fec_service,
    get_sldl_official_service,
    get_sldu_official_service,
)

router = APIRouter()


# All your representatives given an address
@router.get("/{address}")
async def get_all_your_officials(address: str):
    officials = await get_all_your_officials_service(address)
    return JSONResponse(content=officials.model_dump())


# Congressional District Official
@router.get("/cd/{stateUSPS}/{districtID}")
async def get_congressional_official(stateUSPS: str, districtID: str):
    official = await get_cd_official_service(stateUSPS, districtID)
    return JSONResponse(content=official.model_dump())


# State Senate Official
@router.get("/sldu/{stateUSPS}/{districtID}")
async def get_state_senate(stateUSPS: str, districtID: str):
    official = await get_sldu_official_service(stateUSPS, districtID)
    return JSONResponse(content=official.model_dump())


# State House Official
@router.get("/sldl/{stateUSPS}/{districtID}")
async def get_state_house(stateUSPS: str, districtID):
    official = await get_sldl_official_service(stateUSPS, districtID)
    return JSONResponse(content=official.model_dump())


# Official FEC (Federal Election Commission) Data
@router.get("/fec/{officialName}")
async def get_official_fec(
    officialName: str,
    state: str = Query(..., description="State Name"),
    district: str = Query(..., description="District Number or 'None'"),
):
    details = await get_official_fec_service(officialName, state, district)
    return JSONResponse(content=details.model_dump())


@router.get("/fec/{officialID}/{cycle}")
async def get_official_campaign_data(officialID: str, cycle: int):
    details = await get_official_campaign_data_service(officialID, cycle)
    return JSONResponse(content=details.model_dump())
