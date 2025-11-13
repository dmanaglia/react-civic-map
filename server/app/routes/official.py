from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.services.official_service import get_cd_official_service, get_sldl_official_service, get_sldu_official_service

router = APIRouter()

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
