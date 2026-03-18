from fastapi import APIRouter

from fastapi_api.services.status_service import service_status

router = APIRouter()


@router.get("/")
def read_root() -> dict[str, str | bool]:
    return service_status()
