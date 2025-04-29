from typing import Any


def validate_attributes(body: Any, required_parameters: list[str]) -> str | None:
    for field in required_parameters:
        if (field not in body) or (type(body[field]) == str and len(body[field]) < 1):
            return f"Campo faltando: {field}"
    return None