from app.fetch.backdrop import Get_Backdrop_Cache
from app.fetch.census import fetch_and_filter_geojson
from app.schemas.models import (
    BackdropData,
    FeatureCollection,
    FederalData,
    FederalResponse,
    StateData,
    StateResponse,
)
from app.utils.cache import write_federal_cache, write_state_cache
from app.utils.summarize import Get_Federal_Cache, Get_State_Cache
from app.utils.utils import is_integer

BASE_URL = "https://www2.census.gov/geo/tiger/GENZ2024/shp/"


# 50 states map
async def get_states_service() -> FederalResponse:
    """Retrieve and process US states GeoJSON data."""
    federal_data = await Get_Federal_Cache()

    if isinstance(federal_data.map, FeatureCollection):
        return FederalResponse(summary=federal_data.summary, map=federal_data.map)

    url = f"{BASE_URL}cb_2024_us_state_500k.zip"
    geoJson = await fetch_and_filter_geojson(url)

    senator_map = federal_data.map.root
    for feature in geoJson.features:
        stateName = feature.properties["NAME"]
        senatorList = senator_map.get(stateName, [])
        feature.properties.update({"senators": senatorList})

    # SHOULD I WRITE GEOJSON TO CACHE??? OR IS IT TOO BULKY
    write_federal_cache(FederalData(summary=federal_data.summary, map=geoJson))

    return FederalResponse(summary=federal_data.summary, map=geoJson)


# State Upper Chamber (Senate) Districts
async def get_sldu_service(stateFP: str, stateUSPS: str) -> StateResponse:
    state_data = await Get_State_Cache(stateUSPS.upper())

    if isinstance(state_data.map.senate, FeatureCollection):
        return StateResponse(summary=state_data.summary, map=state_data.map.senate)

    url = f"{BASE_URL}cb_2024_{stateFP}_sldu_500k.zip"
    geoJson = await fetch_and_filter_geojson(url)

    state_senate_map = state_data.map.senate.root
    for feature in geoJson.features:
        id = feature.properties["NAME"]
        # handle unique case in Vermont where census map id does not match open states district id
        if id == "Chittenden South East":
            id = "Chittenden Southeast"
        # remove starting 0 from single digit districts (01 -> 1) to match DistrictMap
        if is_integer(id):
            id = f"{int(id)}"
        feature.properties.update({"party": state_senate_map.get(id, "")})

    write_state_cache(
        StateData(
            summary=state_data.summary, map=state_data.map.model_copy(update={"senate": geoJson})
        ),
        state_abbr=stateUSPS,
    )

    return StateResponse(summary=state_data.summary, map=geoJson)


# State Lower Chamber (House) Districts
async def get_sldl_service(stateFP: str, stateUSPS: str) -> StateResponse:
    state_data = await Get_State_Cache(stateUSPS.upper())

    if isinstance(state_data.map.house, FeatureCollection):
        return StateResponse(summary=state_data.summary, map=state_data.map.house)

    url = f"{BASE_URL}cb_2024_{stateFP}_sldl_500k.zip"
    geoJson = await fetch_and_filter_geojson(url)

    state_house_map = state_data.map.house.root
    for feature in geoJson.features:
        id = feature.properties["NAME"]
        # remove starting 0 from single digit districts (01 -> 1) to match DistrictMap
        if is_integer(id):
            id = f"{int(id)}"
        feature.properties.update({"party": state_house_map.get(id, "")})

    write_state_cache(
        StateData(
            summary=state_data.summary, map=state_data.map.model_copy(update={"house": geoJson})
        ),
        state_abbr=stateUSPS,
    )

    return StateResponse(summary=state_data.summary, map=geoJson)


# State Congressional House Districts
async def get_cd_service(stateFP: str, stateUSPS: str) -> StateResponse:
    state_data = await Get_State_Cache(stateUSPS.upper())

    if isinstance(state_data.map.congressional, FeatureCollection):
        return StateResponse(summary=state_data.summary, map=state_data.map.congressional)

    url = f"{BASE_URL}cb_2024_us_cd119_500k.zip"  # Only national shapefile exists
    geoJson = await fetch_and_filter_geojson(url, state_filter=stateFP)

    state_congressional_map = state_data.map.congressional.root
    for feature in geoJson.features:
        id = feature.properties["CD119FP"]
        # remove starting 0 from single digit districts (01 -> 1) to match DistrictMap
        # Congressional districts are never words, unline some state districts
        id = f"{int(id)}"
        feature.properties.update({"party": state_congressional_map.get(id, "")})

    write_state_cache(
        StateData(
            summary=state_data.summary,
            map=state_data.map.model_copy(update={"congressional": geoJson}),
        ),
        state_abbr=stateUSPS,
    )

    return StateResponse(summary=state_data.summary, map=geoJson)


# Counties (county)
async def get_county_service(stateFP: str, stateUSPS: str) -> StateResponse:
    state_data = await Get_State_Cache(stateUSPS.upper())

    # Not caching map data as it's not currently atatched to any offical data
    url = f"{BASE_URL}cb_2024_us_county_500k.zip"  # Only national shapefile exists
    geoJson = await fetch_and_filter_geojson(url, state_filter=stateFP)

    return StateResponse(summary=state_data.summary, map=geoJson)


# City Boundaries (place)
async def get_place_service(stateFP: str, stateUSPS: str) -> StateResponse:
    state_data = await Get_State_Cache(stateUSPS.upper())

    # Not caching map data as it's not currently atatched to any offical data
    url = f"{BASE_URL}cb_2024_us_place_500k.zip"  # Only national shapefile exists
    geoJson = await fetch_and_filter_geojson(url, state_filter=stateFP)

    return StateResponse(summary=state_data.summary, map=geoJson)


# County Subdivisions (cousub)
async def get_cousub_service(stateFP: str, stateUSPS: str) -> StateResponse:
    state_data = await Get_State_Cache(stateUSPS.upper())

    # Not caching map data as it's not currently atatched to any offical data
    url = f"{BASE_URL}cb_2024_us_cousub_500k.zip"  # Only national shapefile exists
    geoJson = await fetch_and_filter_geojson(url, state_filter=stateFP)

    return StateResponse(summary=state_data.summary, map=geoJson)


async def get_backdrop_service() -> BackdropData:
    backdrop_data = await Get_Backdrop_Cache()
    return BackdropData(
        cities=backdrop_data.cities, roads=backdrop_data.roads, water=backdrop_data.water
    )
