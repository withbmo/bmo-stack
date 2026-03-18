# FastAPI API

Modern Python FastAPI starter for Pytholit.

## Stack

- Python 3.14
- uv
- FastAPI
- Uvicorn
- Ruff

## Init commands

- `uv init <dir> --app --package --vcs none --no-workspace`
- `uv add fastapi uvicorn[standard]`
- `uv add --dev ruff`

## Pytholit finalization

After initialization, Pytholit:

- keeps `src/fastapi_api/main.py` as a tiny runtime entrypoint
- composes the application in `src/fastapi_api/app.py`
- splits routes into `src/fastapi_api/routes`
- keeps config in `src/fastapi_api/config` and business logic in `src/fastapi_api/services`
- adds `pytholit.toml`

## Commands

- `uv sync`
- `uv run ruff check .`
- `uv run ruff format --check .`
- `uv run uvicorn fastapi_api.app:app --reload --host 0.0.0.0 --port 8000`
- `uv run uvicorn fastapi_api.app:app --host 0.0.0.0 --port 8000`

## Project structure

- `src/fastapi_api/main.py`: runtime entrypoint only
- `src/fastapi_api/app.py`: FastAPI app composition
- `src/fastapi_api/routes`: API route modules
- `src/fastapi_api/config`: settings and env parsing
- `src/fastapi_api/services`: business logic
- `src/fastapi_api/lib`: shared helpers

Add transport code in `routes`, but keep real logic in `services`.

## Manifest

`pytholit.toml` is the source of truth for runtime, routing, and environment expectations.

See [../ARCHITECTURE.md](../ARCHITECTURE.md) for the shared template contract.
