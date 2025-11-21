from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, RootModel


# ---------- GeoJSON (FeatureCollection) ----------
class Geometry(BaseModel):
    type: str
    coordinates: Any


class Feature(BaseModel):
    type: Literal["Feature"]
    geometry: Geometry
    properties: Dict[str, Any]


class FeatureCollection(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: List[Feature]


# ---------- Official ----------
class Term(BaseModel):
    chamber: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None


class Official(BaseModel):
    name: str
    party: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    title: Optional[str] = None
    depiction_url: Optional[str] = None
    bio_id: Optional[str] = None  # e.g., bioguideId
    terms: Optional[List[Term]] = []
    metadata: Optional[Dict] = {}  # catch-all for extra data you don’t use yet


# ---------- ChamberSummary ----------
class ChamberSummary(BaseModel):
    seats: int
    democrat: int
    republican: int
    independent: int
    other: int
    vacant: int
    non_voting: Optional[int] = None


# ---------- Inherited / Merged Classes ----------
class LegislativeSummary(BaseModel):
    house: ChamberSummary
    senate: ChamberSummary


class FederalSummary(BaseModel):
    executive: List[Official]
    legislative: LegislativeSummary
    judicial: List[Official]


class StateCongressionalSummary(BaseModel):
    senators: List[Official]
    house: ChamberSummary


class StateSummary(FederalSummary):
    federal: StateCongressionalSummary


# ---------- Dictionaries for Official Mapping to GeoJson ----------
class DistrictMap(RootModel[Dict[str, str]]):
    """A map of district IDs to party names."""

    pass


class StateMapData(BaseModel):
    senate: FeatureCollection | DistrictMap
    house: FeatureCollection | DistrictMap
    congressional: FeatureCollection | DistrictMap


class SenatorMap(RootModel[Dict[str, List[str]]]):
    """A map of state names to a list of senator parties."""

    pass


# ---------- State Data & Cache Data ----------
class StateData(BaseModel):
    summary: StateSummary
    map: StateMapData


class StateCache(StateData):
    lastUpdated: str


# ---------- Federal Data & Cache Data ----------
class FederalData(BaseModel):
    summary: FederalSummary
    map: FeatureCollection | SenatorMap


class FederalCache(FederalData):
    lastUpdated: str


# ---------- Response Classes ----------
class FederalResponse(BaseModel):
    summary: FederalSummary
    map: FeatureCollection


class StateResponse(BaseModel):
    summary: StateSummary
    map: FeatureCollection
