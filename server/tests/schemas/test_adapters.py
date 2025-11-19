from app.schemas.adapters import normalize_cd_official, normalize_state_legislator
from app.schemas.models import Official, Term


def test_normalize_cd_official_minimal():
    data = {
        "name": "Jane Doe",
        "partyName": "Independent",
        "state": "CA",
        "district": 12,
        "depiction": {"imageUrl": "http://example.com/image.png"},
        "bioguideId": "ABCDEF",
        "terms": {"item": [{"chamber": "house", "startYear": 2020, "endYear": 2022}]},
    }

    official = normalize_cd_official(data)

    assert isinstance(official, Official)
    assert official.name == "Jane Doe"
    assert official.party == "Independent"
    assert official.state == "CA"
    assert official.district == "12"
    assert official.depiction_url == "http://example.com/image.png"
    assert official.bio_id == "ABCDEF"
    assert len(official.terms) == 1
    term = official.terms[0]
    assert isinstance(term, Term)
    assert term.chamber == "house"
    assert term.start_year == 2020
    assert term.end_year == 2022
    assert official.metadata == data


def test_normalize_state_legislator_fallback_name():
    data = {
        "given_name": "John",
        "family_name": "Smith",
        "party": "Democrat",
        "jurisdiction": {"name": "NY"},
        "current_role": {"district": "5"},
        "image": "http://example.com/john.png",
    }

    official = normalize_state_legislator(data)

    assert isinstance(official, Official)
    assert official.name == "John Smith"
    assert official.party == "Democrat"
    assert official.state == "NY"
    assert official.district == "5"
    assert official.depiction_url == "http://example.com/john.png"
    assert official.metadata == data
