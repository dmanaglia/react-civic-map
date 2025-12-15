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


class AddressFeature(BaseModel):
    feature: Feature
    official: Official


class AddressOfficials(BaseModel):
    point: Any
    senate: AddressFeature
    house: AddressFeature
    congressional: AddressFeature
    senators: List[Official]


class FECSummary(BaseModel):
    name: str
    prefix: str
    suffix: str
    candidate_id: str
    party: str
    address_street: str
    address_city: str
    address_state: str
    address_zip: str
    office: str
    district: int
    cycles: List[int]
    election_districts: List[str]
    election_years: List[int]


class CampaignSummary(BaseModel):
    # Top-line numbers
    total_raised: float
    total_spent: float
    cash_on_hand: float
    total_debt: float

    # Funding sources (amounts)
    individual_contributions: float
    pac_contributions: float
    party_contributions: float
    self_funded: float

    # Funding sources (percentages)
    individual_percent: float
    pac_percent: float

    # Donor breakdown
    small_donor_amount: float  # <$200
    large_donor_amount: float  # >$200
    small_donor_percent: float

    # Calculated metrics
    burn_rate: float  # Spending vs raising
    financial_health_score: float  # Cash - Debt
    pac_dependency_level: str  # "Low", "Moderate", "High"
