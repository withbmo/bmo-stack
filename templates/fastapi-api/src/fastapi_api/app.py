from fastapi import FastAPI

from fastapi_api.routes.health import router as health_router
from fastapi_api.routes.root import router as root_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="Pytholit FastAPI Template",
        description="A modern Python API starter built with uv and FastAPI.",
    )
    app.include_router(root_router)
    app.include_router(health_router)
    return app


app = create_app()
