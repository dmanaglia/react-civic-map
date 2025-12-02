from app.fetch.census import fetch_and_filter_geojson
from app.schemas.models import BackdropCache, BackdropData
from app.utils.cache import read_cache, write_backdrop_cache


async def Get_Backdrop_Cache() -> BackdropCache:
    cached = read_cache(model=BackdropCache, backdrop=True)
    if cached:
        return cached

    data = await Get_Backdrop_Data()
    cache_data = write_backdrop_cache(data)

    return cache_data


async def Get_Backdrop_Data() -> BackdropData:
    """
    Fetch backdrop GeoJSON data from US Census TIGER database.
    Downloads shapefiles, converts to GeoJSON, and returns BackdropData.
    """

    # === CITIES (Places) *** DOESNT HAVE NATIONAL ZIP FILE, ONLY FILE PER STATE *** ===
    # print("Fetching cities data from Census...")
    # cities_url = "https://www2.census.gov/geo/tiger/TIGER2023/PLACE/tl_2023_us_place.zip"
    # cities_geojson = await fetch_and_filter_geojson(cities_url)
    # print(json.dumps(cities_geojson, indent=2))

    # === ROADS ===
    print("Fetching roads data from Census...")
    roads_url = (
        "https://www2.census.gov/geo/tiger/TIGER2023/PRIMARYROADS/tl_2023_us_primaryroads.zip"
    )
    roads_geojson = await fetch_and_filter_geojson(roads_url)

    # === WATER (Area Hydrography) *** DOESNT HAVE NATIONAL ZIP FILE,
    # ONLY FILE PER WATER AREA *** ===
    # print("Fetching water data from Census...")
    # # National area hydrography (lakes, reservoirs, etc.)
    # water_url = "https://www2.census.gov/geo/tiger/TIGER2023/AREAWATER/tl_2023_us_areawater.zip"
    # water_geojson = await fetch_and_filter_geojson(water_url)

    # print("Backdrop data fetched successfully from Census")

    return BackdropData(
        # cities=FeatureCollection(**cities_geojson),
        roads=roads_geojson
        # water=FeatureCollection(**water_geojson),
    )
