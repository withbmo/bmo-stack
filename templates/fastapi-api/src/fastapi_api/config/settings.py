import os
from dataclasses import dataclass


def read_port() -> int:
    raw_port = os.getenv("PORT", "8000")

    try:
        return int(raw_port)
    except ValueError as error:
        raise ValueError(f'Invalid PORT value "{raw_port}"') from error


@dataclass(frozen=True)
class Settings:
    port: int


settings = Settings(port=read_port())
