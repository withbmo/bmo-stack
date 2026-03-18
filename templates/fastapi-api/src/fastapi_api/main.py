import uvicorn

from fastapi_api.config.settings import settings
from fastapi_api.lib.server import host


def main() -> None:
    uvicorn.run("fastapi_api.app:app", host=host(), port=settings.port)
