from app.schemas.models import Official, Term


def normalize_cd_official(data: dict) -> Official:
    return Official(
        name=data["name"],
        party=data.get("partyName"),
        state=data.get("state"),
        district=str(data.get("district")),
        depiction_url=data.get("depiction", {}).get("imageUrl"),
        bio_id=data.get("bioguideId"),
        terms=[
            Term(chamber=term.get("chamber"), start_year=term.get("startYear"), end_year=term.get("endYear"))
            for term in data.get("terms", {}).get("item", [])
        ],
        metadata=data  # keep original API response for flexibility
    )

def normalize_state_legislator(data: dict) -> Official:
    return Official(
        name=data.get("name") or f"{data.get('given_name')} {data.get('family_name')}",
        party=data.get("party"),
        state=data.get("jurisdiction", {}).get("name"),
        district=data.get("current_role", {}).get("district"),
        depiction_url=data.get("image"),
        metadata=data
    )
