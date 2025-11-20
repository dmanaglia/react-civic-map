from app.utils.utils import (
    format_string,
    is_integer,
)


def test_is_integer_with_integer_string():
    assert is_integer("123") is True
    assert is_integer("0") is True
    assert is_integer("abc") is False


def test_format_string_with_number():
    assert format_string("item 1") == "item 01"
    assert format_string("item 12") == "item 12"
    assert format_string("42") == "42"
