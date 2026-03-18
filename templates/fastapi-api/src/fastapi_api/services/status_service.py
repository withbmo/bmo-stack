def service_status() -> dict[str, str | bool]:
    return {
        "service": "fastapi-api",
        "ok": True,
        "message": "Pytholit FastAPI template is running",
    }
