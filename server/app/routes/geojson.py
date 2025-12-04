from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse

from app.services.geojson_service import (
    get_cd_service,
    get_county_service,
    get_cousub_service,
    get_place_service,
    get_sldl_service,
    get_sldu_service,
    get_states_service,
)

router = APIRouter()


# States
@router.get("/states")
async def get_states():
    response = await get_states_service()
    return JSONResponse(content=response.model_dump())


# State Senate (sldu)
@router.get("/sldu/{stateFP}")
async def get_sldu(
    stateFP: str, stateUSPS: str = Query(..., description="Two-letter USPS state code")
):
    response = await get_sldu_service(stateFP, stateUSPS)
    return JSONResponse(content=response.model_dump())


# State House (sldl)
@router.get("/sldl/{stateFP}")
async def get_sldl(
    stateFP: str, stateUSPS: str = Query(..., description="Two-letter USPS state code")
):
    response = await get_sldl_service(stateFP, stateUSPS)
    return JSONResponse(content=response.model_dump())


# Congressional Districts (cd)
@router.get("/cd/{stateFP}")
async def get_cd(
    stateFP: str, stateUSPS: str = Query(..., description="Two-letter USPS state code")
):
    response = await get_cd_service(stateFP, stateUSPS)
    return JSONResponse(content=response.model_dump())


# Counties (county)
@router.get("/county/{stateFP}")
async def get_county(
    stateFP: str, stateUSPS: str = Query(..., description="Two-letter USPS state code")
):
    response = await get_county_service(stateFP, stateUSPS)
    return JSONResponse(content=response.model_dump())


# City Boundaries (place)
@router.get("/place/{stateFP}")
async def get_place(
    stateFP: str, stateUSPS: str = Query(..., description="Two-letter USPS state code")
):
    response = await get_place_service(stateFP, stateUSPS)
    return JSONResponse(content=response.model_dump())


# County Subdivisions (cousub)
@router.get("/cousub/{stateFP}")
async def get_cousub(
    stateFP: str, stateUSPS: str = Query(..., description="Two-letter USPS state code")
):
    response = await get_cousub_service(stateFP, stateUSPS)
    return JSONResponse(content=response.model_dump())
