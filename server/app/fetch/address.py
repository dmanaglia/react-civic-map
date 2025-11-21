import os

import googlemaps
from dotenv import load_dotenv
from shapely.geometry import Point, shape

from app.fetch.congress import Fetch_Congress_District_Official
from app.fetch.openStates import Fetch_State_District_Official
from app.schemas.models import FeatureCollection, Official
from app.utils.summarize import Get_State_Cache

load_dotenv()
GEOCODING_APIKEY = os.getenv("GEOCODING_APIKEY")


gmaps = googlemaps.Client(key=GEOCODING_APIKEY)


def fetch_coords_from_address(address: str):
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


def find_district(
    point_lat: float, point_lng: float, geojson_data: FeatureCollection, district_type: str
):
    """
    geojson_data: dict loaded from GeoJSON
    district_type: string for logging, e.g., "congressional", "state_senate"
    """
    point = Point(point_lng, point_lat)  # Note: GeoJSON uses [lng, lat]
    for feature in geojson_data.features:
        polygon = shape(feature.geometry.model_dump())
        if polygon.contains(point):
            dist_name = feature.properties.get("NAME", "")
            print(f"Point is in {district_type} district: {dist_name}")
            return feature.properties  # You can extract the district ID here
    print(f"No {district_type} district found for point")
    return None


async def fetch_all_officials_by_address(address: str) -> list[Official]:
    lat, lng, state_code = fetch_coords_from_address(address)

    stateData = await Get_State_Cache(state_code)

    # TODO
    # It's possible state maps will not be feature collection;
    # in which case extra fetch calls will be needed

    state_house_geojson = stateData.map.house
    state_senate_geojson = stateData.map.senate
    congressional_geojson = stateData.map.congressional

    address_officials: list[Official] = []
    for official in stateData.summary.federal.senators:
        address_officials.append(official)

    # Find districts
    cd_properties = find_district(lat, lng, congressional_geojson, "congressional")
    senate_properties = find_district(lat, lng, state_senate_geojson, "state_senate")
    house_properties = find_district(lat, lng, state_house_geojson, "state_house")

    congressional_official = await Fetch_Congress_District_Official(
        state_code, cd_properties.get("CD119FP", "")
    )
    address_officials.append(congressional_official)
    state_senate_official = await Fetch_State_District_Official(
        state_code, "upper", senate_properties.get("NAME", "")
    )
    address_officials.append(state_senate_official)
    state_house_official = await Fetch_State_District_Official(
        state_code, "lower", house_properties.get("NAME", "")
    )
    address_officials.append(state_house_official)

    return address_officials
