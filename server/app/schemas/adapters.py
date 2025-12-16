from app.schemas.models import Official, Term


def normalize_name(name: str) -> str:
    """
    Normalize names by removing middle initials.

    Handles formats:
    - "Last, First Middle" -> "Last, First"
    - "Last, First" -> "Last, First"

    Args:
        name: Name string in "Last, First" or "Last, First M." format

    Returns:
        Normalized name as "Last, First"
    """
    parts = name.split(",")

    if len(parts) != 2:
        return name

    last_name = parts[0].strip()
    first_and_middle = parts[1].strip()

    first_name = first_and_middle.split()[0]

    return f"{first_name} {last_name}"


def normalize_cd_official(data: dict) -> Official:
    return Official(
        name=normalize_name(data["name"]),
        party=data.get("partyName"),
        state=data.get("state"),
        district=str(data.get("district")),
        depiction_url=data.get("depiction", {}).get("imageUrl"),
        bio_id=data.get("bioguideId"),
        terms=[
            Term(
                chamber=term.get("chamber"),
                start_year=term.get("startYear"),
                end_year=term.get("endYear"),
            )
            for term in data.get("terms", {}).get("item", [])
        ],
        metadata=data,  # keep original API response for flexibility
    )


def normalize_state_legislator(data: dict) -> Official:
    return Official(
        name=data.get("name") or f"{data.get('given_name')} {data.get('family_name')}",
        party=data.get("party"),
        state=data.get("jurisdiction", {}).get("name"),
        title=data.get("current_role", {}).get("title", ""),
        district=data.get("current_role", {}).get("district"),
        depiction_url=data.get("image"),
        metadata=data,
    )
