from app.fetch.congress import Fetch_All_Congress_Officials, Fetch_All_Congress_Officials_For_State
from app.fetch.openStates import Fetch_All_State_Officials
from app.schemas.models import (
    ChamberSummary,
    DistrictMap,
    FederalCache,
    FederalData,
    FederalSummary,
    LegislativeSummary,
    SenatorMap,
    StateCache,
    StateCongressionalSummary,
    StateData,
    StateMapData,
    StateSummary,
)
from app.utils.cache import read_cache, write_federal_cache, write_state_cache
from app.utils.utils import format_string


async def Summarize_Federal_Gov_Data() -> FederalData:
    senate_members, house_members, non_voting_house_members = await Fetch_All_Congress_Officials()

    summary = FederalSummary(
        executive=[],  # TODO
        legislative=LegislativeSummary(
            house=ChamberSummary(
                seats=435,
                democrat=0,
                republican=0,
                independent=0,
                other=0,
                vacant=435 - len(house_members),  # TODO maybe find better way to find vacancies
                non_voting=len(non_voting_house_members),
            ),
            senate=ChamberSummary(
                seats=100,
                democrat=0,
                republican=0,
                independent=0,
                other=0,
                vacant=100 - len(senate_members),  # TODO maybe find better way to find vacancies
            ),
        ),
        judicial=[],  # TODO
    )

    senatorMap = SenatorMap({})

    for member in house_members:
        party = member.party.lower()

        # Count House
        if "democrat" in party:
            summary.legislative.house.democrat += 1
        elif "republican" in party:
            summary.legislative.house.republican += 1
        elif "independent" in party:
            summary.legislative.house.independent += 1
        else:
            summary.legislative.house.other += 1

    for member in senate_members:
        state = member.state
        party = member.party.lower()

        # Map senators to each state to be applied to map feature properties
        senatorMap.root.setdefault(state, []).append(party)

        # Count Senate
        if "democrat" in party:
            summary.legislative.senate.democrat += 1
        elif "republican" in party:
            summary.legislative.senate.republican += 1
        elif "independent" in party:
            summary.legislative.senate.independent += 1
        else:
            summary.legislative.senate.other += 1

    return FederalData(summary=summary, map=senatorMap)


async def Summarize_State_Gov_Data(state_abbr: str) -> StateData:
    federal_senators, federal_house = await Fetch_All_Congress_Officials_For_State(state_abbr)
    state_senate, state_house, state_executive = await Fetch_All_State_Officials(state_abbr)
    summary = StateSummary(
        executive=state_executive,  # TODO most state_executive data is very incomplete
        legislative=LegislativeSummary(
            house=ChamberSummary(
                seats=len(state_house),
                democrat=0,
                republican=0,
                independent=0,
                other=0,
                vacant=0,  # TODO Figure out a way to assess how many vacancies there are
            ),
            senate=ChamberSummary(
                seats=len(state_senate),
                democrat=0,
                republican=0,
                independent=0,
                other=0,
                vacant=0,  # TODO Figure out a way to assess how many vacancies there are
            ),
        ),
        judicial=[],  # TODO
        federal=StateCongressionalSummary(
            senators=federal_senators,
            house=ChamberSummary(
                seats=len(federal_house),
                democrat=0,
                republican=0,
                independent=0,
                other=0,
                vacant=0,  # TODO Figure out a way to assess how many vacancies there are
            ),
        ),
    )

    stateHouseMap = DistrictMap({})
    stateSenateMap = DistrictMap({})
    congressionalMap = DistrictMap({})

    for member in state_house:
        # Map state house members to district to be added to geojson feature properties
        party = member.party.lower()
        key = member.district
        if state_abbr == "NH":  # handle the New Hampshire special case
            key = format_string(key)
        stateHouseMap.root[key] = party

        # Count State House
        if "democrat" in party:
            summary.legislative.house.democrat += 1
        elif "republican" in party:
            summary.legislative.house.republican += 1
        elif "independent" in party:
            summary.legislative.house.independent += 1
        else:
            summary.legislative.house.other += 1

    for member in state_senate:
        # Map state senate members to district to be added to geojson feature properties
        party = member.party.lower()
        key = member.district
        stateSenateMap.root[key] = party

        # Count State Senate
        if "democrat" in party:
            summary.legislative.senate.democrat += 1
        elif "republican" in party:
            summary.legislative.senate.republican += 1
        elif "independent" in party:
            summary.legislative.senate.independent += 1
        else:
            summary.legislative.senate.other += 1

    for member in federal_house:
        # Map federal house members to district to be added to geojson feature properties
        party = member.party.lower()
        key = member.district
        congressionalMap.root[key] = party

        # Count Federal House Representatives
        if "democrat" in party:
            summary.federal.house.democrat += 1
        elif "republican" in party:
            summary.federal.house.republican += 1
        elif "independent" in party:
            summary.federal.house.independent += 1
        else:
            summary.federal.house.other += 1

    return StateData(
        summary=summary,
        map=StateMapData(
            senate=stateSenateMap, house=stateHouseMap, congressional=congressionalMap
        ),
    )


async def Get_Federal_Cache() -> FederalCache:
    cached = read_cache(model=FederalCache)
    if cached:
        return cached

    data = await Summarize_Federal_Gov_Data()
    cache_data = write_federal_cache(data)

    return cache_data


async def Get_State_Cache(state_abbr: str) -> StateCache:
    state_abbr = state_abbr.upper()
    cached = read_cache(model=StateCache, state_abbr=state_abbr)
    if cached:
        return cached

    data = await Summarize_State_Gov_Data(state_abbr)
    cache_data = write_state_cache(data, state_abbr)

    return cache_data
