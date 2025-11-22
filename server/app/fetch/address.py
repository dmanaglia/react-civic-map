import os

import googlemaps
from dotenv import load_dotenv
from shapely.geometry import Point, shape

from app.fetch.congress import Fetch_Congress_District_Official
from app.fetch.openStates import Fetch_State_District_Official
from app.schemas.models import AddressFeature, AddressOfficials, FeatureCollection
from app.utils.summarize import Get_State_Cache

load_dotenv()
GEOCODING_APIKEY = os.getenv("GEOCODING_APIKEY")


def get_gmaps_client():
    if not GEOCODING_APIKEY:
        raise RuntimeError("GEOCODING_APIKEY is not set.")

    return googlemaps.Client(key=GEOCODING_APIKEY)


def fetch_coords_from_address(address: str):
    gmaps = get_gmaps_client()
    geocode_result = gmaps.geocode(address)
    if not geocode_result:
        raise ValueError("No geocode results found")

    # Get latitude and longitude
    location = geocode_result[0]["geometry"]["location"]
    lat, lng = location["lat"], location["lng"]

    # Extract state USPS code
    state_code = None
    for component in geocode_result[0]["address_components"]:
        if "administrative_area_level_1" in component["types"]:
            state_code = component["short_name"]  # USPS code, e.g., 'CA', 'NY'
            break

    if not state_code:
        raise ValueError("Could not determine state from address")

    print(f"Coordinates for {address}: {lat}, {lng}, state: {state_code}")
    return lat, lng, state_code


def find_district(point, geojson_data: FeatureCollection, district_type: str):
    """
    geojson_data: dict loaded from GeoJSON
    district_type: string for logging, e.g., "congressional", "state_senate"
    """
    for feature in geojson_data.features:
        polygon = shape(feature.geometry.model_dump())
        if polygon.contains(point):
            return feature
    print(f"No {district_type} district found for point")
    return None


async def fetch_all_officials_by_address(address: str) -> AddressOfficials:
    lat, lng, state_code = fetch_coords_from_address(address)

    point = Point(lng, lat)
    stateData = await Get_State_Cache(state_code)

    # TODO
    # It's possible state maps will not be feature collection;
    # in which case extra fetch calls will be needed
    state_house_geojson = stateData.map.house
    state_senate_geojson = stateData.map.senate
    congressional_geojson = stateData.map.congressional

    # Find districts
    cd_feature = find_district(point, congressional_geojson, "congressional")
    senate_feature = find_district(point, state_senate_geojson, "state_senate")
    house_feature = find_district(point, state_house_geojson, "state_house")

    congressional_official = await Fetch_Congress_District_Official(
        state_code, cd_feature.properties.get("CD119FP", "")
    )
    state_senate_official = await Fetch_State_District_Official(
        state_code, "upper", senate_feature.properties.get("NAME", "")
    )
    state_house_official = await Fetch_State_District_Official(
        state_code, "lower", house_feature.properties.get("NAME", "")
    )

    return AddressOfficials(
        point=point.__geo_interface__,
        senate=AddressFeature(feature=senate_feature, official=state_senate_official),
        house=AddressFeature(feature=house_feature, official=state_house_official),
        congressional=AddressFeature(feature=cd_feature, official=congressional_official),
        senators=stateData.summary.federal.senators,
    )
