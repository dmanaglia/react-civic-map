import re


def is_integer(s):
    try:
        int(s)
        return True
    except ValueError:
        return False


def format_string(s: str) -> str:
    match = re.match(r"^(.*?)(?:\s+(\d+))?$", s.strip())
    name, number = match.groups()
    if number:
        return f"{name} {int(number):02d}"
    return name
